import { Router } from 'express'
import * as controllerInstrumentLog from '../controllers/instrumentLog'
import * as middlewareAuth from '../middlewares/auth'

const router = Router()

// 儀器異動是管理紀錄，因此只有 Admin 可以查看。
router.get('/', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerInstrumentLog.getAll)
router.get('/:id', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerInstrumentLog.getId)

export default router
