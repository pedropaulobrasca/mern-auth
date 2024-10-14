import type { Response } from 'express'
import jwt from 'jsonwebtoken'

import { env } from './env.ts'

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRATION,
  })
}

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie(env.JWT_COOKIE_NAME, token, {
    maxAge: parseInt(env.JWT_COOKIE_MAX_AGE_IN_MS),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  })
}

export const generateVerificationToken = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const calculateExpiresAt = (hours: number): Date => {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}
