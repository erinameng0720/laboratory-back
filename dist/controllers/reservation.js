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
exports.review = exports.create = exports.getId = exports.getAll = void 0;
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const reservation_1 = __importDefault(require("../models/reservation"));
const instrument_1 = __importDefault(require("../models/instrument"));
const paramsSchema = yup.object({
    id: yup
        .string()
        .typeError('資料格式錯誤')
        .required('ID 必填')
        .trim()
        .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
});
const createBodySchema = yup.object({
    instrument_id: yup
        .string()
        .typeError('儀器 ID 格式錯誤')
        .required('儀器必填')
        .trim()
        .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
    start_time: yup.date().typeError('開始時間格式錯誤').required('開始時間必填'),
    end_time: yup.date().typeError('結束時間格式錯誤').required('結束時間必填'),
});
const reviewBodySchema = yup.object({
    status: yup
        .string()
        .typeError('預約狀態格式錯誤')
        .required('審核結果必填')
        .oneOf(['confirmed', 'cancelled'], '審核結果錯誤'),
    cancel_reason: yup.string().typeError('取消原因格式錯誤').trim().optional(),
});
const cancelBodySchema = yup.object({
    cancel_reason: yup
        .string()
        .typeError('取消原因格式錯誤')
        .required('取消原因必填')
        .trim()
        .min(1, '取消原因必填'),
});
const ensureTimeRange = (startTime, endTime) => {
    if (startTime >= endTime) {
        throw new Error('INVALID RESERVATION TIME');
    }
};
/**
 * 檢查同一台儀器在指定時間是否已有「佔用時段」的 Reservation。
 * pending / confirmed 都會佔用時段，cancelled 不會。
 */
const ensureNoConflict = async (instrumentId, startTime, endTime, excludeId) => {
    const query = reservation_1.default.findOne({
        instrument_id: instrumentId,
        status: (0, mongoose_1.trusted)({ $in: ['pending', 'confirmed'] }),
        start_time: (0, mongoose_1.trusted)({ $lt: endTime }),
        end_time: (0, mongoose_1.trusted)({ $gt: startTime }),
    });
    if (excludeId) {
        query.where({ _id: (0, mongoose_1.trusted)({ $ne: excludeId }) });
    }
    const conflict = await query;
    if (conflict) {
        throw new Error('RESERVATION CONFLICT');
    }
};
/**
 * GET /reservation
 * User：只能查看自己的預約。
 * Admin：可以查看全部預約。
 */
const getAll = async (req, res) => {
    const filter = req.user.role === 'admin' ? {} : { user_id: req.user._id };
    const result = await reservation_1.default.find(filter)
        .sort({ start_time: 1, createdAt: -1 })
        .populate('user_id', 'username email role')
        .populate('instrument_id', 'name model status')
        .populate('reviewed_by', 'username email role');
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getAll = getAll;
/**
 * GET /reservation/:id
 * User：只能查看自己的預約。
 * Admin：可以查看任何預約。
 */
const getId = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const filter = req.user.role === 'admin'
        ? { _id: parsedParams.id }
        : { _id: parsedParams.id, user_id: req.user._id };
    const result = await reservation_1.default.findOne(filter)
        .populate('user_id', 'username email role')
        .populate('instrument_id', 'name model status')
        .populate('reviewed_by', 'username email role');
    if (!result) {
        if (req.user.role !== 'admin') {
            throw new Error('RESERVATION FORBIDDEN');
        }
        throw new Error('RESERVATION NOT FOUND');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getId = getId;
/**
 * POST /reservation
 * 建立預約後直接進入 pending。
 * user_id 不接受 Frontend 傳入，而是從 req.user 取得。
 */
const create = async (req, res) => {
    const parsedBody = await createBodySchema.validate(req.body, { stripUnknown: true });
    ensureTimeRange(parsedBody.start_time, parsedBody.end_time);
    const instrument = await instrument_1.default.findById(parsedBody.instrument_id).orFail(new Error('INSTRUMENT NOT FOUND'));
    if (instrument.status === 'maintenance') {
        throw new Error('INSTRUMENT MAINTENANCE');
    }
    await ensureNoConflict(parsedBody.instrument_id, parsedBody.start_time, parsedBody.end_time);
    const result = await reservation_1.default.create({
        user_id: req.user._id,
        instrument_id: instrument._id,
        start_time: parsedBody.start_time,
        end_time: parsedBody.end_time,
        status: 'pending',
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '預約申請成功，等待管理員審核',
        result,
    });
};
exports.create = create;
/**
 * PATCH /reservation/:id/review
 * 只有 Admin 可以審核。
 * confirmed：建立確認結果。
 * cancelled：必須留下 cancel_reason。
 */
const review = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const parsedBody = await reviewBodySchema.validate(req.body, { stripUnknown: true });
    if (parsedBody.status === 'cancelled' && !parsedBody.cancel_reason?.trim()) {
        throw new yup.ValidationError('取消原因必填');
    }
    if (parsedBody.status === 'confirmed' && parsedBody.cancel_reason?.trim()) {
        throw new yup.ValidationError('已確認的預約不可填寫取消原因');
    }
    const reservation = await reservation_1.default.findById(parsedParams.id).orFail(new Error('RESERVATION NOT FOUND'));
    if (parsedBody.status === 'confirmed' && reservation.status !== 'pending') {
        throw new Error('RESERVATION STATUS INVALID');
    }
    if (parsedBody.status === 'cancelled' &&
        !['pending', 'confirmed'].includes(reservation.status)) {
        throw new Error('RESERVATION STATUS INVALID');
    }
    if (parsedBody.status === 'confirmed') {
        const instrumentExists = await instrument_1.default.exists({ _id: reservation.instrument_id });
        if (!instrumentExists) {
            throw new Error('INSTRUMENT NOT FOUND');
        }
        await ensureNoConflict(reservation.instrument_id.toString(), reservation.start_time, reservation.end_time, reservation._id.toString());
    }
    reservation.status = parsedBody.status;
    reservation.reviewed_by = req.user._id;
    reservation.reviewed_at = new Date();
    if (parsedBody.status === 'cancelled') {
        reservation.cancel_reason = parsedBody.cancel_reason.trim();
    }
    await reservation.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: parsedBody.status === 'confirmed' ? '預約確認成功' : '預約取消成功',
        result: reservation,
    });
};
exports.review = review;
//# sourceMappingURL=reservation.js.map