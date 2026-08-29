import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'
import { Error as MongooseError } from 'mongoose'
import { MongoServerError } from 'mongodb'
import cloudinary from '../configs/cloudinary'

export default async (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(error)

  // 如果有錯誤，刪除已上傳的圖片
  if (req.file) {
    await cloudinary.uploader.destroy(req.file.filename)
  }

  // express.json() 格式錯誤
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: '格式錯誤',
    })
  }
  // yup 驗證錯誤
  else if (error instanceof yup.ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    })
  }
  // mongoose 驗證錯誤
  else if (error instanceof MongooseError.ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: Object.values(error.errors)[0]!.message,
    })
  }
  // 重複錯誤
  else if (error instanceof MongoServerError && error.code === 11000) {
    const duplicatedFields = Object.keys(error.keyPattern ?? {})

    if (duplicatedFields.includes('cas_number')) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'CAS 編號已存在',
      })
    } else {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號或信箱重複',
      })
    }
  }
  // 自訂錯誤
  else if (error instanceof Error) {
    switch (error.message) {
      case 'LOGIN':
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '帳號或密碼錯誤',
        })
        break
      case 'TOKEN':
      case 'RT':
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '認證錯誤',
        })
        break
      case 'ADMIN':
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: '權限不足',
        })
        break
      case 'CORS':
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'CORS',
        })
        break
      case 'UPLOAD_FAILED':
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '上傳錯誤',
        })
        break
      case 'LEGACY ORDER API':
        res.status(StatusCodes.GONE).json({
          success: false,
          message: '舊訂單 API 已停用，Reservation API 將於後續 Phase 實作',
        })
        break
      case 'CHEMICAL NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到藥品',
        })
        break
      case 'CHEMICAL LOG NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到庫存異動紀錄',
        })
        break
      case 'INSTRUMENT NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到儀器',
        })
        break
      case 'INSTRUMENT HAS ACTIVE RESERVATIONS':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '此儀器仍有待審核或已確認的預約，請先取消相關預約再刪除儀器',
        })
        break
      case 'USER NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到使用者',
        })
        break
      case 'RESERVATION NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到預約',
        })
        break
      case 'RESERVATION FORBIDDEN':
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: '無權限操作此預約',
        })
        break
      case 'RESERVATION CONFLICT':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '預約時間與既有預約衝突',
        })
        break
      case 'INSTRUMENT MAINTENANCE':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '儀器目前維修中，無法建立預約',
        })
        break
      case 'RESERVATION STATUS INVALID':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '目前預約狀態不允許此操作',
        })
        break
      case 'INVALID RESERVATION TIME':
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '結束時間必須晚於開始時間',
        })
        break
      case 'INSUFFICIENT STOCK':
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '庫存不足，無法完成扣庫存',
        })
        break
      case 'CHEMICAL LOG CREATE FAILED':
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '庫存異動紀錄建立失敗',
        })
        break
      case 'PRODUCT NOT FOUND':
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: '找不到商品',
        })
        break
      default:
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: '伺服器錯誤',
        })
        break
    }
  }
  // 其他錯誤
  else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}
