import { Router } from 'express'
import * as controllerAuth from '../controllers/auth'
import * as middlewareAuth from '../middlewares/auth'

const router = Router()

// Public Authentication APIs。帳號建立不開放註冊，僅能由 Admin 透過 POST /user 建立。
router.post('/login', middlewareAuth.login, controllerAuth.login)
router.post('/refresh', controllerAuth.refresh)
router.delete('/logout', controllerAuth.logout)

// Protected Authentication API：用來驗證 JWT → Passport → req.user 是否正常。
router.get('/me', middlewareAuth.authenticate, controllerAuth.me)

export default router
