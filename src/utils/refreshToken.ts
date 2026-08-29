import crypto from 'node:crypto'
import type { CookieOptions } from 'express'

export const cookieOptions: CookieOptions = {
  // 前後端在不同網域
  sameSite: 'none',
  // 只能 https
  secure: true,
  // 不能被 js 讀取
  httpOnly: true,
  // 只有在請求路徑是 /auth 開頭時才使用
  path: '/auth',
  // 儲存一周，單位是毫秒
  maxAge: 1000 * 60 * 60 * 24 * 7,
}

// 產生隨機字串
export const random = () => {
  return crypto.randomBytes(64).toString('hex')
}

// 對傳入的 data 進行雜湊
export const hash = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex')
}
