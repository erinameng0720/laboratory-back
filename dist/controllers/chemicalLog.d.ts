import type { Request, Response } from 'express';
/**
 * GET /chemical-log
 * 已登入的 User / Admin 都可以查看庫存異動紀錄。
 */
export declare const getAll: (_req: Request, res: Response) => Promise<void>;
/**
 * GET /chemical-log/:id
 * 取得單筆庫存異動紀錄。
 */
export declare const getId: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=chemicalLog.d.ts.map