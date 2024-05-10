import {
  formMetadataInputSchema,
  organisationSchema,
  teamEmailSchema,
  teamNameSchema,
  titleSchema
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import * as create from '~/src/models/forms/create.js'

/**
 * Gets the author from the auth credentials
 * @param {import('@hapi/hapi').UserCredentials | undefined} user
 */
function getAuthor(user) {
  // @ts-expect-error - user is not undefined
  return { id: user.id, displayName: user.displayName }
}

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
      return h.redirect('/create/title').code(303)
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
    handler(request, h) {
      const { payload, yar } = request

      // Update form metadata, redirect to next step
      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        title: payload.title
      })

      return h.redirect('/create/organisation').code(303)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          title: titleSchema.messages({
            'string.empty': 'Enter your form name',
            'string.max': 'Form name must be 250 characters or less'
          })
        }),

        failAction(request, h, error) {
          const { payload, yar } = request

          if (error instanceof Joi.ValidationError) {
            yar.flash('validationFailure', {
              formErrors: buildErrorDetails(error.details),
              formValues: payload
            })
          }

          return h.redirect('/create/title').code(303).takeover()
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

      return h.redirect('/create/team').code(303)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: organisationSchema.messages({
            'any.required': 'Select a lead organisation',
            'any.only': 'Select a lead organisation'
          })
        }),

        failAction(request, h, error) {
          const { payload, yar } = request

          if (error instanceof Joi.ValidationError) {
            yar.flash('validationFailure', {
              formErrors: buildErrorDetails(error.details),
              formValues: payload
            })
          }

          return h.redirect('/create/organisation').code(303).takeover()
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
   * @satisfies {ServerRoute<{ Payload: Pick<FormMetadataInput, 'teamName' | 'teamEmail'> }>}
   */
  ({
    method: 'POST',
    path: '/create/team',
    async handler(request, h) {
      const { auth, payload, yar } = request
      const { credentials } = auth

      // Update form metadata
      const metadata = yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        teamName: payload.teamName,
        teamEmail: payload.teamEmail
      })

      // Check form metadata is complete
      const result = formMetadataInputSchema.validate(metadata)

      // Submit new form metadata
      try {
        if (!result.error && credentials.user) {
          const { user } = credentials

          // Create the form
          await forms.create({
            metadata: result.value,
            author: getAuthor(user)
          })

          // Clear form metadata
          yar.clear(sessionNames.create)

          /**
           * Temporarily redirect to library
           * @todo Redirect to new form
           */
          return h.redirect('/library').code(303)
        }
      } catch (cause) {
        return Boom.internal(
          new Error('Failed to create new form', {
            cause
          })
        )
      }

      /**
       * Form metadata is incomplete
       * @todo Redirect to step with validation errors
       */
      return h.redirect('/create/team').code(303)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          teamName: teamNameSchema.messages({
            'string.empty': 'Enter your team name',
            'string.max': 'Team name must be 100 characters or less'
          }),
          teamEmail: teamEmailSchema.messages({
            'string.empty': 'Enter your shared team email address',
            'string.email':
              'Enter your shared team email address in the correct format, like name@example.gov.uk'
          })
        }),

        failAction(request, h, error) {
          const { payload, yar } = request

          if (error instanceof Joi.ValidationError) {
            const formErrors = buildErrorDetails(error.details)

            yar.flash('validationFailure', {
              formErrors: {
                teamName: formErrors.teamName,
                teamEmail: formErrors.teamEmail
              },
              formValues: payload
            })
          }

          return h.redirect('/create/team').code(303).takeover()
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
