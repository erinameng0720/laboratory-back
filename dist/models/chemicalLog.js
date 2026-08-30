"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chemicalLogActionOptions = void 0;
const mongoose_1 = require("mongoose");
exports.chemicalLogActionOptions = ['add', 'remove'];
const schema = new mongoose_1.Schema({
    chemical_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'chemicals',
        required: [true, '藥品必填'],
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, '操作者必填'],
    },
    action: {
        type: String,
        enum: {
            values: exports.chemicalLogActionOptions,
            message: '庫存異動類型錯誤',
        },
        required: [true, '庫存異動類型必填'],
    },
    quantity: {
        type: Number,
        required: [true, '異動數量必填'],
        min: [0.000001, '異動數量必須大於 0'],
    },
    before_amount: {
        type: Number,
        required: [true, '異動前庫存必填'],
        min: [0, '異動前庫存不可小於 0'],
    },
    after_amount: {
        type: Number,
        required: [true, '異動後庫存必填'],
        min: [0, '異動後庫存不可小於 0'],
    },
    reason: {
        type: String,
        required: [true, '異動原因必填'],
        trim: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
schema.index({ chemical_id: 1, createdAt: -1 });
schema.index({ user_id: 1, createdAt: -1 });
exports.default = (0, mongoose_1.model)('chemicalLogs', schema);
//# sourceMappingURL=chemicalLog.js.map