"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * 建立 Access Token。
 * JWT 只保存能辨識使用者的資料，不放 password / email / role。
 * role 會在 JWT Strategy 驗證後重新從 MongoDB User 取得。
 */
const createAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({
        sub: userId,
    }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};
exports.createAccessToken = createAccessToken;
//# sourceMappingURL=jwt.js.map