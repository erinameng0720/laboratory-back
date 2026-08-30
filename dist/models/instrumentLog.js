"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentLogActionOptions = void 0;
const mongoose_1 = require("mongoose");
exports.instrumentLogActionOptions = ['add', 'remove'];
const schema = new mongoose_1.Schema({
    instrument_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'instruments',
        required: [true, '儀器必填'],
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, '操作者必填'],
    },
    action: {
        type: String,
        enum: { values: exports.instrumentLogActionOptions, message: '儀器異動類型錯誤' },
        required: [true, '儀器異動類型必填'],
    },
    reason: {
        type: String,
        required: [true, '異動原因必填'],
        trim: true,
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
schema.index({ instrument_id: 1, createdAt: -1 });
schema.index({ user_id: 1, createdAt: -1 });
exports.default = (0, mongoose_1.model)('instrumentLogs', schema);
//# sourceMappingURL=instrumentLog.js.map