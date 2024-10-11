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
})

type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
