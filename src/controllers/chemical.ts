import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import Chemical, { categoryOptions, unitOptions, type MsdsSource } from '../models/chemical'

const ghsSchema = yup.object({
  image_url: yup
    .string()
    .typeError('資料格式錯誤')
    .url('GHS 圖片 URL 格式錯誤')
    .required('GHS 圖片必填')
    .trim(),
  name: yup.string().typeError('資料格式錯誤').required('GHS 名稱必填').trim(),
  precautions: yup.string().typeError('資料格式錯誤').required('GHS 注意事項必填').trim(),
})

const msdsSchema = yup.object({
  source: yup
    .string()
    .typeError('資料格式錯誤')
    .required('MSDS 來源必填')
    .oneOf(['admin', 'external_api'], 'MSDS 來源錯誤'),
  title: yup.string().typeError('資料格式錯誤').required('MSDS 名稱必填').trim(),
  url: yup.string().typeError('資料格式錯誤').trim().optional(),
  content: yup.string().typeError('資料格式錯誤').trim().optional(),
})

const bodySchema = yup.object({
  name: yup.string().typeError('資料格式錯誤').required('藥品名稱必填').trim(),
  cas_number: yup.string().typeError('資料格式錯誤').required('CAS 編號必填').trim(),
  category: yup
    .string()
    .typeError('資料格式錯誤')
    .required('藥品分類必填')
    .oneOf(categoryOptions, '藥品分類錯誤'),
  ghs: yup.array().of(ghsSchema).optional(),
  amount: yup
    .number()
    .typeError('資料格式錯誤')
    .required('目前庫存量必填')
    .min(0, '目前庫存量不可小於 0'),
  total_quantity: yup
    .number()
    .typeError('資料格式錯誤')
    .required('安全總量必填')
    .min(0, '安全總量不可小於 0'),
  low_stock_threshold: yup
    .number()
    .typeError('資料格式錯誤')
    .required('低庫存門檻必填')
    .min(0, '低庫存門檻不可小於 0'),
  unit: yup
    .string()
    .typeError('資料格式錯誤')
    .required('庫存單位必填')
    .oneOf(unitOptions, '庫存單位錯誤'),
  location: yup.string().typeError('資料格式錯誤').required('儲存位置必填').trim(),
  image_url: yup.string().typeError('資料格式錯誤').trim().optional(),
  expireDate: yup.date().typeError('有效期限格式錯誤').optional(),
  msds: msdsSchema.optional(),
})

const updateBodySchema = yup
  .object({
    name: yup.string().typeError('資料格式錯誤').trim().optional(),
    cas_number: yup.string().typeError('資料格式錯誤').trim().optional(),
    category: yup
      .string()
      .typeError('資料格式錯誤')
      .oneOf(categoryOptions, '藥品分類錯誤')
      .optional(),
    ghs: yup.array().of(ghsSchema).optional(),

    total_quantity: yup.number().typeError('資料格式錯誤').min(0, '安全總量不可小於 0').optional(),
    low_stock_threshold: yup
      .number()
      .typeError('資料格式錯誤')
      .min(0, '低庫存門檻不可小於 0')
      .optional(),
    unit: yup.string().typeError('資料格式錯誤').oneOf(unitOptions, '庫存單位錯誤').optional(),
    location: yup.string().typeError('資料格式錯誤').trim().optional(),
    image_url: yup.string().typeError('資料格式錯誤').trim().optional(),
    expireDate: yup.date().typeError('有效期限格式錯誤').optional(),
    msds: msdsSchema.optional(),
  })
  .test('not-empty', '至少需要提供一個要修改的欄位', (value) => Object.keys(value).length > 0)

const parseRequestBody = (body: Record<string, unknown>) => {
  if (typeof body.data !== 'string') return body

  try {
    return JSON.parse(body.data) as Record<string, unknown>
  } catch {
    throw new yup.ValidationError('資料格式錯誤')
  }
}

const paramsSchema = yup.object({
  id: yup
    .string()
    .typeError('資料格式錯誤')
    .required('ID 必填')
    .trim()
    .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
})

/**
 * GET /chemical
 * 已登入的 User / Admin 都可以查看藥品資料。
 */
export const getAll = async (_req: Request, res: Response) => {
  const result = await Chemical.find().sort({ createdAt: -1 })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * GET /chemical/:id
 * 已登入的 User / Admin 都可以查看單一藥品。
 */
export const getId = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })
  const result = await Chemical.findById(parsedParams.id).orFail(new Error('CHEMICAL NOT FOUND'))

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * POST /chemical
 * 只有 Admin 可以新增藥品。
 */
export const create = async (req: Request, res: Response) => {
  const requestBody = parseRequestBody(req.body as Record<string, unknown>)
  const parsedBody = await bodySchema.validate(requestBody, { stripUnknown: true })
  const result = await Chemical.create({
    name: parsedBody.name,
    cas_number: parsedBody.cas_number,
    category: parsedBody.category,
    ghs: parsedBody.ghs ?? [],
    amount: parsedBody.amount,
    total_quantity: parsedBody.total_quantity,
    low_stock_threshold: parsedBody.low_stock_threshold,
    unit: parsedBody.unit,
    location: parsedBody.location,
    ...(req.file?.path
      ? { image_url: req.file.path }
      : parsedBody.image_url !== undefined
        ? { image_url: parsedBody.image_url }
        : {}),
    ...(parsedBody.expireDate !== undefined ? { expireDate: parsedBody.expireDate } : {}),
    ...(parsedBody.msds !== undefined
      ? {
        msds: {
          source: parsedBody.msds.source as MsdsSource,
          title: parsedBody.msds.title,
          ...(parsedBody.msds.url !== undefined ? { url: parsedBody.msds.url } : {}),
          ...(parsedBody.msds.content !== undefined ? { content: parsedBody.msds.content } : {}),
        },
      }
      : {}),
  })

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * PATCH /chemical/:id
 * 只有 Admin 可以修改藥品。
 * PATCH 採部分更新，因此每個欄位都是 optional。
 */
export const update = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })
  const requestBody = parseRequestBody(req.body as Record<string, unknown>)
  const parsedBody = await updateBodySchema.validate(requestBody, { stripUnknown: true })

  const updateData = {
    ...parsedBody,
    ...(req.file?.path ? { image_url: req.file.path } : {}),
  }

  const result = await Chemical.findByIdAndUpdate(parsedParams.id, updateData, {
    returnDocument: 'after',
    runValidators: true,
  }).orFail(new Error('CHEMICAL NOT FOUND'))

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * DELETE /chemical/:id
 * 只有 Admin 可以刪除藥品。
 */
export const remove = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })
  const result = await Chemical.findByIdAndDelete(parsedParams.id).orFail(
    new Error('CHEMICAL NOT FOUND'),
  )

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}
