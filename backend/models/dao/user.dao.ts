import mongoose from 'mongoose'

import { CreateUser, User } from '../../user.types.ts'
import { UserDTO } from '../dto/user.dto.ts'
import UserModel from '../user.model.ts'

export class UserDAO {
  async findById(
    id: string,
  ): Promise<Omit<
    User,
    | 'password'
    | 'resetPasswordToken'
    | 'resetPasswordExpiresAt'
    | 'verificationToken'
    | 'verificationTokenExpiresAt'
  > | null> {
    const user = await UserModel.findById(id)

    if (!user) {
      return null
    }
    return UserDTO.toJson(user)
  }

  async findByEmail(
    email: string,
  ): Promise<Omit<
    User,
    | 'password'
    | 'resetPasswordToken'
    | 'resetPasswordExpiresAt'
    | 'verificationToken'
    | 'verificationTokenExpiresAt'
  > | null> {
    const user = await UserModel.findOne({ email })

    if (!user) {
      return null
    }

    return UserDTO.toJson(user)
  }

  async create(user: CreateUser): Promise<mongoose.Document & User> {
    const newUser = new UserModel(user)
    return await newUser.save()
  }
}
