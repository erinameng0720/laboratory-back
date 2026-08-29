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
const express_1 = require("express");
const controllerChemical = __importStar(require("../controllers/chemical"));
const controllerInventory = __importStar(require("../controllers/inventory"));
const middlewareAuth = __importStar(require("../middlewares/auth"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
// Read：登入後即可查看藥品資料。
router.get('/', middlewareAuth.authenticate, controllerChemical.getAll);
// Inventory：只有 Admin 可以異動庫存。
router.post('/:id/inventory/add', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerInventory.add);
router.post('/:id/inventory/remove', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerInventory.remove);
router.post('/:id/inventory/adjust', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerInventory.adjust);
router.get('/:id', middlewareAuth.authenticate, controllerChemical.getId);
// Write：只有 Admin 可以新增、修改、刪除藥品。
router.post('/', middlewareAuth.authenticate, middlewareAuth.requireAdmin, upload_1.default, controllerChemical.create);
router.patch('/:id', middlewareAuth.authenticate, middlewareAuth.requireAdmin, upload_1.default, controllerChemical.update);
router.delete('/:id', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerChemical.remove);
exports.default = router;
//# sourceMappingURL=chemical.js.map