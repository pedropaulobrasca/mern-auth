import { z } from 'zod'

export const baseSignupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirm: z.string().min(6),
})

export const signupSchema = baseSignupSchema.refine(
  (data) => data.password === data.confirm,
  {
    message: 'Passwords do not match',
    path: ['confirm'],
  },
)
