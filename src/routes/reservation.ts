import { Router } from 'express'
import * as controllerReservation from '../controllers/reservation'
import * as middlewareAuth from '../middlewares/auth'

const router = Router()

// Reservation 的所有 API 都必須先登入。
router.get('/', middlewareAuth.authenticate, controllerReservation.getAll)
router.get('/:id', middlewareAuth.authenticate, controllerReservation.getId)

// 建立預約：User / Admin 都可以提出自己的預約申請。
router.post('/', middlewareAuth.authenticate, controllerReservation.create)

// Admin 審核預約：confirmed / cancelled。
router.patch(
  '/:id/review',
  middlewareAuth.authenticate,
  middlewareAuth.requireAdmin,
  controllerReservation.review,
)

export default router
