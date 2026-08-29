import { Router } from 'express'
import * as controllerInstrument from '../controllers/instrument'
import * as middlewareAuth from '../middlewares/auth'
import middlewareUpload from '../middlewares/upload'

const router = Router()

// Read：登入後即可查看儀器資料。
router.get('/', middlewareAuth.authenticate, controllerInstrument.getAll)
router.get('/:id', middlewareAuth.authenticate, controllerInstrument.getId)

// Write：只有 Admin 可以新增、修改、刪除儀器。
router.post(
  '/',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  middlewareUpload,
  controllerInstrument.create,
)
router.patch(
  '/:id',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  middlewareUpload,
  controllerInstrument.update,
)
router.delete(
  '/:id',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerInstrument.remove,
)

export default router
