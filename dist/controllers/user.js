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
exports.changePassword = exports.getProfile = exports.remove = exports.updateRole = exports.create = exports.getAll = void 0;
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const refreshToken_1 = __importDefault(require("../models/refreshToken"));
const user_1 = __importDefault(require("../models/user"));
const refreshToken_2 = require("../utils/refreshToken");
const paramsSchema = yup.object({
    id: yup
        .string()
        .required('ID 必填')
        .trim()
        .test('isMongoId', '資料格式錯誤', (value) => validator_1.default.isMongoId(value)),
});
const roleSchema = yup.string().oneOf(['user', 'admin'], '權限錯誤');
const createSchema = yup.object({
    username: yup
        .string()
        .required('帳號必填')
        .min(4, '帳號必需是 4 個字以上')
        .max(20, '帳號必需是 20 個字以下')
        .test('isAlphanumeric', '帳號只能是英數字', (value) => validator_1.default.isAlphanumeric(value)),
    email: yup.string().required('信箱必填').email('信箱格式錯誤'),
    password: yup.string().required('密碼必填').min(4, '密碼最少 4 個字').max(20, '密碼最長 20 個字'),
    // User Model 的 role 有 default = user，因此建立帳號時不是必填。
    role: roleSchema.optional(),
});
const updateSchema = yup.object({
    // 修改權限 API 必須知道目標權限；這是 API 操作必填，不是 Database required。
    role: roleSchema.required('權限必填'),
});
const changePasswordSchema = yup.object({
    current_password: yup.string().required('目前密碼必填'),
    new_password: yup
        .string()
        .required('新密碼必填')
        .min(4, '密碼最少 4 個字')
        .max(20, '密碼最多 20 個字'),
});
/**
 * GET /user
 * Admin 查看所有使用者。
 * password 欄位在 User Model 中 select:false，因此不會回傳密碼 hash。
 */
const getAll = async (_req, res) => {
    const result = await user_1.default.find()
        .select('_id username email role createdAt updatedAt')
        .sort({ createdAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result,
    });
};
exports.getAll = getAll;
/**
 * POST /user
 * Admin 直接建立使用者，可同時指定初始權限。
 */
const create = async (req, res) => {
    const parsedBody = await createSchema.validate(req.body, { stripUnknown: true });
    const result = await user_1.default.create({
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password,
        ...(parsedBody.role !== undefined ? { role: parsedBody.role } : {}),
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: '',
        result: {
            _id: result._id,
            username: result.username,
            email: result.email,
            role: result.role,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        },
    });
};
exports.create = create;
/**
 * PATCH /user/:id
 * Admin 修改指定使用者的權限。
 */
const updateRole = async (req, res) => {
    const { id } = await paramsSchema.validate(req.params, { stripUnknown: true });
    const { role } = await updateSchema.validate(req.body, { stripUnknown: true });
    const result = await user_1.default.findByIdAndUpdate(id, { role }, { returnDocument: 'after', runValidators: true }).orFail(new Error('USER NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: {
            _id: result._id,
            username: result.username,
            email: result.email,
            role: result.role,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        },
    });
};
exports.updateRole = updateRole;
/**
 * DELETE /user/:id
 * Admin 刪除指定使用者。為避免管理員把目前登入中的自己刪掉，
 * 這裡先做一層保護；其他使用者則可以正常刪除。
 */
const remove = async (req, res) => {
    const { id } = await paramsSchema.validate(req.params, { stripUnknown: true });
    if (req.user._id.toString() === id) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: '不可刪除目前登入中的管理員帳號',
            result: null,
        });
        return;
    }
    const result = await user_1.default.findByIdAndDelete(id).orFail(new Error('USER NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: { _id: result._id },
    });
};
exports.remove = remove;
const getProfile = async (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
        },
    });
};
exports.getProfile = getProfile;
const changePassword = async (req, res) => {
    const parsedBody = await changePasswordSchema.validate(req.body, { stripUnknown: true });
    const user = await user_1.default.findById(req.user._id)
        .select('+password')
        .orFail(new Error('USER NOT FOUND'));
    const passwordMatched = await bcrypt_1.default.compare(parsedBody.current_password, user.password);
    if (!passwordMatched) {
        throw new yup.ValidationError('目前密碼錯誤');
    }
    user.password = parsedBody.new_password;
    await user.save();
    await refreshToken_1.default.deleteMany({ user: user._id });
    res.status(http_status_codes_1.StatusCodes.OK).clearCookie('refresh', refreshToken_2.cookieOptions).json({
        success: true,
        message: '密碼修改成功，請重新登入',
        result: {},
    });
};
exports.changePassword = changePassword;
//# sourceMappingURL=user.js.map