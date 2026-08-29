import type { Request, Response } from 'express'
import * as yup from 'yup'
import validator from 'validator'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import Chemical from '../models/chemical'
import ChemicalLog, { type ChemicalLogAction, type ChemicalLogDocument } from '../models/chemicalLog'
import type { ChemicalDocument } from '../models/chemical'

const paramsSchema = yup.object({
  id: yup
    .string()
    .typeError('資料格式錯誤')
    .required('ID 必填')
    .trim()
    .test('isMongoId', '資料格式錯誤', (value) => validator.isMongoId(value)),
})

const bodySchema = yup.object({
  quantity: yup
    .number()
    .typeError('異動數量必須是數字')
    .required('異動數量必填')
    .moreThan(0, '異動數量必須大於 0'),
  reason: yup
    .string()
    .typeError('異動原因必須是文字')
    .required('異動原因必填')
    .trim()
    .min(1, '異動原因必填'),
})

const stocktakeBodySchema = yup.object({
  target_amount: yup
    .number()
    .typeError('盤點庫存量必須是數字')
    .required('盤點庫存量必填')
    .min(0, '盤點庫存量不可小於 0'),
  reason: yup
    .string()
    .typeError('盤點原因必須是文字')
    .required('盤點原因必填')
    .trim()
    .min(1, '盤點原因必填'),
})

/**
 * 共用的庫存異動商業邏輯。
 * add：增加庫存
 * remove：減少庫存
 */
const adjustInventory = async (req: Request, res: Response, action: ChemicalLogAction) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })
  const parsedBody = await bodySchema.validate(req.body, { stripUnknown: true })

  const session = await mongoose.startSession()

  try {
    let result: { chemical: ChemicalDocument; log: ChemicalLogDocument } | undefined

    await session.withTransaction(async () => {
      const chemical = await Chemical.findById(parsedParams.id).session(session)

      if (!chemical) {
        throw new Error('CHEMICAL NOT FOUND')
      }

      const beforeAmount = chemical.amount
      const afterAmount =
        action === 'add'
          ? beforeAmount + parsedBody.quantity
          : beforeAmount - parsedBody.quantity

      if (action === 'remove' && afterAmount < 0) {
        throw new Error('INSUFFICIENT STOCK')
      }

      chemical.amount = afterAmount
      await chemical.save({ session })

      const [log] = await ChemicalLog.create(
        [
          {
            chemical_id: chemical._id,
            user_id: req.user!._id,
            action,
            quantity: parsedBody.quantity,
            before_amount: beforeAmount,
            after_amount: afterAmount,
            reason: parsedBody.reason,
          },
        ],
        { session },
      )

      if (!log) {
        throw new Error('CHEMICAL LOG CREATE FAILED')
      }

      result = { chemical, log }
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: action === 'add' ? '庫存增加成功' : '庫存減少成功',
      result,
    })
  } finally {
    await session.endSession()
  }
}

/**
 * POST /chemical/:id/inventory/add
 * 只有 Admin 可以增加庫存。
 */
export const add = async (req: Request, res: Response) => {
  await adjustInventory(req, res, 'add')
}

/**
 * POST /chemical/:id/inventory/remove
 * 只有 Admin 可以減少庫存。
 */
export const remove = async (req: Request, res: Response) => {
  await adjustInventory(req, res, 'remove')
}

/**
 * POST /chemical/:id/inventory/adjust
 * 只有 Admin 可以依照實際盤點結果設定庫存量。
 * Backend 會以資料庫最新庫存計算差額，並建立 ChemicalLog。
 */
export const adjust = async (req: Request, res: Response) => {
  const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })
  const parsedBody = await stocktakeBodySchema.validate(req.body, { stripUnknown: true })
  const session = await mongoose.startSession()

  try {
    let result: { chemical: ChemicalDocument; log: ChemicalLogDocument | null } | undefined

    await session.withTransaction(async () => {
      const chemical = await Chemical.findById(parsedParams.id).session(session)

      if (!chemical) {
        throw new Error('CHEMICAL NOT FOUND')
      }

      const beforeAmount = chemical.amount
      const afterAmount = parsedBody.target_amount
      const quantity = Math.abs(afterAmount - beforeAmount)

      if (quantity === 0) {
        result = { chemical, log: null }
        return
      }

      const action: ChemicalLogAction = afterAmount > beforeAmount ? 'add' : 'remove'
      chemical.amount = afterAmount
      await chemical.save({ session })

      const [log] = await ChemicalLog.create(
        [{
          chemical_id: chemical._id,
          user_id: req.user!._id,
          action,
          quantity,
          before_amount: beforeAmount,
          after_amount: afterAmount,
          reason: parsedBody.reason,
        }],
        { session },
      )

      if (!log) {
        throw new Error('CHEMICAL LOG CREATE FAILED')
      }

      result = { chemical, log }
    })

    if (!result) {
      throw new Error('CHEMICAL LOG CREATE FAILED')
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.log ? '盤點庫存調整成功' : '盤點庫存量沒有變更',
      result,
    })
  } finally {
    await session.endSession()
  }
}
