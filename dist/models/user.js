"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, '帳號必填'],
        minLength: [4, '帳號必需是 4 個字以上'],
        maxLength: [20, '帳號必需是 20 個字以下'],
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isAlphanumeric(value),
            message: '帳號只能是英數字',
        },
        unique: true,
    },
    email: {
        type: String,
        required: [true, '信箱必填'],
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => validator_1.default.isEmail(value),
            message: '信箱格式錯誤',
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, '密碼必填'],
        select: false,
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: '權限錯誤',
        },
        default: 'user',
    },
}, {
    timestamps: true,
});
schema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    let message = '';
    if (this.password.length < 4) {
        message = '密碼最少 4 個字';
    }
    else if (this.password.length > 20) {
        message = '密碼最長 20 個字';
    }
    if (message !== '') {
        const error = new mongoose_1.Error.ValidationError();
        error.addError('password', new mongoose_1.Error.ValidatorError({ message }));
        throw error;
    }
    this.password = await bcrypt_1.default.hash(this.password, 10);
});
exports.default = (0, mongoose_1.model)('users', schema);
//# sourceMappingURL=user.js.map