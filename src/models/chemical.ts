import { Schema, model, type HydratedDocument, Types } from 'mongoose'

export const categoryOptions = [
  'acid',
  'base',
  'salt',
  'alcohol',
  'ketone',
  'ester',
  'aromatic_hydrocarbon',
] as const

export type ChemicalCategory = (typeof categoryOptions)[number]

export const unitOptions = ['mL', 'L', 'g', 'kg', 'bottle'] as const

export type ChemicalUnit = (typeof unitOptions)[number]

export interface IGhs {
  image_url: string
  name: string
  precautions: string
}

export type MsdsSource = 'admin' | 'external_api'

export interface IMsds {
  source: MsdsSource
  title: string
  url?: string
  content?: string
  updatedAt: Date
}

export interface IChemical {
  _id: Types.ObjectId
  name: string
  cas_number: string
  category: ChemicalCategory
  ghs: IGhs[]
  amount: number
  total_quantity: number
  low_stock_threshold: number
  unit: ChemicalUnit
  location: string
  image_url?: string
  expireDate?: Date
  msds?: IMsds
  createdAt: Date
  updatedAt: Date
}

export type ChemicalDocument = HydratedDocument<IChemical>

const ghsSchema = new Schema<IGhs>(
  {
    image_url: {
      type: String,
      required: [true, 'GHS 圖片必填'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'GHS 名稱必填'],
      trim: true,
    },
    precautions: {
      type: String,
      required: [true, 'GHS 注意事項必填'],
      trim: true,
    },
  },
  { _id: false },
)

const msdsSchema = new Schema<IMsds>(
  {
    source: {
      type: String,
      enum: {
        values: ['admin', 'external_api'],
        message: 'MSDS 來源錯誤',
      },
      required: [true, 'MSDS 來源必填'],
    },
    title: {
      type: String,
      required: [true, 'MSDS 名稱必填'],
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
)

const schema = new Schema<IChemical>(
  {
    name: {
      type: String,
      required: [true, '藥品名稱必填'],
      trim: true,
    },
    cas_number: {
      type: String,
      required: [true, 'CAS 編號必填'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, '藥品分類必填'],
      enum: {
        values: categoryOptions,
        message: '藥品分類錯誤',
      },
    },
    ghs: {
      type: [ghsSchema],
      default: [],
    },
    amount: {
      type: Number,
      required: [true, '目前庫存量必填'],
      min: [0, '目前庫存量不可小於 0'],
    },
    total_quantity: {
      type: Number,
      required: [true, '安全總量必填'],
      min: [0, '安全總量不可小於 0'],
    },
    low_stock_threshold: {
      type: Number,
      required: [true, '低庫存門檻必填'],
      min: [0, '低庫存門檻不可小於 0'],
    },
    unit: {
      type: String,
      required: [true, '庫存單位必填'],
      enum: {
        values: unitOptions,
        message: '庫存單位錯誤',
      },
    },
    location: {
      type: String,
      required: [true, '儲存位置必填'],
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    expireDate: {
      type: Date,
    },
    msds: {
      type: msdsSchema,
    },
  },
  {
    timestamps: true,
  },
)

schema.index({ category: 1 })
schema.index({ expireDate: 1 })
schema.index({ location: 1 })

export default model('chemicals', schema)
