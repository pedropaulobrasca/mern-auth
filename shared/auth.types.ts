import { z } from 'zod'

import { signupSchema } from './auth.schema.ts'

export type SignupSchema = z.infer<typeof signupSchema>
