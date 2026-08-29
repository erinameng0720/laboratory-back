import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export const instrumentStatusOptions = ['available', 'in_use', 'maintenance'] as const

export type InstrumentStatus = (typeof instrumentStatusOptions)[number]

export interface IInstrument {
  _id: Types.ObjectId
  name: string
  model: string
  status: InstrumentStatus
  image_url?: string
  createdAt: Date
  updatedAt: Date
}

export type InstrumentDocument = HydratedDocument<IInstrument>

const schema = new Schema<IInstrument>(
  {
    name: {
      type: String,
      required: [true, '儀器名稱必填'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, '儀器型號必填'],
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: instrumentStatusOptions,
        message: '儀器狀態錯誤',
      },
      required: [true, '儀器狀態必填'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  },
)

schema.index({ status: 1 })

export default model('instruments', schema)
