import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  APP_NAME: z.string().default('mern-auth-service-dev'),
  PORT: z
    .string()
    .refine((port) => parseInt(port) > 0 && parseInt(port) < 65535, {
      message: 'PORT must be a valid number between 0 and 65535',
    })
    .default('3333'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  MONGO_CONNECTION_STRING: z.string(),

  MAILTRAP_API_TOKEN: z.string(),
  MAILTRAP_HOST: z.string(),
  MAILTRAP_SENDER_EMAIL: z.string(),
  MAILTRAP_SENDER_NAME: z.string(),
  MAILTRAP_COMPANY_NAME: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  JWT_COOKIE_NAME: z.string(),
  JWT_COOKIE_MAX_AGE_IN_MS: z.string().refine((maxAge) => parseInt(maxAge) > 0),

  BCRYPT_SALT_ROUNDS: z
    .string()
    .refine((salt) => parseInt(salt) >= 10 && parseInt(salt) <= 12),
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
