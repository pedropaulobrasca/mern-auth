import { z } from 'zod'

import { signupSchema, verifyEmailSchema } from './auth.schema.ts'

export type SignupSchema = z.infer<typeof signupSchema>
export type VerifyEmail = z.infer<typeof verifyEmailSchema>
