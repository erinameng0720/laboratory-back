import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'
import validator from 'validator'
import InstrumentLog from '../models/instrumentLog'

const paramsSchema = yup.object({
  id: yup.string().required('ID 必填').trim().test('isMongoId', '資料格式錯誤', value => validator.isMongoId(value)),
})

/** GET /instrument-log */
export const getAll = async (_req: Request, res: Response) => {
  const result = await InstrumentLog.find()
    .sort({ createdAt: -1 })
    .populate('instrument_id', 'name model status')
    .populate('user_id', 'username role')

  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}

/** GET /instrument-log/:id */
export const getId = async (req: Request, res: Response) => {
  const { id } = await paramsSchema.validate(req.params, { stripUnknown: true })
  const result = await InstrumentLog.findById(id)
    .populate('instrument_id', 'name model status')
    .populate('user_id', 'username role')
    .orFail(new Error('INSTRUMENT LOG NOT FOUND'))

  res.status(StatusCodes.OK).json({ success: true, message: '', result })
}
