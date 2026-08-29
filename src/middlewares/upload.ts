import multer from 'multer'
import cloudinary from '../configs/cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import type { Request, Response, NextFunction } from 'express'

// 上傳設定
const upload = multer({
  // 設定儲存位置
  storage: new CloudinaryStorage({
    cloudinary,
  }),
  // 設定檔案大小，1MB
  limits: {
    fileSize: 1024 * 1024,
  },
  // 設定檔案過濾
  // file = 檔案資訊 https://npmx.dev/package/multer#user-content-file-information
  // callback(錯誤, 是否允許)
  fileFilter: (req, file, callback) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
})

export default (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (error) => {
    if (error) {
      next(new Error('UPLOAD_FAILED'))
    } else {
      next()
    }
  })
}
