import {
  organisationSchema,
  teamEmailSchema,
  teamNameSchema,
  titleSchema
} from '@defra/forms-model'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import * as create from '~/src/models/create.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create',
    handler(request, h) {
      return h.redirect('/create/title').permanent()
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
        'question-input',
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

      return h.redirect('/create/organisation').temporary()
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

          return h.redirect('/create/title').temporary().takeover()
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
        'question-radios',
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
        title: payload.organisation
      })

      return h.redirect('/create/team').temporary()
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: organisationSchema.messages({
            'any.required': 'Select a lead organisation',
            'string.max': 'Lead organisation must be 100 characters or less'
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

          return h.redirect('/create/organisation').temporary().takeover()
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
        'question-inputs',
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
    handler(request, h) {
      const { payload, yar } = request

      // Update form metadata, redirect to new form
      yar.set(sessionNames.create, {
        ...yar.get(sessionNames.create),
        teamName: payload.teamName,
        teamEmail: payload.teamEmail
      })

      /**
       * @todo Submit new form metadata
       * @todo Clear saved form metadata
       */
      return h.redirect('/create/team').temporary()
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

          return h.redirect('/create/team').temporary().takeover()
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
