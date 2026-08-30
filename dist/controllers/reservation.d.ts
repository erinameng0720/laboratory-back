import type { Request, Response } from 'express';
/**
 * GET /reservation
 * User：只能查看自己的預約。
 * Admin：可以查看全部預約。
 */
export declare const getAll: (req: Request, res: Response) => Promise<void>;
/**
 * GET /reservation/:id
 * User：只能查看自己的預約。
 * Admin：可以查看任何預約。
 */
export declare const getId: (req: Request, res: Response) => Promise<void>;
/**
 * POST /reservation
 * 建立預約後直接進入 pending。
 * user_id 不接受 Frontend 傳入，而是從 req.user 取得。
 */
export declare const create: (req: Request, res: Response) => Promise<void>;
/**
 * PATCH /reservation/:id/review
 * 只有 Admin 可以審核。
 * confirmed：建立確認結果。
 * cancelled：必須留下 cancel_reason。
 */
export declare const review: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=reservation.d.ts.map