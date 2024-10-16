import mongoose from 'mongoose'

import { env } from './env.ts'
import { logger } from './logger.ts'

export async function connectToDatabase() {
  try {
    const mongodb = await mongoose.connect(env.MONGO_CONNECTION_STRING)
    logger.info('Connected to database: ', mongodb.connection.host)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
