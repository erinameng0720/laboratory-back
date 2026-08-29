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
const chemical_1 = __importStar(require("../models/chemical"));
const ghsSchema = yup.object({
    image_url: yup
        .string()
        .typeError('資料格式錯誤')
        .url('GHS 圖片 URL 格式錯誤')
        .required('GHS 圖片必填')
        .trim(),
    name: yup.string().typeError('資料格式錯誤').required('GHS 名稱必填').trim(),
    precautions: yup.string().typeError('資料格式錯誤').required('GHS 注意事項必填').trim(),
});
const msdsSchema = yup.object({
    source: yup
        .string()
        .typeError('資料格式錯誤')
        .required('MSDS 來源必填')
        .oneOf(['admin', 'external_api'], 'MSDS 來源錯誤'),
    title: yup.string().typeError('資料格式錯誤').required('MSDS 名稱必填').trim(),
    url: yup.string().typeError('資料格式錯誤').trim().optional(),
    content: yup.string().typeError('資料格式錯誤').trim().optional(),
});
const bodySchema = yup.object({
    name: yup.string().typeError('資料格式錯誤').required('藥品名稱必填').trim(),
    cas_number: yup.string().typeError('資料格式錯誤').required('CAS 編號必填').trim(),
    category: yup
        .string()
        .typeError('資料格式錯誤')
        .required('藥品分類必填')
        .oneOf(chemical_1.categoryOptions, '藥品分類錯誤'),
    ghs: yup.array().of(ghsSchema).optional(),
    amount: yup
        .number()
        .typeError('資料格式錯誤')
        .required('目前庫存量必填')
        .min(0, '目前庫存量不可小於 0'),
    total_quantity: yup
        .number()
        .typeError('資料格式錯誤')
        .required('安全總量必填')
        .min(0, '安全總量不可小於 0'),
    low_stock_threshold: yup
        .number()
        .typeError('資料格式錯誤')
        .required('低庫存門檻必填')
        .min(0, '低庫存門檻不可小於 0'),
    unit: yup
        .string()
        .typeError('資料格式錯誤')
        .required('庫存單位必填')
        .oneOf(chemical_1.unitOptions, '庫存單位錯誤'),
    location: yup.string().typeError('資料格式錯誤').required('儲存位置必填').trim(),
    image_url: yup.string().typeError('資料格式錯誤').trim().optional(),
    expireDate: yup.date().typeError('有效期限格式錯誤').optional(),
    msds: msdsSchema.optional(),
});
const updateBodySchema = yup
    .object({
    name: yup.string().typeError('資料格式錯誤').trim().optional(),
    cas_number: yup.string().typeError('資料格式錯誤').trim().optional(),
    category: yup
        .string()
        .typeError('資料格式錯誤')
        .oneOf(chemical_1.categoryOptions, '藥品分類錯誤')
        .optional(),
    ghs: yup.array().of(ghsSchema).optional(),
    total_quantity: yup.number().typeError('資料格式錯誤').min(0, '安全總量不可小於 0').optional(),
    low_stock_threshold: yup
        .number()
        .typeError('資料格式錯誤')
        .min(0, '低庫存門檻不可小於 0')
        .optional(),
    unit: yup.string().typeError('資料格式錯誤').oneOf(chemical_1.unitOptions, '庫存單位錯誤').optional(),
    location: yup.string().typeError('資料格式錯誤').trim().optional(),
    image_url: yup.string().typeError('資料格式錯誤').trim().optional(),
    expireDate: yup.date().typeError('有效期限格式錯誤').optional(),
    msds: msdsSchema.optional(),
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
 * GET /chemical
 * 已登入的 User / Admin 都可以查看藥品資料。
 */
const getAll = async (_req, res) => {
    const result = await chemical_1.default.find().sort({ createdAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getAll = getAll;
/**
 * GET /chemical/:id
 * 已登入的 User / Admin 都可以查看單一藥品。
 */
const getId = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const result = await chemical_1.default.findById(parsedParams.id).orFail(new Error('CHEMICAL NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getId = getId;
/**
 * POST /chemical
 * 只有 Admin 可以新增藥品。
 */
const create = async (req, res) => {
    const requestBody = parseRequestBody(req.body);
    const parsedBody = await bodySchema.validate(requestBody, { stripUnknown: true });
    const result = await chemical_1.default.create({
        name: parsedBody.name,
        cas_number: parsedBody.cas_number,
        category: parsedBody.category,
        ghs: parsedBody.ghs ?? [],
        amount: parsedBody.amount,
        total_quantity: parsedBody.total_quantity,
        low_stock_threshold: parsedBody.low_stock_threshold,
        unit: parsedBody.unit,
        location: parsedBody.location,
        ...(req.file?.path
            ? { image_url: req.file.path }
            : parsedBody.image_url !== undefined
                ? { image_url: parsedBody.image_url }
                : {}),
        ...(parsedBody.expireDate !== undefined ? { expireDate: parsedBody.expireDate } : {}),
        ...(parsedBody.msds !== undefined
            ? {
                msds: {
                    source: parsedBody.msds.source,
                    title: parsedBody.msds.title,
                    ...(parsedBody.msds.url !== undefined ? { url: parsedBody.msds.url } : {}),
                    ...(parsedBody.msds.content !== undefined ? { content: parsedBody.msds.content } : {}),
                },
            }
            : {}),
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '',
        result,
    });
};
exports.create = create;
/**
 * PATCH /chemical/:id
 * 只有 Admin 可以修改藥品。
 * PATCH 採部分更新，因此每個欄位都是 optional。
 */
const update = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const requestBody = parseRequestBody(req.body);
    const parsedBody = await updateBodySchema.validate(requestBody, { stripUnknown: true });
    const updateData = {
        ...parsedBody,
        ...(req.file?.path ? { image_url: req.file.path } : {}),
    };
    const result = await chemical_1.default.findByIdAndUpdate(parsedParams.id, updateData, {
        returnDocument: 'after',
        runValidators: true,
    }).orFail(new Error('CHEMICAL NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.update = update;
/**
 * DELETE /chemical/:id
 * 只有 Admin 可以刪除藥品。
 */
const remove = async (req, res) => {
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true });
    const result = await chemical_1.default.findByIdAndDelete(parsedParams.id).orFail(new Error('CHEMICAL NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.remove = remove;
//# sourceMappingURL=chemical.js.map