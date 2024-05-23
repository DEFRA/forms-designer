import {
  organisationSchema,
  slugify,
  teamEmailSchema,
  teamNameSchema,
  titleSchema
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import { getAuthor } from '~/src/lib/forms.js'
import * as create from '~/src/models/forms/create.js'

const logger = createLogger()
const schema = Joi.object().keys({
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
    'string.email':
      'Enter a shared team email address in the correct format, like name@example.gov.uk'
  })
})

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create',
    handler(request, h) {
      const { yar } = request

      // Clear previous form data
      yar.clear(sessionNames.create)
      yar.clear(sessionNames.validationFailure)

      // Redirect to first step
      return h.redirect('/create/title').temporary()
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create/title',
    handler(request, h) {
      const { yar } = request

      // Form metadata, validation errors
      const metadata = yar.get(sessionNames.create)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'forms/question-input',
        create.titleViewModel(metadata, validation)
      )
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: Pick<FormMetadataInput, 'title'> }>}
   */
  ({
    method: 'POST',
    path: '/create/title',
    async handler(request, h) {
      const { auth, payload, yar } = request
      const { title } = payload
      const token = auth.credentials.token
      const slug = slugify(title)
      const form = await forms.get(slug, token).catch(logger.error)

      if (form) {
        yar.flash('validationFailure', {
          formErrors: create.titleFormErrors,
          formValues: payload
        })

        // Redirect POST to GET without resubmit on back button
        return h.redirect(request.url.pathname).code(303).takeover()
      }

      // Update form metadata, redirect to next step
      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        title: payload.title
      })

      // Redirect POST to GET without resubmit on back button
      return h.redirect('/create/organisation').code(303)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          title: schema.extract('title')
        }),

        failAction(request, h, error) {
          const { payload, yar, url } = request
          const { pathname: redirectTo } = url

          if (error instanceof Joi.ValidationError) {
            yar.flash('validationFailure', {
              formErrors: buildErrorDetails(error),
              formValues: payload
            })
          }

          // Redirect POST to GET without resubmit on back button
          return h.redirect(redirectTo).code(303).takeover()
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create/organisation',
    handler(request, h) {
      const { yar } = request

      // Form metadata, validation errors
      const metadata = yar.get(sessionNames.create)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'forms/question-radios',
        create.organisationViewModel(metadata, validation)
      )
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: Pick<FormMetadataInput, 'organisation'> }>}
   */
  ({
    method: 'POST',
    path: '/create/organisation',
    handler(request, h) {
      const { payload, yar } = request

      // Update form metadata, redirect to next step
      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        organisation: payload.organisation
      })

      // Redirect POST to GET without resubmit on back button
      return h.redirect('/create/team').code(303)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: schema.extract('organisation')
        }),

        failAction(request, h, error) {
          const { payload, yar, url } = request
          const { pathname: redirectTo } = url

          if (error instanceof Joi.ValidationError) {
            yar.flash('validationFailure', {
              formErrors: buildErrorDetails(error),
              formValues: payload
            })
          }

          // Redirect POST to GET without resubmit on back button
          return h.redirect(redirectTo).code(303).takeover()
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create/team',
    handler(request, h) {
      const { yar } = request

      // Form metadata, validation errors
      const metadata = yar.get(sessionNames.create)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'forms/question-inputs',
        create.teamViewModel(metadata, validation)
      )
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: FormMetadataInput }>}
   */
  ({
    method: 'POST',
    path: '/create/team',
    async handler(request, h) {
      const { auth, payload, yar } = request
      const author = getAuthor(auth.credentials)
      const token = auth.credentials.token

      // Update form metadata
      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        teamName: payload.teamName,
        teamEmail: payload.teamEmail
      })

      try {
        // Create the form
        const result = await forms.create(payload, author, token)

        // Clear form metadata
        yar.clear(sessionNames.create)

        /**
         * Redirect POST to GET without resubmit on back button
         */
        return h.redirect(`/library/${result?.slug}`).code(303)
      } catch (err) {
        if (Boom.isBoom(err) && err.data?.error === 'FormAlreadyExistsError') {
          yar.flash('validationFailure', {
            formErrors: create.titleFormErrors,
            formValues: payload
          })

          // Redirect POST to GET without resubmit on back button
          return h.redirect('/create/title').code(303).takeover()
        }

        return Boom.internal(
          new Error('Failed to create new form', {
            cause: err
          })
        )
      }
    },
    options: {
      validate: {
        payload: schema,

        failAction(request, h, error) {
          const { payload, yar, url } = request
          let { pathname: redirectTo } = url

          if (error instanceof Joi.ValidationError) {
            const formErrors = buildErrorDetails(error)

            // Optionally redirect to errors on previous steps
            if ('title' in formErrors) {
              redirectTo = '/create/title'
            } else if ('organisation' in formErrors) {
              redirectTo = '/create/organisation'
            }

            yar.flash('validationFailure', {
              formErrors: {
                teamName: formErrors.teamName,
                teamEmail: formErrors.teamEmail
              },
              formValues: payload
            })
          }

          // Redirect POST to GET without resubmit on back button
          return h.redirect(redirectTo).code(303).takeover()
        }
      }
    }
  })
]

/**
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */
