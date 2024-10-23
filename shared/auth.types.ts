import { z } from 'zod'

import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from './auth.schema.ts'

export type SignupSchema = z.infer<typeof signUpSchema>
export type VerifyEmail = z.infer<typeof verifyEmailSchema>
export type SignInSchema = z.infer<typeof signInSchema>
export type forgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
