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
        const { auth, params } = request

        return forms.getDraftFormDefinition(params.id, auth.credentials.token)
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
        const token = auth.credentials.token

        try {
          const result = formDefinitionSchema.validate(payload, {
            abortEarly: false,
            stripUnknown: true
          })

          if (result.error) {
            const { error } = result

            throw new Error(
              `Schema validation failed, reason: ${error.message}`,
              { cause: error }
            )
          }

          const value = result.value

          // Update the form definition
          await forms.updateDraftFormDefinition(id, value, token)

          return h.response({ ok: true }).code(204)
        } catch (err) {
          request.logger.error(err, 'Designer Server PUT /api/{id}/data error')
          const errorSummary = {
            id,
            payload,
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
