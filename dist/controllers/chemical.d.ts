import type { Request, Response } from 'express';
/**
 * GET /chemical
 * 已登入的 User / Admin 都可以查看藥品資料。
 */
export declare const getAll: (_req: Request, res: Response) => Promise<void>;
/**
 * GET /chemical/:id
 * 已登入的 User / Admin 都可以查看單一藥品。
 */
export declare const getId: (req: Request, res: Response) => Promise<void>;
/**
 * POST /chemical
 * 只有 Admin 可以新增藥品。
 */
export declare const create: (req: Request, res: Response) => Promise<void>;
/**
 * PATCH /chemical/:id
 * 只有 Admin 可以修改藥品。
 * PATCH 採部分更新，因此每個欄位都是 optional。
 */
export declare const update: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /chemical/:id
 * 只有 Admin 可以刪除藥品。
 */
export declare const remove: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=chemical.d.ts.map