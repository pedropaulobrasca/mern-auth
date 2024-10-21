import bcrypt from 'bcryptjs'
import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'

import { BadRequestError } from '../errors/bad-request.error.ts'
import { NotFoundError } from '../errors/not-found.error copy.ts'
import { UserDAO } from '../models/dao/user.dao.ts'
import { UserDTO } from '../models/dto/user.dto.ts'
import UserModel from '../models/user.model.ts'
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../services/mailtrap/mailtrap.service.ts'
import {
  generateToken,
  generateVerificationToken,
  setTokenCookie,
} from '../utils/auth.utils.ts'
import { env } from '../utils/env.ts'
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

export const fetchCurrentUser: RequestHandler = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const user = await UserModel.findById(req.userId).select('-password')

    if (!user) {
      logger.error('User not found', { userId: req.userId })
      throw new NotFoundError('User not found')
    }

    res.status(200).json({
      success: true,
      data: UserDTO.toJson(user),
    })
  },
)

export const verifyEmail: RequestHandler = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const { verificationToken } = req.body

    const user = await UserModel.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: new Date() },
    }).select('-password')

    if (!user) {
      logger.error('User not found', { verificationToken })
      throw new NotFoundError('User not found')
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined

    await user.save()

    await sendWelcomeEmail(user.email, user.name)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: UserDTO.toJson(user),
    })
  },
)

export const resendVerificationEmail: RequestHandler = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const user = await UserModel.findById(req.userId).select('-password')

    if (!user) {
      logger.error('User not found', { userId: req.userId })
      throw new NotFoundError('User not found')
    }

    if (user.isVerified) {
      logger.info('User already verified', { email: user.email })
      throw new BadRequestError('User already verified')
    }

    const verificationToken = generateVerificationToken()

    user.verificationToken = verificationToken
    user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await user.save()

    await sendVerificationEmail({
      email: user.email,
      verificationToken,
    })

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    })
  },
)

export const signIn: RequestHandler = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })

    if (!user) {
      logger.error('User not found', { email })
      throw new BadRequestError('Invalid credentials')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      logger.error('Invalid credentials', { email })
      throw new BadRequestError('Invalid credentials')
    }

    const token = generateToken(user._id.toString())
    setTokenCookie(res, token)

    user.lastLogin = new Date()
    await user.save()

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: UserDTO.toJson(user),
    })
  },
)

export const signOut: RequestHandler = expressAsyncHandler(
  async (req, res): Promise<void> => {
    res.clearCookie(env.JWT_COOKIE_NAME)

    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    })
  },
)
