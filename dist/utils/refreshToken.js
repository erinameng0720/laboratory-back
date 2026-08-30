"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.random = exports.cookieOptions = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
exports.cookieOptions = {
    // 前後端在不同網域
    sameSite: 'none',
    // 只能 https
    secure: true,
    // 不能被 js 讀取
    httpOnly: true,
    // 只有在請求路徑是 /auth 開頭時才使用
    path: '/auth',
    // 儲存一周，單位是毫秒
    maxAge: 1000 * 60 * 60 * 24 * 7,
};
// 產生隨機字串
const random = () => {
    return node_crypto_1.default.randomBytes(64).toString('hex');
};
exports.random = random;
// 對傳入的 data 進行雜湊
const hash = (data) => {
    return node_crypto_1.default.createHash('sha256').update(data).digest('hex');
};
exports.hash = hash;
//# sourceMappingURL=refreshToken.js.map