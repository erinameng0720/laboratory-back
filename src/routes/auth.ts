import { Router } from 'express'
import * as controllerAuth from '../controllers/auth'
import * as middlewareAuth from '../middlewares/auth'

const router = Router()

// Public Authentication APIs
router.post('/login', middlewareAuth.login, controllerAuth.login)
router.post('/refresh', controllerAuth.refresh)
router.delete('/logout', controllerAuth.logout)

// Protected Authentication API：用來驗證 JWT → Passport → req.user 是否正常。
router.get('/me', middlewareAuth.authenticate, controllerAuth.me)

export default router
