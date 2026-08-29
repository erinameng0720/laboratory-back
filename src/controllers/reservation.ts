import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import { trusted } from 'mongoose'
import Reservation, { type ReservationStatus } from '../models/reservation'
import Instrument from '../models/instrument'

const paramsSchema = yup.object({
  id: yup
    .string()
    .typeError('資料格式錯誤')
    .required('ID 必填')
    .trim()
    .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
})

const createBodySchema = yup.object({
  instrument_id: yup
    .string()
    .typeError('儀器 ID 格式錯誤')
    .required('儀器必填')
    .trim()
    .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
  start_time: yup.date().typeError('開始時間格式錯誤').required('開始時間必填'),
  end_time: yup.date().typeError('結束時間格式錯誤').required('結束時間必填'),
})

const reviewBodySchema = yup.object({
  status: yup
    .string()
    .typeError('預約狀態格式錯誤')
    .required('審核結果必填')
    .oneOf(['confirmed', 'cancelled'], '審核結果錯誤'),
  cancel_reason: yup.string().typeError('取消原因格式錯誤').trim().optional(),
})

const cancelBodySchema = yup.object({
  cancel_reason: yup
    .string()
    .typeError('取消原因格式錯誤')
    .required('取消原因必填')
    .trim()
    .min(1, '取消原因必填'),
})

const ensureTimeRange = (startTime: Date, endTime: Date) => {
  if (startTime >= endTime) {
    throw new Error('INVALID RESERVATION TIME')
  }
}

/**
 * 檢查同一台儀器在指定時間是否已有「佔用時段」的 Reservation。
 * pending / confirmed 都會佔用時段，cancelled 不會。
 */
const ensureNoConflict = async (
  instrumentId: string,
  startTime: Date,
  endTime: Date,
  excludeId?: string,
) => {
  const query = Reservation.findOne({
    instrument_id: instrumentId,
    status: trusted({ $in: ['pending', 'confirmed'] }),
    start_time: trusted({ $lt: endTime }),
    end_time: trusted({ $gt: startTime }),
  })

  if (excludeId) {
    query.where({ _id: trusted({ $ne: excludeId }) })
  }

  const conflict = await query

  if (conflict) {
    throw new Error('RESERVATION CONFLICT')
  }
}

/**
 * GET /reservation
 * User：只能查看自己的預約。
 * Admin：可以查看全部預約。
 */
export const getAll = async (req: Request, res: Response) => {
  const filter = req.user!.role === 'admin' ? {} : { user_id: req.user!._id }

  const result = await Reservation.find(filter)
    .sort({ start_time: 1, createdAt: -1 })
    .populate('user_id', 'username email role')
    .populate('instrument_id', 'name model status')
    .populate('reviewed_by', 'username email role')

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * GET /reservation/:id
 * User：只能查看自己的預約。
 * Admin：可以查看任何預約。
 */
export const getId = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })

  const filter =
    req.user!.role === 'admin'
      ? { _id: parsedParams.id }
      : { _id: parsedParams.id, user_id: req.user!._id }

  const result = await Reservation.findOne(filter)
    .populate('user_id', 'username email role')
    .populate('instrument_id', 'name model status')
    .populate('reviewed_by', 'username email role')

  if (!result) {
    if (req.user!.role !== 'admin') {
      throw new Error('RESERVATION FORBIDDEN')
    }

    throw new Error('RESERVATION NOT FOUND')
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * POST /reservation
 * 建立預約後直接進入 pending。
 * user_id 不接受 Frontend 傳入，而是從 req.user 取得。
 */
export const create = async (req: Request, res: Response) => {
  const parsedBody = await createBodySchema.validate(req.body, { stripUnknown: true })

  ensureTimeRange(parsedBody.start_time, parsedBody.end_time)

  const instrument = await Instrument.findById(parsedBody.instrument_id).orFail(
    new Error('INSTRUMENT NOT FOUND'),
  )

  if (instrument.status === 'maintenance') {
    throw new Error('INSTRUMENT MAINTENANCE')
  }

  await ensureNoConflict(parsedBody.instrument_id, parsedBody.start_time, parsedBody.end_time)

  const result = await Reservation.create({
    user_id: req.user!._id,
    instrument_id: instrument._id,
    start_time: parsedBody.start_time,
    end_time: parsedBody.end_time,
    status: 'pending',
  })

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: '預約申請成功，等待管理員審核',
    result,
  })
}

/**
 * PATCH /reservation/:id/review
 * 只有 Admin 可以審核。
 * confirmed：建立確認結果。
 * cancelled：必須留下 cancel_reason。
 */
export const review = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })
  const parsedBody = await reviewBodySchema.validate(req.body, { stripUnknown: true })

  if (parsedBody.status === 'cancelled' && !parsedBody.cancel_reason?.trim()) {
    throw new yup.ValidationError('取消原因必填')
  }

  if (parsedBody.status === 'confirmed' && parsedBody.cancel_reason?.trim()) {
    throw new yup.ValidationError('已確認的預約不可填寫取消原因')
  }

  const reservation = await Reservation.findById(parsedParams.id).orFail(
    new Error('RESERVATION NOT FOUND'),
  )

  if (parsedBody.status === 'confirmed' && reservation.status !== 'pending') {
    throw new Error('RESERVATION STATUS INVALID')
  }

  if (
    parsedBody.status === 'cancelled' &&
    !['pending', 'confirmed'].includes(reservation.status)
  ) {
    throw new Error('RESERVATION STATUS INVALID')
  }

  if (parsedBody.status === 'confirmed') {
    const instrumentExists = await Instrument.exists({ _id: reservation.instrument_id })

    if (!instrumentExists) {
      throw new Error('INSTRUMENT NOT FOUND')
    }

    await ensureNoConflict(
      reservation.instrument_id.toString(),
      reservation.start_time,
      reservation.end_time,
      reservation._id.toString(),
    )
  }

  reservation.status = parsedBody.status as ReservationStatus
  reservation.reviewed_by = req.user!._id
  reservation.reviewed_at = new Date()

  if (parsedBody.status === 'cancelled') {
    reservation.cancel_reason = parsedBody.cancel_reason!.trim()
  }

  await reservation.save()

  res.status(StatusCodes.OK).json({
    success: true,
    message: parsedBody.status === 'confirmed' ? '預約確認成功' : '預約取消成功',
    result: reservation,
  })
}
