import { Router } from 'express'

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from '../../shared/auth.schema.ts'
import {
  fetchCurrentUser,
  forgotPassword,
  resendVerificationEmail,
  resetPassword,
  signIn,
  signOut,
  signup,
  verifyEmail,
} from '../controllers/auth.controller.ts'
import { verifyToken } from '../middlewares/auth.middleware.ts'
import { validateSchema } from '../middlewares/validation.middleware.ts'

const router = Router()

router.post('/sign-up', validateSchema(signUpSchema), signup)
router.get('/me', verifyToken, fetchCurrentUser)
router.post(
  '/verify-email',
  verifyToken,
  validateSchema(verifyEmailSchema),
  verifyEmail,
)
router.post('/resend-verification-email', verifyToken, resendVerificationEmail)
router.post('/sign-out', verifyToken, signOut)
router.post('/sign-in', validateSchema(signInSchema), signIn)
router.post(
  '/forgot-password',
  validateSchema(forgotPasswordSchema),
  forgotPassword,
)
router.post(
  '/reset-password',
  validateSchema(resetPasswordSchema),
  resetPassword,
)

export default router
