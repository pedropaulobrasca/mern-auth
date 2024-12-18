import path from 'node:path'

import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'

import { morganMiddleware } from './middlewares/morgan.middleware.ts'
import authRouter from './routes/auth.route.ts'
import { connectToDatabase } from './utils/db.ts'
import { env } from './utils/env.ts'
import { errorHandler } from './utils/error-handler.ts'
import { logger } from './utils/logger.ts'

const app = express()
const PORT = Number(env.PORT)

app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use(morganMiddleware)

app.get('/health', (req, res) => {
  try {
    res.status(200).send('✅ Server is running')
  } catch (error) {
    logger.error(error)
    res.status(500).send('⛔ Server is down')
  }
})

app.use('/api/auth', authRouter)

if (env.NODE_ENV === 'production') {
  const dirname = path.resolve()
  logger.info('Serving static files from frontend/dist')
  logger.info(`dirname: ${dirname}`)
  app.use(express.static(path.join(dirname, '../frontend/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(dirname, 'frontend', 'dist', 'index.html'))
  })
}

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (res.headersSent) {
      return next(err)
    }
    errorHandler.handleError(err, res)
  },
)

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
  connectToDatabase()
})
