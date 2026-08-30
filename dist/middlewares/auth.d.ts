import type { Request, Response, NextFunction } from 'express';
/**
 * Authentication：確認 Request 是否帶有有效的 Access Token。
 * 成功後 Passport 會把目前 User 放進 req.user。
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Authorization：確認已登入的 User 是否具有 Admin 權限。
 * 這個 Middleware 必須放在 authenticate 後面，才能安全使用 req.user。
 */
export declare const requireAdmin: (req: Request, _res: Response, next: NextFunction) => void;
export declare const jwt: (req: Request, res: Response, next: NextFunction) => void;
export declare const admin: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Login 專用 Authentication Middleware。
 * 與 authenticate 不同，這裡驗證的是 username + password，
 * 而不是 Authorization Header 的 JWT。
 */
export declare const login: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map