import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as methodModel from '~/src/models/forms/ai-create/method.js'
import * as forms from '~/src/lib/forms.js'
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
    handler(request, h) {
      const { yar } = request

      // Check if form name was set
      const createData = yar.get(sessionNames.create)
      if (!createData?.title) {
        return h.redirect('/create/title').temporary()
      }

      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      return h.view(
        'forms/ai-create/method',
        methodModel.methodViewModel(createData, validation)
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
    async handler(request, h) {
      const { payload, yar, auth } = request
      const { creationMethod } = payload
      const { token } = auth.credentials

      // Update session with creation method
      const createData = yar.get(sessionNames.create)
      yar.set(sessionNames.create, {
        ...createData,
        creationMethod
      })

      // Route based on selection - org/team info already collected
      if (creationMethod === 'ai-assisted') {
        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      } else {
        // For manual forms, create the empty form now since we have all metadata
        try {
          const result = await forms.create(
            {
              title: createData.title,
              organisation: createData.organisation,
              teamName: createData.teamName,
              teamEmail: createData.teamEmail
            },
            token
          )

          // Clear form metadata
          yar.clear(sessionNames.create)

          return h
            .redirect(formOverviewPath(result.slug))
            .code(StatusCodes.SEE_OTHER)
        } catch (err) {
          // Handle errors appropriately
          logger.error('Failed to create manual form', { error: err.message })
          return h.redirect('/create').code(StatusCodes.SEE_OTHER)
        }
      }
    },
    options: {
      validate: {
        payload: creationMethodSchema,
        failAction: (request, h, error) => {
          const { yar } = request
          const formErrors = buildErrorDetails(error)

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
