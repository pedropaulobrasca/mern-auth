import { z } from 'zod'

const nameSchema = z.string().min(3)
const emailSchema = z.string().email()
const passwordSchema = z.string().min(6)
const tokenSchema = z.string()

const passwordConfirmationFields = z.object({
  password: passwordSchema,
  confirm: passwordSchema,
})

const addPasswordConfirmationRefinement = <T extends z.ZodTypeAny>(schema: T) =>
  schema.refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

export const signUpSchema = addPasswordConfirmationRefinement(
  z
    .object({
      name: nameSchema,
      email: emailSchema,
    })
    .merge(passwordConfirmationFields),
)

export const verifyEmailSchema = z.object({
  verificationToken: tokenSchema,
})

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = addPasswordConfirmationRefinement(
  z
    .object({
      token: tokenSchema,
    })
    .merge(passwordConfirmationFields),
)
