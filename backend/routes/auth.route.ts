import { Router } from 'express'

import { signup } from '../controllers/auth.controller.ts'

const router = Router()

router.post('/signup', signup)

console.log(`🔒 Auth routes loaded with ${router.stack.length} routes`)

export default router
