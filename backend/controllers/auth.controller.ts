import type { RequestHandler } from 'express'

import { UserDTO } from '../models/dto/user.dto.ts'
import UserModel from '../models/user.model.ts'
import { sendVerificationEmail } from '../services/mailtrap/mailtrap.service.ts'
import {
  generateToken,
  generateVerificationToken,
  setTokenCookie,
} from '../utils/auth.utils.ts'

export const signup: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body

    const userExists = await UserModel.findOne({ email })

    if (userExists) {
      res.status(400).json({
        message: 'User already exists',
      })
      return
    }

    const verificationToken = generateVerificationToken()

    const newUser = new UserModel({
      name,
      email,
      password,
      verificationToken,
    })

    await newUser.save()

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
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
