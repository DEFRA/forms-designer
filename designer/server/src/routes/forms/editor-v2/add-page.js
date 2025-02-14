import {
  organisationSchema,
  slugify,
  teamEmailSchema,
  teamNameSchema,
  titleSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import * as editor from '~/src/models/forms/editor-v2.js'
import { redirectToTitleWithErrors } from '~/src/routes/forms/helpers.js'

const logger = createLogger()

export const ROUTE_PATH_ADD_PAGE = '/library/{slug}/editor-v2/add-page'
export const ROUTE_PATH_QUESTION_TYPE =
  '/library/{slug}/editor-v2/page/{pageNum}/question'

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
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_ADD_PAGE,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)
      const validation = yar
        .flash(sessionNames.validationFailure.editorAddPage)
        .at(0)

      return h.view(
        'forms/question-radios',
        editor.addPageViewModel(definition, validation)
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
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: Pick<FormMetadataInput, 'title'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_ADD_PAGE,
    async handler(request, h) {
      const { auth, payload, yar } = request
      const { title } = payload
      const { token } = auth.credentials
      const slug = slugify(title)
      const form = await forms
        .get(slug, token)
        .catch((err) => logger.error(err))

      if (form) {
        return redirectToTitleWithErrors(request, h, ROUTE_PATH_ADD_PAGE)
      }

      // Update form metadata, redirect to next step
      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        title: payload.title
      })

      // Redirect POST to GET without resubmit on back button
      return h.redirect(ROUTE_PATH_QUESTION_TYPE).code(StatusCodes.SEE_OTHER)
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
          scope: [`+${scopes.SCOPE_WRITE}`]
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

    // Optionally redirect to errors on previous steps
    if (redirectToPreviousStep) {
      if ('title' in formErrors) {
        redirectTo = '/create/title'
      } else if ('organisation' in formErrors) {
        redirectTo = '/create/organisation'
      }
    }
  }

  // Redirect POST to GET without resubmit on back button
  return h.redirect(redirectTo).code(StatusCodes.SEE_OTHER).takeover()
}

/**
 * @import { FormMetadataInput } from '@defra/forms-model'
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 * @import { ValidationSessionKey } from '@hapi/yar'
 */
