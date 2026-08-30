import type { Request, Response } from 'express';
/**
 * GET /user
 * Admin 查看所有使用者。
 * password 欄位在 User Model 中 select:false，因此不會回傳密碼 hash。
 */
export declare const getAll: (_req: Request, res: Response) => Promise<void>;
/**
 * POST /user
 * Admin 直接建立使用者，可同時指定初始權限。
 */
export declare const create: (req: Request, res: Response) => Promise<void>;
/**
 * PATCH /user/:id
 * Admin 修改指定使用者的權限。
 */
export declare const updateRole: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /user/:id
 * Admin 刪除指定使用者。為避免管理員把目前登入中的自己刪掉，
 * 這裡先做一層保護；其他使用者則可以正常刪除。
 */
export declare const remove: (req: Request, res: Response) => Promise<void>;
export declare const getProfile: (req: Request, res: Response) => Promise<void>;
export declare const changePassword: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=user.d.ts.map