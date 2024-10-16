import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'

import { BadRequestError } from '../errors/bad-request.error.ts'
import { UserDAO } from '../models/dao/user.dao.ts'
import { UserDTO } from '../models/dto/user.dto.ts'
import { sendVerificationEmail } from '../services/mailtrap/mailtrap.service.ts'
import {
  generateToken,
  generateVerificationToken,
  setTokenCookie,
} from '../utils/auth.utils.ts'
import { logger } from '../utils/logger.ts'

const userDao = new UserDAO()

export const signup: RequestHandler = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const { name, email, password } = req.body

    const userExists = await userDao.findByEmail(email)

    if (userExists) {
      logger.info('User already exists', { email })
      throw new BadRequestError('User already exists')
    }

    const verificationToken = generateVerificationToken()

    const userToBeCreate = {
      name,
      email,
      password,
      verificationToken,
    }

    const newUser = await userDao.create(userToBeCreate)

    const token = generateToken(newUser._id.toString())
    setTokenCookie(res, token)

    await sendVerificationEmail({
      email,
      verificationToken,
    })

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: UserDTO.toJson(newUser),
    })
  },
)
