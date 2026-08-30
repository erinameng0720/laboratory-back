"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.refresh = exports.login = void 0;
const refreshToken_1 = __importDefault(require("../models/refreshToken"));
const http_status_codes_1 = require("http-status-codes");
const refreshToken_2 = require("../utils/refreshToken");
const jwt_1 = require("../utils/jwt");
const login = async (req, res) => {
    const accessToken = (0, jwt_1.createAccessToken)(req.user._id.toString());
    // Refresh Token 原文只存在 Cookie；Model 的 pre('save') 會先 hash 再寫入 MongoDB。
    const refreshToken = (0, refreshToken_2.random)();
    await refreshToken_1.default.create({
        user: req.user._id,
        refreshToken,
    });
    res.status(http_status_codes_1.StatusCodes.OK).cookie('refresh', refreshToken, refreshToken_2.cookieOptions).json({
        success: true,
        message: '',
        result: {
            accessToken,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
        },
    });
};
exports.login = login;
const refresh = async (req, res) => {
    if (!req.cookies.refresh)
        throw new Error('RT');
    // Cookie 裡的是原始 Token，MongoDB 存的是 SHA-256 hash，因此查詢前要先 hash。
    const hashedToken = (0, refreshToken_2.hash)(req.cookies.refresh);
    const deletedRT = await refreshToken_1.default.findOneAndDelete({ refreshToken: hashedToken })
        .populate('user')
        .orFail(new Error('RT'));
    // Refresh Token Rotation：舊 Refresh Token 使用一次後立即刪除，重新建立新的 Token。
    const accessToken = (0, jwt_1.createAccessToken)(deletedRT.user._id.toString());
    const refreshToken = (0, refreshToken_2.random)();
    await refreshToken_1.default.create({
        user: deletedRT.user._id,
        refreshToken,
    });
    res.status(http_status_codes_1.StatusCodes.OK).cookie('refresh', refreshToken, refreshToken_2.cookieOptions).json({
        success: true,
        message: '',
        result: {
            accessToken,
            username: deletedRT.user.username,
            email: deletedRT.user.email,
            role: deletedRT.user.role,
        },
    });
};
exports.refresh = refresh;
const logout = async (req, res) => {
    if (!req.cookies.refresh)
        throw new Error('RT');
    const hashedToken = (0, refreshToken_2.hash)(req.cookies.refresh);
    await refreshToken_1.default.findOneAndDelete({ refreshToken: hashedToken }).orFail(new Error('RT'));
    res.status(http_status_codes_1.StatusCodes.OK).clearCookie('refresh', refreshToken_2.cookieOptions).json({
        success: true,
        message: '',
        result: {},
    });
};
exports.logout = logout;
/**
 * 回傳目前 Access Token 對應的 User。
 * 這個 API 不回傳 password，也不直接把整個 req.user 丟出去。
 */
const me = async (req, res) => {
    const user = req.user;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: '',
        result: {
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
};
exports.me = me;
//# sourceMappingURL=auth.js.map