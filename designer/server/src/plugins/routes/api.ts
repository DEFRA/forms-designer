import { formDefinitionSchema } from '@defra/forms-model'
import { type ServerRoute, type ResponseObject } from '@hapi/hapi'

import * as persistenceService from '~/src/lib/formPersistenceService.js'

export const getFormWithId: ServerRoute = {
  // GET DATA
  method: 'GET',
  path: '/api/{id}/data',
  options: {
    async handler(request, h) {
      const { id } = request.params
      try {
        const response = await persistenceService.getDraftFormDefinition(id)
        const formJson = JSON.parse(response)

        return h.response(formJson)
      } catch (error) {
        request.logger.error(['GET /api/{id}/data', 'getFormWithId'], error)
        throw error
      }
    }
  }
}

export const putFormWithId: ServerRoute = {
  // SAVE DATA
  method: 'PUT',
  path: '/api/{id}/data',
  options: {
    payload: {
      parse: true
    },
    async handler(request, h) {
      const { id } = request.params
      try {
        const { value, error } = formDefinitionSchema.validate(
          request.payload,
          {
            abortEarly: false
          }
        )

        if (error) {
          request.logger.error(
            ['error', `/api/${id}/data`],
            [error, request.payload]
          )

          throw new Error(`Schema validation failed, reason: ${error.message}`)
        }
        await persistenceService.updateDraftFormDefinition(
          id,
          JSON.stringify(value)
        )
        return h.response({ ok: true }).code(204)
      } catch (err) {
        request.logger.error('Designer Server PUT /api/{id}/data error:', err)
        const errorSummary = {
          id,
          payload: request.payload,
          errorMessage: err.message,
          error: err.stack
        }
        request.yar.set(`error-summary-${id}`, errorSummary)
        return h.response({ ok: false, err }).code(500)
      }
    }
  }
}

export const log: ServerRoute = {
  method: 'POST',
  path: '/api/log',
  options: {
    handler(request, h): ResponseObject | undefined {
      try {
        request.server.log(request.payload.toString())
        return h.response({ ok: true }).code(204)
      } catch (error) {
        request.server.error(request.payload.toString())
        return h.response({ ok: false }).code(500)
      }
    }
  }
}
