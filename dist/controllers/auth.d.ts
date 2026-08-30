import type { Request, Response } from 'express';
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const refresh: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
/**
 * 回傳目前 Access Token 對應的 User。
 * 這個 API 不回傳 password，也不直接把整個 req.user 丟出去。
 */
export declare const me: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map