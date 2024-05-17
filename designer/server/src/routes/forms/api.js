import { formDefinitionSchema } from '@defra/forms-model'
import Joi from 'joi'

import * as forms from '~/src/lib/forms.js'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: FormByIdInput }>}
   */
  ({
    method: 'GET',
    path: '/api/{id}/data',
    options: {
      handler(request) {
        return forms.getDraftFormDefinition(request.params.id)
      },
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: FormByIdInput, Payload: FormDefinition }>}
   */
  ({
    method: 'PUT',
    path: '/api/{id}/data',
    options: {
      payload: {
        parse: true
      },
      async handler(request, h) {
        const { auth, params, payload } = request
        const { id } = params
        const author = forms.getAuthor(auth.credentials)

        try {
          const result = formDefinitionSchema.validate(payload, {
            abortEarly: false
          })

          if (result.error) {
            const error = result.error
            request.logger.error(
              ['error', `/api/${id}/data`],
              [error, request.payload]
            )

            throw new Error(
              `Schema validation failed, reason: ${error.message}`
            )
          }

          const value = result.value

          // Update the form definition
          await forms.updateDraftFormDefinition(id, value, author)

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
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
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
  })
]

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */

/**
 * @typedef {import('@defra/forms-model').FormByIdInput} FormByIdInput
 * @typedef {import('@defra/forms-model').FormDefinition} FormDefinition
 */
