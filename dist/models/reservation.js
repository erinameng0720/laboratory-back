"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationStatusOptions = void 0;
const mongoose_1 = require("mongoose");
exports.reservationStatusOptions = ['pending', 'confirmed', 'cancelled'];
const schema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, '預約者必填'],
    },
    instrument_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'instruments',
        required: [true, '預約儀器必填'],
    },
    start_time: {
        type: Date,
        required: [true, '開始時間必填'],
    },
    end_time: {
        type: Date,
        required: [true, '結束時間必填'],
    },
    status: {
        type: String,
        enum: {
            values: exports.reservationStatusOptions,
            message: '預約狀態錯誤',
        },
        required: [true, '預約狀態必填'],
        default: 'pending',
    },
    cancel_reason: {
        type: String,
        trim: true,
    },
    reviewed_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    reviewed_at: {
        type: Date,
    },
}, {
    timestamps: true,
});
schema.pre('validate', function () {
    if (this.start_time >= this.end_time) {
        this.invalidate('end_time', '結束時間必須晚於開始時間');
    }
    if (this.status === 'cancelled' && !this.cancel_reason?.trim()) {
        this.invalidate('cancel_reason', '取消原因必填');
    }
    if (this.status !== 'cancelled' && this.cancel_reason?.trim()) {
        this.invalidate('cancel_reason', '未取消的預約不可填寫取消原因');
    }
    if (this.status === 'pending' && (this.reviewed_by || this.reviewed_at)) {
        this.invalidate('reviewed_by', '待審核預約不可有審核資料');
    }
    if (this.status !== 'pending' && !this.reviewed_by) {
        this.invalidate('reviewed_by', '已審核的預約必須記錄審核管理員');
    }
    if (this.status !== 'pending' && !this.reviewed_at) {
        this.invalidate('reviewed_at', '已審核的預約必須記錄審核時間');
    }
});
schema.index({ instrument_id: 1, start_time: 1, end_time: 1, status: 1 });
schema.index({ user_id: 1, createdAt: -1 });
exports.default = (0, mongoose_1.model)('reservations', schema);
//# sourceMappingURL=reservation.js.map