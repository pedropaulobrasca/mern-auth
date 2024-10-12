import type { RequestHandler } from 'express'

import UserModel from '../models/user.model.ts'
import { generateVerificationToken } from '../utils/auth.utils.ts'

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

    console.log('verificationToken', verificationToken)

    const newUser = new UserModel({
      name,
      email,
      password,
      verificationToken,
    })

    await newUser.save()

    // TODO: JWT token

    // TODO: Send email with verificationToken

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
