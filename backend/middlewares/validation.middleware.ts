import type { NextFunction, Request, RequestHandler, Response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import type { ZodSchema } from 'zod'

import { BadRequestError } from '../errors/bad-request.error.ts'

// Definindo os tipos possíveis de seções do request que serão validadas
type RequestSchema = 'body' | 'query' | 'params'

export const validateSchema = (
  schema: ZodSchema,
  requestSection: RequestSchema = 'body',
): RequestHandler => {
  return expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Verificando se a seção de request fornecida é válida
      if (!['body', 'query', 'params'].includes(requestSection)) {
        throw new BadRequestError('Invalid request section')
      }

      // Validando a seção do request usando o schema fornecido
      schema.parse(req[requestSection])

      // Se a validação for bem-sucedida, chamar o próximo middleware
      next()
    },
  )
}
