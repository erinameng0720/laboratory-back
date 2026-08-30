"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentStatusOptions = void 0;
const mongoose_1 = require("mongoose");
exports.instrumentStatusOptions = ['available', 'in_use', 'maintenance'];
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, '儀器名稱必填'],
        trim: true,
    },
    model: {
        type: String,
        required: [true, '儀器型號必填'],
        trim: true,
    },
    image_url: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: exports.instrumentStatusOptions,
            message: '儀器狀態錯誤',
        },
        required: [true, '儀器狀態必填'],
        default: 'available',
    },
}, {
    timestamps: true,
});
schema.index({ status: 1 });
exports.default = (0, mongoose_1.model)('instruments', schema);
//# sourceMappingURL=instrument.js.map