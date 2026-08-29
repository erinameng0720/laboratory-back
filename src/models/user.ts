import { Schema, model, Error as MongooseError, type HydratedDocument, Types } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

export type UserRole = 'user' | 'admin'

export interface IUser {
  _id: Types.ObjectId
  username: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserDocument = HydratedDocument<IUser>

const schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, '帳號必填'],
      minLength: [4, '帳號必需是 4 個字以上'],
      maxLength: [20, '帳號必需是 20 個字以下'],
      trim: true,
      validate: {
        validator: (value: string) => validator.isAlphanumeric(value),
        message: '帳號只能是英數字',
      },
      unique: true,
    },
    email: {
      type: String,
      required: [true, '信箱必填'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '信箱格式錯誤',
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, '密碼必填'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '權限錯誤',
      },
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
)

schema.pre('save', async function () {
  if (!this.isModified('password')) return

  let message = ''
  if (this.password.length < 4) {
    message = '密碼最少 4 個字'
  } else if (this.password.length > 20) {
    message = '密碼最長 20 個字'
  }

  if (message !== '') {
    const error = new MongooseError.ValidationError()
    error.addError('password', new MongooseError.ValidatorError({ message }))
    throw error
  }

  this.password = await bcrypt.hash(this.password, 10)
})

export default model('users', schema)
