import { Router } from 'express'
import * as controllerChemical from '../controllers/chemical'
import * as controllerInventory from '../controllers/inventory'
import * as middlewareAuth from '../middlewares/auth'
import middlewareUpload from '../middlewares/upload'

const router = Router()

// Read：登入後即可查看藥品資料。
router.get('/', middlewareAuth.authenticate, controllerChemical.getAll)

// Inventory：只有 Admin 可以異動庫存。
router.post(
  '/:id/inventory/add',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerInventory.add,
)
router.post(
  '/:id/inventory/remove',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerInventory.remove,
)
router.post(
  '/:id/inventory/adjust',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerInventory.adjust,
)

router.get('/:id', middlewareAuth.authenticate, controllerChemical.getId)

// Write：只有 Admin 可以新增、修改、刪除藥品。
router.post(
  '/',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  middlewareUpload,
  controllerChemical.create,
)
router.patch(
  '/:id',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  middlewareUpload,
  controllerChemical.update,
)
router.delete(
  '/:id',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerChemical.remove,
)

export default router
