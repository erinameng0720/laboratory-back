import { UserDocument } from '../models/user'

// 重新定義 express 的 user 型別
// req.user 預設型別是 {}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserDocument {}
  }
}
