import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import ChemicalLog from '../models/chemicalLog'

const paramsSchema = yup.object({
  id: yup
    .string()
    .typeError('資料格式錯誤')
    .required('ID 必填')
    .trim()
    .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
})

/**
 * GET /chemical-log
 * 已登入的 User / Admin 都可以查看庫存異動紀錄。
 */
export const getAll = async (_req: Request, res: Response) => {
  const result = await ChemicalLog.find()
    .sort({ createdAt: -1 })
    .populate('chemical_id', 'name cas_number unit')
    .populate('user_id', 'username role')

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}

/**
 * GET /chemical-log/:id
 * 取得單筆庫存異動紀錄。
 */
export const getId = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })

  const result = await ChemicalLog.findById(parsedParams.id)
    .populate('chemical_id', 'name cas_number unit')
    .populate('user_id', 'username role')
    .orFail(new Error('CHEMICAL LOG NOT FOUND'))

  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result,
  })
}
