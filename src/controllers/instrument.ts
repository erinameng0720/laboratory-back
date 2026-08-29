import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import { trusted } from 'mongoose'
import Instrument, { instrumentStatusOptions } from '../models/instrument'
import InstrumentLog from '../models/instrumentLog'
import Reservation from '../models/reservation'

const bodySchema = yup.object({
  name: yup.string().typeError('資料格式錯誤').required('儀器名稱必填').trim(),
  model: yup.string().typeError('資料格式錯誤').required('儀器型號必填').trim(),
  status: yup
    .string()
    .typeError('資料格式錯誤')
    .oneOf(instrumentStatusOptions, '儀器狀態錯誤')
    .optional(),
  reason: yup.string().trim().optional(),
})

const updateBodySchema = yup
  .object({
    name: yup.string().typeError('資料格式錯誤').trim().optional(),
    model: yup.string().typeError('資料格式錯誤').trim().optional(),
    status: yup
      .string()
      .typeError('資料格式錯誤')
      .oneOf(instrumentStatusOptions, '儀器狀態錯誤')
      .optional(),
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
 * GET /instrument
 * 已登入的 User / Admin 都可以查看儀器資料。
 */
export const getAll = async (_req: Request, res: Response) => {
  const result = await Instrument.find().sort({ createdAt: -1 })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * GET /instrument/:id
 * 已登入的 User / Admin 都可以查看單一儀器。
 */
export const getId = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })

  const result = await Instrument.findById(parsedParams.id).orFail(
    new Error('INSTRUMENT NOT FOUND'),
  )

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * POST /instrument
 * 只有 Admin 可以新增儀器。
 *
 * status 沒有傳入時，會由 Instrument Schema 使用 default = available。
 */
export const create = async (req: Request, res: Response) => {
  const requestBody = parseRequestBody(req.body as Record<string, unknown>)
  const parsedBody = await bodySchema.validate(requestBody, { stripUnknown: true })
  const result = await Instrument.create({
    name: parsedBody.name,
    model: parsedBody.model,
    ...(parsedBody.status !== undefined ? { status: parsedBody.status } : {}),
    ...(req.file?.path ? { image_url: req.file.path } : {}),
  })

  await InstrumentLog.create({
    instrument_id: result._id,
    user_id: req.user!._id,
    action: 'add',
    reason: parsedBody.reason?.trim() || '新增儀器',
  })

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * PATCH /instrument/:id
 * 只有 Admin 可以修改儀器。
 *
 * PATCH 採部分更新，因此所有欄位都是 optional，
 * 但至少必須提供一個欄位。
 */
export const update = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })
  const requestBody = parseRequestBody(req.body as Record<string, unknown>)
  const parsedBody = await updateBodySchema.validate(requestBody, { stripUnknown: true })

  const updateData = {
    ...parsedBody,
    ...(req.file?.path ? { image_url: req.file.path } : {}),
  }

  const result = await Instrument.findByIdAndUpdate(parsedParams.id, updateData, {
    returnDocument: 'after',
    runValidators: true,
  }).orFail(new Error('INSTRUMENT NOT FOUND'))

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * DELETE /instrument/:id
 * 只有 Admin 可以刪除儀器。
 *
 * 有 pending / confirmed 預約的儀器不可刪除，避免產生孤兒預約。
 * cancelled 預約是歷史資料，不會阻擋儀器刪除；Frontend 會以
 * 「已刪除儀器」顯示其 populate(null) 結果。
 */
export const remove = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })

  const hasActiveReservations = await Reservation.exists({
    instrument_id: parsedParams.id,
    status: trusted({ $in: ['pending', 'confirmed'] }),
  })

  if (hasActiveReservations) {
    throw new Error('INSTRUMENT HAS ACTIVE RESERVATIONS')
  }

  const result = await Instrument.findByIdAndDelete(parsedParams.id).orFail(
    new Error('INSTRUMENT NOT FOUND'),
  )

  await InstrumentLog.create({
    instrument_id: result._id,
    user_id: req.user!._id,
    action: 'remove',
    reason:
      typeof req.body.reason === 'string' && req.body.reason.trim()
        ? req.body.reason.trim()
        : '刪除儀器',
  })

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}
