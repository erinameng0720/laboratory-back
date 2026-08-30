import type { Request, Response } from 'express';
/**
 * GET /instrument
 * 已登入的 User / Admin 都可以查看儀器資料。
 */
export declare const getAll: (_req: Request, res: Response) => Promise<void>;
/**
 * GET /instrument/:id
 * 已登入的 User / Admin 都可以查看單一儀器。
 */
export declare const getId: (req: Request, res: Response) => Promise<void>;
/**
 * POST /instrument
 * 只有 Admin 可以新增儀器。
 *
 * status 沒有傳入時，會由 Instrument Schema 使用 default = available。
 */
export declare const create: (req: Request, res: Response) => Promise<void>;
/**
 * PATCH /instrument/:id
 * 只有 Admin 可以修改儀器。
 *
 * PATCH 採部分更新，因此所有欄位都是 optional，
 * 但至少必須提供一個欄位。
 */
export declare const update: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /instrument/:id
 * 只有 Admin 可以刪除儀器。
 *
 * 有 pending / confirmed 預約的儀器不可刪除，避免產生孤兒預約。
 * cancelled 預約是歷史資料，不會阻擋儀器刪除；Frontend 會以
 * 「已刪除儀器」顯示其 populate(null) 結果。
 */
export declare const remove: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=instrument.d.ts.map