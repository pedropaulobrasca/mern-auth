import winston from 'winston'

import { env } from './env.ts'

const metaKeyFormatter = winston.format((info) => {
  const defaultMetaKeys = [
    'level',
    'message',
    'timestamp',
    'app',
    'env',
    'error',
  ]

  const customMeta = Object.keys(info)
    .filter((key) => !defaultMetaKeys.includes(key))
    .reduce(
      (acc, key) => {
        acc[key] = info[key]
        delete info[key]
        return acc
      },
      {} as Record<string, unknown>,
    )

  if (Object.keys(customMeta).length > 0) {
    info.meta = { ...customMeta }
  }

  return info
})

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms A' }),
    winston.format.errors({ stack: true }),
    metaKeyFormatter(),
    winston.format.json(),
  ),
  defaultMeta: { app: env.APP_NAME, env: env.NODE_ENV },
  transports: [
    new winston.transports.Console({
      forceConsole: true,
    }),
  ],
})
