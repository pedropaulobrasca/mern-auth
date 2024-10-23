import { Router } from 'express'

import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from '../../shared/auth.schema.ts'
import {
  fetchCurrentUser,
  forgotPassword,
  resendVerificationEmail,
  signIn,
  signOut,
  signup,
  verifyEmail,
} from '../controllers/auth.controller.ts'
import { verifyToken } from '../middlewares/auth.middleware.ts'
import { validateSchema } from '../middlewares/validation.middleware.ts'

const router = Router()

router.post('/signup', validateSchema(signUpSchema), signup)
router.get('/me', verifyToken, fetchCurrentUser)
router.post(
  '/verify-email',
  verifyToken,
  validateSchema(verifyEmailSchema),
  verifyEmail,
)
router.post('/resend-verification-email', verifyToken, resendVerificationEmail)
router.post('/signout', verifyToken, signOut)
router.post('/signin', validateSchema(signInSchema), signIn)
router.post(
  '/forgot-password',
  validateSchema(forgotPasswordSchema),
  forgotPassword,
)

export default router
