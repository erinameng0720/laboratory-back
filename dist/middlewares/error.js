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
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
exports.default = async (error, req, res, _next) => {
    console.error(error);
    // 如果有錯誤，刪除已上傳的圖片
    if (req.file) {
        await cloudinary_1.default.uploader.destroy(req.file.filename);
    }
    // express.json() 格式錯誤
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: '格式錯誤',
        });
    }
    // yup 驗證錯誤
    else if (error instanceof yup.ValidationError) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
    // mongoose 驗證錯誤
    else if (error instanceof mongoose_1.Error.ValidationError) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: Object.values(error.errors)[0].message,
        });
    }
    // 重複錯誤
    else if (error instanceof mongodb_1.MongoServerError && error.code === 11000) {
        const duplicatedFields = Object.keys(error.keyPattern ?? {});
        if (duplicatedFields.includes('cas_number')) {
            res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                success: false,
                message: 'CAS 編號已存在',
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                success: false,
                message: '帳號或信箱重複',
            });
        }
    }
    // 自訂錯誤
    else if (error instanceof Error) {
        switch (error.message) {
            case 'LOGIN':
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: '帳號或密碼錯誤',
                });
                break;
            case 'TOKEN':
            case 'RT':
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: '認證錯誤',
                });
                break;
            case 'ADMIN':
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: '權限不足',
                });
                break;
            case 'CORS':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'CORS',
                });
                break;
            case 'UPLOAD_FAILED':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: '上傳錯誤',
                });
                break;
            case 'LEGACY ORDER API':
                res.status(http_status_codes_1.StatusCodes.GONE).json({
                    success: false,
                    message: '舊訂單 API 已停用，Reservation API 將於後續 Phase 實作',
                });
                break;
            case 'CHEMICAL NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到藥品',
                });
                break;
            case 'CHEMICAL LOG NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到庫存異動紀錄',
                });
                break;
            case 'INSTRUMENT NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到儀器',
                });
                break;
            case 'INSTRUMENT HAS ACTIVE RESERVATIONS':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '此儀器仍有待審核或已確認的預約，請先取消相關預約再刪除儀器',
                });
                break;
            case 'USER NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到使用者',
                });
                break;
            case 'RESERVATION NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到預約',
                });
                break;
            case 'RESERVATION FORBIDDEN':
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: '無權限操作此預約',
                });
                break;
            case 'RESERVATION CONFLICT':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '預約時間與既有預約衝突',
                });
                break;
            case 'INSTRUMENT MAINTENANCE':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '儀器目前維修中，無法建立預約',
                });
                break;
            case 'RESERVATION STATUS INVALID':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '目前預約狀態不允許此操作',
                });
                break;
            case 'INVALID RESERVATION TIME':
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: '結束時間必須晚於開始時間',
                });
                break;
            case 'INSUFFICIENT STOCK':
                res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    success: false,
                    message: '庫存不足，無法完成扣庫存',
                });
                break;
            case 'CHEMICAL LOG CREATE FAILED':
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: '庫存異動紀錄建立失敗',
                });
                break;
            case 'PRODUCT NOT FOUND':
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: '找不到商品',
                });
                break;
            default:
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: '伺服器錯誤',
                });
                break;
        }
    }
    // 其他錯誤
    else {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '伺服器錯誤',
        });
    }
};
//# sourceMappingURL=error.js.map