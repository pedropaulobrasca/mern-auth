import type { Response } from 'express'
import { ZodError } from 'zod'
import { fromError } from 'zod-validation-error'

import { BadRequestError } from '../errors/bad-request.error.ts'
import { logger } from './logger.ts'

class ErrorHandler {
  public async handleError(error: unknown, responseStream?: Response) {
    if (!responseStream) {
      logger.error('No response stream provided', error)
      return
    }

    // Verifica se os cabeçalhos já foram enviados
    if (responseStream.headersSent) {
      logger.error('Response headers already sent', error)
      return
    }

    if (error instanceof BadRequestError) {
      logger.info('Bad request error', error)
      return responseStream.status(400).json({
        success: false,
        message: error.message,
      })
    } else if (error instanceof ZodError) {
      logger.info('Validation error', error)
      return responseStream.status(400).json({
        success: false,
        message: fromError(error).toString(),
      })
    } else {
      logger.error('Internal server error', error)
      return responseStream.status(500).json({
        success: false,
        message: 'Something went wrong',
      })
    }
  }
}

export const errorHandler = new ErrorHandler()
