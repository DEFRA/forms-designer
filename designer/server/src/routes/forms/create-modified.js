import {
  Scopes,
  organisationSchema,
  slugify,
  teamEmailSchema,
  teamNameSchema,
  titleSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import * as create from '~/src/models/forms/create.js'
import { ROUTE_PATH_CREATE_METHOD } from '~/src/routes/forms/ai-create/method.js'
import { redirectToTitleWithErrors } from '~/src/routes/forms/helpers.js'

const logger = createLogger()

export const ROUTE_PATH_CREATE = '/create'
export const ROUTE_PATH_CREATE_TITLE = '/create/title'
export const ROUTE_PATH_CREATE_ORGANISATION = '/create/organisation'
export const ROUTE_PATH_CREATE_TEAM = '/create/team'

export const schema = Joi.object().keys({
  title: titleSchema.messages({
    'string.empty': 'Enter a form name',
    'string.max': 'Form name must be 250 characters or less'
  }),
  organisation: organisationSchema.messages({
    'any.required': 'Select a lead organisation',
    'any.only': 'Select a lead organisation'
  }),
  teamName: teamNameSchema.messages({
    'string.empty': 'Enter name of team',
    'string.max': 'Name of team must be 100 characters or less'
  }),
  teamEmail: teamEmailSchema.messages({
    'string.empty': 'Enter a shared team email address',
    'string.email': 'Enter a shared team email address in the correct format'
  })
})

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_CREATE,
    handler(request, h) {
      const { yar } = request

      yar.clear(sessionNames.create)
      yar.clear(sessionNames.validationFailure.createForm)

      return h.redirect(ROUTE_PATH_CREATE_TITLE).temporary()
    },
    options: {
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
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_CREATE_TITLE,
    handler(request, h) {
      const { yar } = request

      const metadata = yar.get(sessionNames.create)
      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      return h.view(
        'forms/question-input',
        create.titleViewModel(metadata, validation)
      )
    },
    options: {
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
   * Modified title POST to redirect to organisation first (not method selection)
   * @satisfies {ServerRoute<{ Payload: Pick<FormMetadataInput, 'title'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CREATE_TITLE,
    async handler(request, h) {
      const { auth, payload, yar } = request
      const { title } = payload
      const { token } = auth.credentials
      const slug = slugify(title)
      const form = await forms
        .get(slug, token)
        .catch((err) => logger.error(err))

      if (form) {
        return redirectToTitleWithErrors(request, h, ROUTE_PATH_CREATE_TITLE)
      }

      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        title: payload.title
      })

      return h
        .redirect(ROUTE_PATH_CREATE_ORGANISATION)
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          title: schema.extract('title')
        }),
        failAction: redirectToStepWithErrors
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
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_CREATE_ORGANISATION,
    handler(request, h) {
      const { yar } = request

      const metadata = yar.get(sessionNames.create)
      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      return h.view(
        'forms/question-radios',
        create.organisationViewModel(metadata, validation)
      )
    },
    options: {
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
   * @satisfies {ServerRoute<{ Payload: Pick<FormMetadataInput, 'organisation'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CREATE_ORGANISATION,
    handler(request, h) {
      const { payload, yar } = request

      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        organisation: payload.organisation
      })

      return h.redirect(ROUTE_PATH_CREATE_TEAM).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: schema.extract('organisation')
        }),
        failAction: redirectToStepWithErrors
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
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_CREATE_TEAM,
    handler(request, h) {
      const { yar } = request

      const metadata = yar.get(sessionNames.create)
      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      return h.view(
        'forms/question-inputs',
        create.teamViewModel(metadata, validation)
      )
    },
    options: {
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
   * Modified team POST to redirect to method selection (not create form immediately)
   * @satisfies {ServerRoute<{ Payload: FormMetadataInput }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CREATE_TEAM,
    handler(request, h) {
      const { payload, yar } = request

      const createData = yar.get(sessionNames.create)
      yar.set(sessionNames.create, {
        ...createData,
        teamName: payload.teamName,
        teamEmail: payload.teamEmail,
        organisation: payload.organisation
      })

      return h.redirect(ROUTE_PATH_CREATE_METHOD).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: redirectToStepWithErrors
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
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @param {Error} [error]
 */
export function redirectToStepWithErrors(request, h, error) {
  return redirectWithErrors(request, h, error, true)
}

/**
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @param {Error} [error]
 * @param {boolean} [redirectToPreviousStep] Optionally redirect to errors on previous steps, else it uses the current URL
 * @param {ValidationSessionKey} [flashKey] Optionally redirect to errors on previous steps, else it uses the current URL
 */
export function redirectWithErrors(
  request,
  h,
  error,
  redirectToPreviousStep = false,
  flashKey = sessionNames.validationFailure.createForm
) {
  const { payload, yar, url } = request
  let { pathname: redirectTo } = url

  if (error && error instanceof Joi.ValidationError) {
    const formErrors = buildErrorDetails(error)

    yar.flash(flashKey, {
      formErrors,
      formValues: payload
    })

    if (redirectToPreviousStep) {
      if ('title' in formErrors) {
        redirectTo = '/create/title'
      } else if ('organisation' in formErrors) {
        redirectTo = '/create/organisation'
      }
    }
  }

  return h.redirect(redirectTo).code(StatusCodes.SEE_OTHER).takeover()
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 * @import { FormMetadataInput } from '@defra/forms-model'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
