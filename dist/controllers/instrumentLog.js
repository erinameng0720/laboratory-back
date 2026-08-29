"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = exports.getAll = void 0;
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const validator_1 = __importDefault(require("validator"));
const instrumentLog_1 = __importDefault(require("../models/instrumentLog"));
const paramsSchema = yup.object({
    id: yup.string().required('ID 必填').trim().test('isMongoId', '資料格式錯誤', value => validator_1.default.isMongoId(value)),
});
/** GET /instrument-log */
const getAll = async (_req, res) => {
    const result = await instrumentLog_1.default.find()
        .sort({ createdAt: -1 })
        .populate('instrument_id', 'name model status')
        .populate('user_id', 'username role');
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result });
};
exports.getAll = getAll;
/** GET /instrument-log/:id */
const getId = async (req, res) => {
    const { id } = await paramsSchema.validate(req.params, { stripUnknown: true });
    const result = await instrumentLog_1.default.findById(id)
        .populate('instrument_id', 'name model status')
        .populate('user_id', 'username role')
        .orFail(new Error('INSTRUMENT LOG NOT FOUND'));
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: '', result });
};
exports.getId = getId;
//# sourceMappingURL=instrumentLog.js.map