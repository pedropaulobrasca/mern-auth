import type { RequestHandler } from 'express'

import { UserDAO } from '../models/dao/user.dao.ts'
import { UserDTO } from '../models/dto/user.dto.ts'
import { sendVerificationEmail } from '../services/mailtrap/mailtrap.service.ts'
import {
  generateToken,
  generateVerificationToken,
  setTokenCookie,
} from '../utils/auth.utils.ts'

const userDao = new UserDAO()

export const signup: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body

    const userExists = await userDao.findByEmail(email)

    if (userExists) {
      res.status(400).json({
        message: 'User already exists',
      })
      return
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
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
