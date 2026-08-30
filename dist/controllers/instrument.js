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
exports.remove = exports.update = exports.create = exports.getId = exports.getAll = void 0;
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const instrument_1 = __importStar(require("../models/instrument"));
const instrumentLog_1 = __importDefault(require("../models/instrumentLog"));
const reservation_1 = __importDefault(require("../models/reservation"));
const bodySchema = yup.object({
    name: yup.string().typeError('資料格式錯誤').required('儀器名稱必填').trim(),
    model: yup.string().typeError('資料格式錯誤').required('儀器型號必填').trim(),
    status: yup
        .string()
        .typeError('資料格式錯誤')
        .oneOf(instrument_1.instrumentStatusOptions, '儀器狀態錯誤')
        .optional(),
    reason: yup.string().trim().optional(),
});
const updateBodySchema = yup
    .object({
    name: yup.string().typeError('資料格式錯誤').trim().optional(),
    model: yup.string().typeError('資料格式錯誤').trim().optional(),
    status: yup
        .string()
        .typeError('資料格式錯誤')
        .oneOf(instrument_1.instrumentStatusOptions, '儀器狀態錯誤')
        .optional(),
})
    .test('not-empty', '至少需要提供一個要修改的欄位', (value) => Object.keys(value).length > 0);
const parseRequestBody = (body) => {
    if (typeof body.data !== 'string')
        return body;
    try {
        return JSON.parse(body.data);
    }
    catch {
        throw new yup.ValidationError('資料格式錯誤');
    }
};
const paramsSchema = yup.object({
    id: yup
        .string()
        .typeError('資料格式錯誤')
        .required('ID 必填')
        .trim()
        .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
});
/**
 * GET /instrument
 * 已登入的 User / Admin 都可以查看儀器資料。
 */
const getAll = async (_req, res) => {
    const result = await instrument_1.default.find().sort({ createdAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getAll = getAll;
/**
 * GET /instrument/:id
 * 已登入的 User / Admin 都可以查看單一儀器。
 */
const getId = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const result = await instrument_1.default.findById(parsedParams.id).orFail(new Error('INSTRUMENT NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getId = getId;
/**
 * POST /instrument
 * 只有 Admin 可以新增儀器。
 *
 * status 沒有傳入時，會由 Instrument Schema 使用 default = available。
 */
const create = async (req, res) => {
    const requestBody = parseRequestBody(req.body);
    const parsedBody = await bodySchema.validate(requestBody, { stripUnknown: true });
    const result = await instrument_1.default.create({
        name: parsedBody.name,
        model: parsedBody.model,
        ...(parsedBody.status !== undefined ? { status: parsedBody.status } : {}),
        ...(req.file?.path ? { image_url: req.file.path } : {}),
    });
    await instrumentLog_1.default.create({
        instrument_id: result._id,
        user_id: req.user._id,
        action: 'add',
        reason: parsedBody.reason?.trim() || '新增儀器',
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '',
        result,
    });
};
exports.create = create;
/**
 * PATCH /instrument/:id
 * 只有 Admin 可以修改儀器。
 *
 * PATCH 採部分更新，因此所有欄位都是 optional，
 * 但至少必須提供一個欄位。
 */
const update = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const requestBody = parseRequestBody(req.body);
    const parsedBody = await updateBodySchema.validate(requestBody, { stripUnknown: true });
    const updateData = {
        ...parsedBody,
        ...(req.file?.path ? { image_url: req.file.path } : {}),
    };
    const result = await instrument_1.default.findByIdAndUpdate(parsedParams.id, updateData, {
        returnDocument: 'after',
        runValidators: true,
    }).orFail(new Error('INSTRUMENT NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.update = update;
/**
 * DELETE /instrument/:id
 * 只有 Admin 可以刪除儀器。
 *
 * 有 pending / confirmed 預約的儀器不可刪除，避免產生孤兒預約。
 * cancelled 預約是歷史資料，不會阻擋儀器刪除；Frontend 會以
 * 「已刪除儀器」顯示其 populate(null) 結果。
 */
const remove = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const hasActiveReservations = await reservation_1.default.exists({
        instrument_id: parsedParams.id,
        status: (0, mongoose_1.trusted)({ $in: ['pending', 'confirmed'] }),
    });
    if (hasActiveReservations) {
        throw new Error('INSTRUMENT HAS ACTIVE RESERVATIONS');
    }
    const result = await instrument_1.default.findByIdAndDelete(parsedParams.id).orFail(new Error('INSTRUMENT NOT FOUND'));
    await instrumentLog_1.default.create({
        instrument_id: result._id,
        user_id: req.user._id,
        action: 'remove',
        reason: typeof req.body.reason === 'string' && req.body.reason.trim()
            ? req.body.reason.trim()
            : '刪除儀器',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.remove = remove;
//# sourceMappingURL=instrument.js.map