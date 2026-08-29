"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
// Passport Local：負責「登入時的 username + password 驗證」。
passport_1.default.use('login', new passport_local_1.default.Strategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    try {
        // User Model 的 password 設定 select:false，
        // 因此登入時要明確要求 Mongoose 把 password hash 查出來。
        const user = await user_1.default.findOne({ username }, '+password').orFail(new Error('USER NOT FOUND'));
        // bcrypt.compare 會把使用者輸入的明文密碼
        // 與資料庫中的 bcrypt hash 做比對。
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            throw new Error('PASSWORD');
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
// Passport JWT：負責「已登入 Request 的 Access Token 驗證」。
passport_1.default.use('jwt', new passport_jwt_1.default.Strategy({
    // 從 Authorization: Bearer <token> 取得 Access Token。
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, async (payload, done) => {
    try {
        // JWT 的 sub 是 user id。
        // 不直接相信 JWT 裡的 role，而是重新查 MongoDB，取得最新 User 狀態。
        const user = await user_1.default.findById(payload.sub).orFail(new Error('USER'));
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
//# sourceMappingURL=passport.js.map