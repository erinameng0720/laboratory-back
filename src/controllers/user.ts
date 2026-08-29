import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'
import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../models/user'

const paramsSchema = yup.object({
  id: yup
    .string()
    .required('ID 必填')
    .trim()
    .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
})

const roleSchema = yup.string().oneOf(['user', 'admin'], '權限錯誤')

const createSchema = yup.object({
  username: yup
    .string()
    .required('帳號必填')
    .min(4, '帳號必需是 4 個字以上')
    .max(20, '帳號必需是 20 個字以下')
    .test('isAlphanumeric', '帳號只能是英數字', (value) => validator.isAlphanumeric(value)),
  email: yup.string().required('信箱必填').email('信箱格式錯誤'),
  password: yup.string().required('密碼必填').min(4, '密碼最少 4 個字').max(20, '密碼最長 20 個字'),
  // User Model 的 role 有 default = user，因此建立帳號時不是必填。
  role: roleSchema.optional(),
})

const updateSchema = yup.object({
  // 修改權限 API 必須知道目標權限；這是 API 操作必填，不是 Database required。
  role: roleSchema.required('權限必填'),
})

const changePasswordSchema = yup.object({
  current_password: yup.string().required('目前密碼必填'),
  new_password: yup
    .string()
    .required('新密碼必填')
    .min(4, '密碼最少 4 個字')
    .max(20, '密碼最多 20 個字'),
})

/**
 * GET /user
 * Admin 查看所有使用者。
 * password 欄位在 User Model 中 select:false，因此不會回傳密碼 hash。
 */
export const getAll = async (_req: Request, res: Response) => {
  const result = await User.find()
    .select('_id username email role createdAt updatedAt')
    .sort({ createdAt: -1 })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * POST /user
 * Admin 直接建立使用者，可同時指定初始權限。
 */
export const create = async (req: Request, res: Response) => {
  const parsedBody = await createSchema.validate(req.body, { stripUnknown: true })

  const result = await User.create({
    username: parsedBody.username,
    email: parsedBody.email,
    password: parsedBody.password,
    ...(parsedBody.role !== undefined ? { role: parsedBody.role } : {}),
  })

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '',
    result: {
      _id: result._id,
      username: result.username,
      email: result.email,
      role: result.role,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    },
  })
}

/**
 * PATCH /user/:id
 * Admin 修改指定使用者的權限。
 */
export const updateRole = async (req: Request, res: Response) => {
  const { id } = await paramsSchema.validate(req.params, { stripUnknown: true })
  const { role } = await updateSchema.validate(req.body, { stripUnknown: true })

  const result = await User.findByIdAndUpdate(
    id,
    { role },
    { returnDocument: 'after', runValidators: true },
  ).orFail(new Error('USER NOT FOUND'))

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      _id: result._id,
      username: result.username,
      email: result.email,
      role: result.role,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    },
  })
}

/**
 * DELETE /user/:id
 * Admin 刪除指定使用者。為避免管理員把目前登入中的自己刪掉，
 * 這裡先做一層保護；其他使用者則可以正常刪除。
 */
export const remove = async (req: Request, res: Response) => {
  const { id } = await paramsSchema.validate(req.params, { stripUnknown: true })

  if (req.user!._id.toString() === id) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: '不可刪除目前登入中的管理員帳號',
      result: null,
    })
    return
  }

  const result = await User.findByIdAndDelete(id).orFail(new Error('USER NOT FOUND'))

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: { _id: result._id },
  })
}

export const getProfile = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      _id: req.user!._id,
      username: req.user!.username,
      email: req.user!.email,
      role: req.user!.role,
      createdAt: req.user!.createdAt,
      updatedAt: req.user!.updatedAt,
    },
  })
}

export const changePassword = async (req: Request, res: Response) => {
  const parsedBody = await changePasswordSchema.validate(req.body, { stripUnknown: true })
  const user = await User.findById(req.user!._id)
    .select('+password')
    .orFail(new Error('USER NOT FOUND'))
  const passwordMatched = await bcrypt.compare(parsedBody.current_password, user.password)

  if (!passwordMatched) {
    throw new yup.ValidationError('目前密碼錯誤')
  }

  user.password = parsedBody.new_password
  await user.save()

  res.status(StatusCodes.OK).json({
    success: true,
    message: '密碼修改成功',
    result: {},
  })
}
