import passport from 'passport'
import type { Request, Response, NextFunction } from 'express'
import type { UserDocument } from '../models/user'
import { JsonWebTokenError } from 'jsonwebtoken'

/**
 * Authentication：確認 Request 是否帶有有效的 Access Token。
 * 成功後 Passport 會把目前 User 放進 req.user。
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (error: Error, user: UserDocument, info: JsonWebTokenError) => {
      // 沒有 user、Token 驗證失敗，或 Passport 回傳錯誤，都視為 401。
      if (error || !user || info) {
        return next(new Error('TOKEN'))
      }

      req.user = user
      next()
    },
  )(req, res, next)
}

/**
 * Authorization：確認已登入的 User 是否具有 Admin 權限。
 * 這個 Middleware 必須放在 authenticate 後面，才能安全使用 req.user。
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user!.role !== 'admin') {
    return next(new Error('ADMIN'))
  }

  next()
}

// 保留舊名稱，避免後續尚未重構的 Route 因為命名改動而一次受到影響。
// 新 API 請優先使用 authenticate / requireAdmin。
export const jwt = authenticate
export const admin = requireAdmin

/**
 * Login 專用 Authentication Middleware。
 * 與 authenticate 不同，這裡驗證的是 username + password，
 * 而不是 Authorization Header 的 JWT。
 */
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'login',
    { session: false },
    (error: Error, user: UserDocument, info: { message: string }) => {
      if (error || !user || info) {
        return next(new Error('LOGIN'))
      }

      req.user = user
      next()
    },
  )(req, res, next)
}
