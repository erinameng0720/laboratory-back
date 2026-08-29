"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.admin = exports.jwt = exports.requireAdmin = exports.authenticate = void 0;
const passport_1 = __importDefault(require("passport"));
/**
 * Authentication：確認 Request 是否帶有有效的 Access Token。
 * 成功後 Passport 會把目前 User 放進 req.user。
 */
const authenticate = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (error, user, info) => {
        // 沒有 user、Token 驗證失敗，或 Passport 回傳錯誤，都視為 401。
        if (error || !user || info) {
            return next(new Error('TOKEN'));
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.authenticate = authenticate;
/**
 * Authorization：確認已登入的 User 是否具有 Admin 權限。
 * 這個 Middleware 必須放在 authenticate 後面，才能安全使用 req.user。
 */
const requireAdmin = (req, _res, next) => {
    if (req.user.role !== 'admin') {
        return next(new Error('ADMIN'));
    }
    next();
};
exports.requireAdmin = requireAdmin;
// 保留舊名稱，避免後續尚未重構的 Route 因為命名改動而一次受到影響。
// 新 API 請優先使用 authenticate / requireAdmin。
exports.jwt = exports.authenticate;
exports.admin = exports.requireAdmin;
/**
 * Login 專用 Authentication Middleware。
 * 與 authenticate 不同，這裡驗證的是 username + password，
 * 而不是 Authorization Header 的 JWT。
 */
const login = (req, res, next) => {
    passport_1.default.authenticate('login', { session: false }, (error, user, info) => {
        if (error || !user || info) {
            return next(new Error('LOGIN'));
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.login = login;
//# sourceMappingURL=auth.js.map