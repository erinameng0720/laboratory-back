import RefreshToken from '../models/refreshToken'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { random, cookieOptions, hash } from '../utils/refreshToken'
import { createAccessToken } from '../utils/jwt'

export const login = async (req: Request, res: Response) => {
  const accessToken = createAccessToken(req.user!._id.toString())

  // Refresh Token 原文只存在 Cookie；Model 的 pre('save') 會先 hash 再寫入 MongoDB。
  const refreshToken = random()
  await RefreshToken.create({
    user: req.user!._id,
    refreshToken,
  })

  res.status(StatusCodes.OK).cookie('refresh', refreshToken, cookieOptions).json({
    success: true,
    message: '',
    result: {
      accessToken,
      username: req.user!.username,
      email: req.user!.email,
      role: req.user!.role,
    },
  })
}

export const refresh = async (req: Request, res: Response) => {
  if (!req.cookies.refresh) throw new Error('RT')

  // Cookie 裡的是原始 Token，MongoDB 存的是 SHA-256 hash，因此查詢前要先 hash。
  const hashedToken = hash(req.cookies.refresh)
  const deletedRT = await RefreshToken.findOneAndDelete({ refreshToken: hashedToken })
    .populate<{ user: import('../models/user').IUser }>('user')
    .orFail(new Error('RT'))

  // Refresh Token Rotation：舊 Refresh Token 使用一次後立即刪除，重新建立新的 Token。
  const accessToken = createAccessToken(deletedRT.user._id.toString())
  const refreshToken = random()

  await RefreshToken.create({
    user: deletedRT.user._id,
    refreshToken,
  })

  res.status(StatusCodes.OK).cookie('refresh', refreshToken, cookieOptions).json({
    success: true,
    message: '',
    result: {
      accessToken,
      username: deletedRT.user.username,
      email: deletedRT.user.email,
      role: deletedRT.user.role,
    },
  })
}

export const logout = async (req: Request, res: Response) => {
  if (!req.cookies.refresh) throw new Error('RT')

  const hashedToken = hash(req.cookies.refresh)
  await RefreshToken.findOneAndDelete({ refreshToken: hashedToken }).orFail(new Error('RT'))

  res.status(StatusCodes.OK).clearCookie('refresh', cookieOptions).json({
    success: true,
    message: '',
    result: {},
  })
}

/**
 * 回傳目前 Access Token 對應的 User。
 * 這個 API 不回傳 password，也不直接把整個 req.user 丟出去。
 */
export const me = async (req: Request, res: Response) => {
  const user = req.user!

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
  })
}
