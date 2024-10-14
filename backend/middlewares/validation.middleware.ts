import type { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ZodSchema } from 'zod'
import { fromError } from 'zod-validation-error'

// Definindo os tipos possíveis de seções do request que serão validadas
type RequestSchema = 'body' | 'query' | 'params'

export const validateSchema = (
  schema: ZodSchema,
  requestSection: RequestSchema = 'body',
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Verificando se a seção de request fornecida é válida
      if (!['body', 'query', 'params'].includes(requestSection)) {
        res.status(500).send('Invalid request section')
        return
      }

      // Validando a seção do request usando o schema fornecido
      schema.parse(req[requestSection])

      // Se a validação for bem-sucedida, chamar o próximo middleware
      next()
    } catch (error) {
      // Caso ocorra um erro na validação, retornar um erro 400 com detalhes
      res.status(400).json({
        success: false,
        message: fromError(error).toString(),
      })
    }
  }
}
