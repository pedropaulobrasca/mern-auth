import { z } from 'zod'

import { signInSchema, signUpSchema, verifyEmailSchema } from './auth.schema.ts'

export type SignupSchema = z.infer<typeof signUpSchema>
export type VerifyEmail = z.infer<typeof verifyEmailSchema>
export type SignInSchema = z.infer<typeof signInSchema>
