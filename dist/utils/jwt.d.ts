/**
 * 建立 Access Token。
 * JWT 只保存能辨識使用者的資料，不放 password / email / role。
 * role 會在 JWT Strategy 驗證後重新從 MongoDB User 取得。
 */
export declare const createAccessToken: (userId: string) => string;
//# sourceMappingURL=jwt.d.ts.map