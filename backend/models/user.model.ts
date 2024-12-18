import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

import type { User } from '../user.types.ts'
import { calculateExpiresAt } from '../utils/auth.utils.ts'
import { env } from '../utils/env.ts'

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    lastLogin: { type: Date, required: true, default: new Date() },
    isVerified: { type: Boolean, required: true, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS))
    this.password = await bcrypt.hash(this.password, salt)
  }

  if (this.verificationToken && !this.verificationTokenExpiresAt) {
    this.verificationTokenExpiresAt = calculateExpiresAt(24)
  }

  if (this.resetPasswordToken && !this.resetPasswordExpiresAt) {
    this.resetPasswordExpiresAt = calculateExpiresAt(1)
  }

  next()
})

const UserModel = mongoose.model<User>('User', userSchema)

export default UserModel
