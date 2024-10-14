import { Router } from 'express'

import { signupSchema } from '../../shared/auth.schema.ts'
import { signup } from '../controllers/auth.controller.ts'
import { validateSchema } from '../middlewares/validation.middleware.ts'

const router = Router()

router.post('/signup', validateSchema(signupSchema), signup)

console.log(`🔒 Auth routes loaded with ${router.stack.length} routes`)

export default router
