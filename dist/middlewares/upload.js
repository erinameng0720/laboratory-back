"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
// 上傳設定
const upload = (0, multer_1.default)({
    // 設定儲存位置
    storage: new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.default,
    }),
    // 設定檔案大小，1MB
    limits: {
        fileSize: 1024 * 1024,
    },
    // 設定檔案過濾
    // file = 檔案資訊 https://npmx.dev/package/multer#user-content-file-information
    // callback(錯誤, 是否允許)
    fileFilter: (req, file, callback) => {
        if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
});
exports.default = (req, res, next) => {
    upload.single('image')(req, res, (error) => {
        if (error) {
            next(new Error('UPLOAD_FAILED'));
        }
        else {
            next();
        }
    });
};
//# sourceMappingURL=upload.js.map