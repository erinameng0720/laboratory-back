import { Router } from 'express'
import * as controllerChemicalLog from '../controllers/chemicalLog'
import * as middlewareAuth from '../middlewares/auth'

const router = Router()

// ChemicalLog 是實驗室內部的操作歷史，因此必須先登入。
router.get('/', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerChemicalLog.getAll)
router.get('/:id', middlewareAuth.authenticate, middlewareAuth.requireAdmin, controllerChemicalLog.getId)

export default router
