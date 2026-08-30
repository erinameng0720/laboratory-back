"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitOptions = exports.categoryOptions = void 0;
const mongoose_1 = require("mongoose");
exports.categoryOptions = [
    'acid',
    'base',
    'salt',
    'alcohol',
    'ketone',
    'ester',
    'aromatic_hydrocarbon',
];
exports.unitOptions = ['mL', 'L', 'g', 'kg', 'bottle'];
const ghsSchema = new mongoose_1.Schema({
    image_url: {
        type: String,
        required: [true, 'GHS 圖片必填'],
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'GHS 名稱必填'],
        trim: true,
    },
    precautions: {
        type: String,
        required: [true, 'GHS 注意事項必填'],
        trim: true,
    },
}, { _id: false });
const msdsSchema = new mongoose_1.Schema({
    source: {
        type: String,
        enum: {
            values: ['admin', 'external_api'],
            message: 'MSDS 來源錯誤',
        },
        required: [true, 'MSDS 來源必填'],
    },
    title: {
        type: String,
        required: [true, 'MSDS 名稱必填'],
        trim: true,
    },
    url: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, '藥品名稱必填'],
        trim: true,
    },
    cas_number: {
        type: String,
        required: [true, 'CAS 編號必填'],
        trim: true,
        unique: true,
    },
    category: {
        type: String,
        required: [true, '藥品分類必填'],
        enum: {
            values: exports.categoryOptions,
            message: '藥品分類錯誤',
        },
    },
    ghs: {
        type: [ghsSchema],
        default: [],
    },
    amount: {
        type: Number,
        required: [true, '目前庫存量必填'],
        min: [0, '目前庫存量不可小於 0'],
    },
    total_quantity: {
        type: Number,
        required: [true, '安全總量必填'],
        min: [0, '安全總量不可小於 0'],
    },
    low_stock_threshold: {
        type: Number,
        required: [true, '低庫存門檻必填'],
        min: [0, '低庫存門檻不可小於 0'],
    },
    unit: {
        type: String,
        required: [true, '庫存單位必填'],
        enum: {
            values: exports.unitOptions,
            message: '庫存單位錯誤',
        },
    },
    location: {
        type: String,
        required: [true, '儲存位置必填'],
        trim: true,
    },
    image_url: {
        type: String,
        trim: true,
    },
    expireDate: {
        type: Date,
    },
    msds: {
        type: msdsSchema,
    },
}, {
    timestamps: true,
});
schema.index({ category: 1 });
schema.index({ expireDate: 1 });
schema.index({ location: 1 });
exports.default = (0, mongoose_1.model)('chemicals', schema);
//# sourceMappingURL=chemical.js.map