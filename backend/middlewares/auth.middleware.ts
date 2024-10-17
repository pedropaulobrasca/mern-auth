import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { BadRequestError } from '../errors/bad-request.error.ts'
import { env } from '../utils/env.ts'

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[env.JWT_COOKIE_NAME]

  if (!token) {
    throw new BadRequestError('Token not provided', 401)
  }

  const decoded = jwt.verify(token, env.JWT_SECRET)
  if (!decoded) {
    throw new BadRequestError('Invalid token', 401)
  }

  req.userId = (decoded as jwt.JwtPayload).userId

  next()
}
