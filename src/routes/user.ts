import { Router } from 'express'
import * as middlewareAuth from '../middlewares/auth'
import * as controllerUser from '../controllers/user'

const router = Router()

router.get('/profile', middlewareAuth.authenticate, controllerUser.getProfile)
router.patch('/password', middlewareAuth.authenticate, controllerUser.changePassword)

// User Management：只有 Admin 可以查看、建立與修改使用者權限。
router.get('/', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerUser.getAll)
router.post('/', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerUser.create)
router.patch(
  '/:id',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerUser.updateRole,
)
router.delete(
  '/:id',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerUser.remove,
)

export default router
