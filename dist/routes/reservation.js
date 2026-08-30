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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllerReservation = __importStar(require("../controllers/reservation"));
const middlewareAuth = __importStar(require("../middlewares/auth"));
const router = (0, express_1.Router)();
// Reservation 的所有 API 都必須先登入。
router.get('/', middlewareAuth.authenticate, controllerReservation.getAll);
router.get('/:id', middlewareAuth.authenticate, controllerReservation.getId);
// 建立預約：User / Admin 都可以提出自己的預約申請。
router.post('/', middlewareAuth.authenticate, controllerReservation.create);
// Admin 審核預約：confirmed / cancelled。
router.patch('/:id/review', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerReservation.review);
exports.default = router;
//# sourceMappingURL=reservation.js.map