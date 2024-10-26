export type User = {
  _id: string
  name: string
  email: string
  password: string
  lastLogin: Date
  isVerified: boolean
  resetPasswordToken?: string
  resetPasswordExpiresAt?: Date
  verificationToken?: string
  verificationTokenExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type CreateUser = {
  name: string
  email: string
  password: string
}
