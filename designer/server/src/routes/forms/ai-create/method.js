import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import * as methodModel from '~/src/models/forms/ai-create/method.js'
import { formOverviewPath } from '~/src/models/links.js'

const logger = createLogger()

export const ROUTE_PATH_CREATE_METHOD = '/create/method'
export const ROUTE_PATH_CREATE_AI_DESCRIBE = '/create/ai-describe'

const creationMethodSchema = Joi.object().keys({
  creationMethod: Joi.string()
    .valid('ai-assisted', 'manual')
    .required()
    .messages({
      'any.required': 'Select how you want to create your form',
      'any.only': 'Select a valid creation method'
    })
})

export default [
  /**
   * GET /create/method
   * @satisfies {ServerRoute}
   */
  {
    method: 'GET',
    path: ROUTE_PATH_CREATE_METHOD,
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    handler(request, h) {
      const { yar } = request

      const createData = yar.get(sessionNames.create)
      if (!createData?.title) {
        return h.redirect('/create/title').temporary()
      }

      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      return h.view(
        'forms/ai-create/method',
        methodModel.methodViewModel(createData, /** @type {any} */ (validation))
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  },

  /**
   * POST /create/method
   * @satisfies {ServerRoute}
   */
  {
    method: 'POST',
    path: ROUTE_PATH_CREATE_METHOD,
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    async handler(request, h) {
      const { payload, yar, auth } = request
      const { creationMethod } = /** @type {any} */ (payload)
      const { token } = auth.credentials

      const createData = yar.get(sessionNames.create)
      yar.set(sessionNames.create, {
        ...createData,
        creationMethod
      })

      if (creationMethod === 'ai-assisted') {
        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      } else {
        try {
          if (
            !createData?.title ||
            !createData.organisation ||
            !createData.teamName ||
            !createData.teamEmail
          ) {
            logger.error('Missing required form metadata for manual creation')
            return h.redirect('/create').code(StatusCodes.SEE_OTHER)
          }

          const result = await forms.create(
            {
              title: createData.title,
              organisation: createData.organisation,
              teamName: createData.teamName,
              teamEmail: createData.teamEmail
            },
            token
          )

          yar.clear(sessionNames.create)

          return h
            .redirect(formOverviewPath(result.slug))
            .code(StatusCodes.SEE_OTHER)
        } catch (err) {
          logger.error('Failed to create manual form', {
            error: err instanceof Error ? err.message : String(err)
          })
          return h.redirect('/create').code(StatusCodes.SEE_OTHER)
        }
      }
    },
    options: {
      validate: {
        payload: creationMethodSchema,
        /**
         * @param {Request} request
         * @param {ResponseToolkit} h
         * @param {Error} error
         */
        failAction: (request, h, error) => {
          const { yar } = request
          const formErrors = buildErrorDetails(/** @type {any} */ (error))

          yar.flash(sessionNames.validationFailure.createForm, {
            formErrors,
            formValues: request.payload
          })

          return h
            .redirect(ROUTE_PATH_CREATE_METHOD)
            .code(StatusCodes.SEE_OTHER)
            .takeover()
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  }
]

/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
