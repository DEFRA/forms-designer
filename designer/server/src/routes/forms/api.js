import { formDefinitionSchema } from '@defra/forms-model'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
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
        const { auth, params, payload, yar } = request
        const { id } = params
        const token = auth.credentials.token

        try {
          const result = formDefinitionSchema.validate(payload, {
            abortEarly: false,
            stripUnknown: true
          })

          if (result.error) {
            const { error } = result

            yar.flash(sessionNames.validationFailure, {
              formErrors: buildErrorDetails(error),
              formValues: payload
            })

            throw new Error(
              `Schema validation failed, reason: ${error.message}`,
              { cause: error }
            )
          }

          const { value } = result

          // Update the form definition
          await forms.updateDraftFormDefinition(id, value, token)

          return h.response({ ok: true }).code(204)
        } catch (err) {
          request.logger.error(err, 'Designer Server PUT /api/{id}/data error')
          return h.response({ ok: false, err }).code(500)
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { messages: LogMessages, level: Level, error:? LogError } }>}
   */
  ({
    method: 'POST',
    path: '/api/log',
    options: {
      handler(request, h) {
        const { level, messages, error } = request.payload

        try {
          error // Include error if present
            ? request.logger[level](error, ...messages)
            : request.logger[level](...messages)

          return h.response({ ok: true }).code(204)
        } catch (error) {
          request.logger.error(error)
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
 * @typedef {import('pino').Level} Level
 * @typedef {import('pino').SerializedError} LogError
 * @typedef {[message: string, ...args: any[]]} LogMessages
 */
