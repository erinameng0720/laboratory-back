// declare 全域宣告型別，整個專案不用 import 也能知道
// namespace 命名空間
declare namespace NodeJS {
  interface ProcessEnv {
    DB_URL: string
    PORT: string
    JWT_SECRET: string
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
  }
}
