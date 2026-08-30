"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjust = exports.remove = exports.add = void 0;
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const chemical_1 = __importDefault(require("../models/chemical"));
const chemicalLog_1 = __importDefault(require("../models/chemicalLog"));
const paramsSchema = yup.object({
    id: yup
        .string()
        .typeError('資料格式錯誤')
        .required('ID 必填')
        .trim()
        .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
});
const bodySchema = yup.object({
    quantity: yup
        .number()
        .typeError('異動數量必須是數字')
        .required('異動數量必填')
        .moreThan(0, '異動數量必須大於 0'),
    reason: yup
        .string()
        .typeError('異動原因必須是文字')
        .required('異動原因必填')
        .trim()
        .min(1, '異動原因必填'),
});
const stocktakeBodySchema = yup.object({
    target_amount: yup
        .number()
        .typeError('盤點庫存量必須是數字')
        .required('盤點庫存量必填')
        .min(0, '盤點庫存量不可小於 0'),
    reason: yup
        .string()
        .typeError('盤點原因必須是文字')
        .required('盤點原因必填')
        .trim()
        .min(1, '盤點原因必填'),
});
/**
 * 共用的庫存異動商業邏輯。
 * add：增加庫存
 * remove：減少庫存
 */
const adjustInventory = async (req, res, action) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const parsedBody = await bodySchema.validate(req.body, { stripUnknown: true });
    const session = await mongoose_1.default.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            const chemical = await chemical_1.default.findById(parsedParams.id).session(session);
            if (!chemical) {
                throw new Error('CHEMICAL NOT FOUND');
            }
            const beforeAmount = chemical.amount;
            const afterAmount = action === 'add'
                ? beforeAmount + parsedBody.quantity
                : beforeAmount - parsedBody.quantity;
            if (action === 'remove' && afterAmount < 0) {
                throw new Error('INSUFFICIENT STOCK');
            }
            chemical.amount = afterAmount;
            await chemical.save({ session });
            const [log] = await chemicalLog_1.default.create([
                {
                    chemical_id: chemical._id,
                    user_id: req.user._id,
                    action,
                    quantity: parsedBody.quantity,
                    before_amount: beforeAmount,
                    after_amount: afterAmount,
                    reason: parsedBody.reason,
                },
            ], { session });
            if (!log) {
                throw new Error('CHEMICAL LOG CREATE FAILED');
            }
            result = { chemical, log };
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: action === 'add' ? '庫存增加成功' : '庫存減少成功',
            result,
        });
    }
    finally {
        await session.endSession();
    }
};
/**
 * POST /chemical/:id/inventory/add
 * 只有 Admin 可以增加庫存。
 */
const add = async (req, res) => {
    await adjustInventory(req, res, 'add');
};
exports.add = add;
/**
 * POST /chemical/:id/inventory/remove
 * 只有 Admin 可以減少庫存。
 */
const remove = async (req, res) => {
    await adjustInventory(req, res, 'remove');
};
exports.remove = remove;
/**
 * POST /chemical/:id/inventory/adjust
 * 只有 Admin 可以依照實際盤點結果設定庫存量。
 * Backend 會以資料庫最新庫存計算差額，並建立 ChemicalLog。
 */
const adjust = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const parsedBody = await stocktakeBodySchema.validate(req.body, { stripUnknown: true });
    const session = await mongoose_1.default.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            const chemical = await chemical_1.default.findById(parsedParams.id).session(session);
            if (!chemical) {
                throw new Error('CHEMICAL NOT FOUND');
            }
            const beforeAmount = chemical.amount;
            const afterAmount = parsedBody.target_amount;
            const quantity = Math.abs(afterAmount - beforeAmount);
            if (quantity === 0) {
                result = { chemical, log: null };
                return;
            }
            const action = afterAmount > beforeAmount ? 'add' : 'remove';
            chemical.amount = afterAmount;
            await chemical.save({ session });
            const [log] = await chemicalLog_1.default.create([{
                    chemical_id: chemical._id,
                    user_id: req.user._id,
                    action,
                    quantity,
                    before_amount: beforeAmount,
                    after_amount: afterAmount,
                    reason: parsedBody.reason,
                }], { session });
            if (!log) {
                throw new Error('CHEMICAL LOG CREATE FAILED');
            }
            result = { chemical, log };
        });
        if (!result) {
            throw new Error('CHEMICAL LOG CREATE FAILED');
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: result.log ? '盤點庫存調整成功' : '盤點庫存量沒有變更',
            result,
        });
    }
    finally {
        await session.endSession();
    }
};
exports.adjust = adjust;
//# sourceMappingURL=inventory.js.map