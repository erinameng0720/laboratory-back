import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export const chemicalLogActionOptions = ['add', 'remove'] as const

export type ChemicalLogAction = (typeof chemicalLogActionOptions)[number]

export interface IChemicalLog {
  _id: Types.ObjectId
  chemical_id: Types.ObjectId
  user_id: Types.ObjectId
  action: ChemicalLogAction
  quantity: number
  before_amount: number
  after_amount: number
  reason: string
  createdAt: Date
}

export type ChemicalLogDocument = HydratedDocument<IChemicalLog>

const schema = new Schema<IChemicalLog>(
  {
    chemical_id: {
      type: Schema.Types.ObjectId,
      ref: 'chemicals',
      required: [true, '藥品必填'],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, '操作者必填'],
    },
    action: {
      type: String,
      enum: {
        values: chemicalLogActionOptions,
        message: '庫存異動類型錯誤',
      },
      required: [true, '庫存異動類型必填'],
    },
    quantity: {
      type: Number,
      required: [true, '異動數量必填'],
      min: [0.000001, '異動數量必須大於 0'],
    },
    before_amount: {
      type: Number,
      required: [true, '異動前庫存必填'],
      min: [0, '異動前庫存不可小於 0'],
    },
    after_amount: {
      type: Number,
      required: [true, '異動後庫存必填'],
      min: [0, '異動後庫存不可小於 0'],
    },
    reason: {
      type: String,
      required: [true, '異動原因必填'],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
)

schema.index({ chemical_id: 1, createdAt: -1 })
schema.index({ user_id: 1, createdAt: -1 })

export default model('chemicalLogs', schema)
