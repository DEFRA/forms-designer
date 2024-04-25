import { formDefinitionSchema } from '@defra/forms-model'

import * as forms from '~/src/lib/forms.js'

/**
 * @type {ServerRoute}
 */
export const getFormWithId = {
  method: 'GET',
  path: '/api/{id}/data',
  options: {
    async handler(request, h) {
      const { id } = request.params
      try {
        const formJson = await forms.getDraftFormDefinition(id)

        return h.response(/** @type {object} */ (formJson))
      } catch (error) {
        request.logger.error(['GET /api/{id}/data', 'getFormWithId'], error)
        throw error
      }
    }
  }
}

/**
 * @type {ServerRoute}
 */
export const putFormWithId = {
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

        await forms.updateDraftFormDefinition(id, JSON.stringify(value))

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

/**
 * @type {ServerRoute}
 */
export const log = {
  method: 'POST',
  path: '/api/log',
  options: {
    handler(request, h) {
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

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */
