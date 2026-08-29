import { Schema, model, type HydratedDocument, Types } from 'mongoose'
import { hash } from '../utils/refreshToken'

export interface IRefreshToken {
  _id: Types.ObjectId
  user: Types.ObjectId
  refreshToken: string
  createdAt: Date
}

export type RefreshTokenDocument = HydratedDocument<IRefreshToken>

const schema = new Schema<IRefreshToken>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // 一週後過期，自動刪除這筆資料
    // 過期設定必須要放在日期欄位上
    expires: 60 * 60 * 24 * 7,
  },
})

schema.pre('save', function () {
  if (!this.isModified('refreshToken')) return

  this.refreshToken = hash(this.refreshToken)
})

export default model('refreshTokens', schema)
