import { Router } from 'express'

import { signupSchema, verifyEmailSchema } from '../../shared/auth.schema.ts'
import {
  fetchCurrentUser,
  signup,
  verifyEmail,
} from '../controllers/auth.controller.ts'
import { verifyToken } from '../middlewares/auth.middleware.ts'
import { validateSchema } from '../middlewares/validation.middleware.ts'

const router = Router()

router.post('/signup', validateSchema(signupSchema), signup)
router.get('/me', verifyToken, fetchCurrentUser)
router.post(
  '/verify-email',
  verifyToken,
  validateSchema(verifyEmailSchema),
  verifyEmail,
)

export default router
