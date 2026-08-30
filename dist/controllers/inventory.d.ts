import type { Request, Response } from 'express';
/**
 * POST /chemical/:id/inventory/add
 * 只有 Admin 可以增加庫存。
 */
export declare const add: (req: Request, res: Response) => Promise<void>;
/**
 * POST /chemical/:id/inventory/remove
 * 只有 Admin 可以減少庫存。
 */
export declare const remove: (req: Request, res: Response) => Promise<void>;
/**
 * POST /chemical/:id/inventory/adjust
 * 只有 Admin 可以依照實際盤點結果設定庫存量。
 * Backend 會以資料庫最新庫存計算差額，並建立 ChemicalLog。
 */
export declare const adjust: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=inventory.d.ts.map