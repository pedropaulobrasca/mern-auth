import express, { Request, Response } from 'express'

import { env } from './utils/env.ts'

const app = express()

const PORT = Number(env.PORT)

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).send('Server is running')
  } catch (error) {
    console.error(error)
    res.status(500).send('Server is down')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
