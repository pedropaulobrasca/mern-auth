import { User } from '../../user.type.ts'
import UserModel from '../user.model.ts'

export class UserDAO {
  async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id)
  }

  async create(user: User): Promise<User> {
    const newUser = new UserModel(user)
    return await newUser.save()
  }
}
