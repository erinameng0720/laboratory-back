import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export const instrumentLogActionOptions = ['add', 'remove'] as const
export type InstrumentLogAction = (typeof instrumentLogActionOptions)[number]

export interface IInstrumentLog {
  _id: Types.ObjectId
  instrument_id: Types.ObjectId
  user_id: Types.ObjectId
  action: InstrumentLogAction
  reason: string
  createdAt: Date
}

export type InstrumentLogDocument = HydratedDocument<IInstrumentLog>

const schema = new Schema<IInstrumentLog>(
  {
    instrument_id: {
      type: Schema.Types.ObjectId,
      ref: 'instruments',
      required: [true, '儀器必填'],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, '操作者必填'],
    },
    action: {
      type: String,
      enum: { values: instrumentLogActionOptions, message: '儀器異動類型錯誤' },
      required: [true, '儀器異動類型必填'],
    },
    reason: {
      type: String,
      required: [true, '異動原因必填'],
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

schema.index({ instrument_id: 1, createdAt: -1 })
schema.index({ user_id: 1, createdAt: -1 })

export default model('instrumentLogs', schema)
