import express from 'express'

import authRouter from './routes/auth.route.ts'
import { connectToDatabase } from './utils/db.ts'
import { env } from './utils/env.ts'

const app = express()
const PORT = Number(env.PORT)

app.use(express.json())

app.get('/health', (req, res) => {
  try {
    res.status(200).send('✅ Server is running')
  } catch (error) {
    console.error(error)
    res.status(500).send('⛔ Server is down')
  }
})

app.use('/api/v1/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  connectToDatabase()
})
