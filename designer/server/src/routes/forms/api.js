import {
  Scopes,
  formDefinitionSchema,
  getErrorMessage
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
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
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormRead}`]
        }
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

            yar.flash(sessionNames.validationFailure.updateForm, {
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

          return h.response({ ok: true }).code(StatusCodes.NO_CONTENT)
        } catch (err) {
          request.logger.error(
            err,
            `[apiUpdateFailed] Designer Server PUT /api/${id}/data error - ${getErrorMessage(err)}`
          )
          return h
            .response({ ok: false, err })
            .code(StatusCodes.INTERNAL_SERVER_ERROR)
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { messages: [message: string, ...args: any[]], level: Level, error:? SerializedError } }>}
   */
  ({
    method: 'POST',
    path: '/api/log',
    options: {
      handler(request, h) {
        const { logger, payload } = request
        const { level, messages, error } = payload

        try {
          const logFn = logger[level].bind(logger)

          // Include error if present
          if (error) {
            logFn(error, ...messages)
          } else {
            logFn(...messages)
          }

          return h.response({ ok: true }).code(StatusCodes.NO_CONTENT)
        } catch (err) {
          logger.error(err)
          return h
            .response({ ok: false })
            .code(StatusCodes.INTERNAL_SERVER_ERROR)
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  })
]

/**
 * @import { FormByIdInput, FormDefinition } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { Level, SerializedError } from 'pino'
 */
