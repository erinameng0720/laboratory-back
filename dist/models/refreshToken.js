"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const refreshToken_1 = require("../utils/refreshToken");
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // 一週後過期，自動刪除這筆資料
        // 過期設定必須要放在日期欄位上
        expires: 60 * 60 * 24 * 7,
    },
});
schema.pre('save', function () {
    if (!this.isModified('refreshToken'))
        return;
    this.refreshToken = (0, refreshToken_1.hash)(this.refreshToken);
});
exports.default = (0, mongoose_1.model)('refreshTokens', schema);
//# sourceMappingURL=refreshToken.js.map