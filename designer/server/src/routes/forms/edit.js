import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as edit from '~/src/models/forms/edit.js'
import { redirectWithErrors, schema } from '~/src/routes/forms/create.js'

export const ROUTE_PATH_EDIT_LEAD_ORGANISATION =
  '/library/{slug}/edit/lead-organisation'
export const ROUTE_PATH_EDIT_TEAM = '/library/{slug}/edit/team'

export default [
  /**
   * @satisfies {RequestBySlug}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_LEAD_ORGANISATION,
    async handler(request, h) {
      const { yar, params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'forms/question-radios',
        edit.organisationViewModel(metadata, validation)
      )
    }
  }),
  /**
   * @satisfies {RequestUpdateOrganisationBySlug}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_LEAD_ORGANISATION,
    async handler(request, h) {
      const { yar, auth, payload, params } = request
      const { token } = auth.credentials
      const { slug } = params
      const { organisation } = payload

      const { id } = await forms.get(slug, token)

      await forms.updateMetadata(id, { organisation }, token)

      yar.flash(
        sessionNames.successNotification,
        'Lead organisation has been changed'
      )

      return h.redirect(`/library/${slug}`).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: schema.extract('organisation')
        }),
        failAction: redirectWithErrors
      }
    }
  }),
  /**
   * @satisfies {RequestBySlug}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_TEAM,
    async handler(request, h) {
      const { yar, params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const { teamName, teamEmail } = await forms.get(slug, token)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      const metadata = { teamName, teamEmail, slug }

      return h.view(
        'forms/question-inputs',
        edit.teamDetailsViewModel(metadata, validation)
      )
    }
  }),
  /**
   * @satisfies {RequestUpdateTeamBySlug}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_TEAM,
    async handler(request, h) {
      const { yar, auth, payload, params } = request
      const { token } = auth.credentials
      const { slug } = params

      const { teamName, teamEmail } = payload

      const { id } = await forms.get(slug, token)

      await forms.updateMetadata(id, { teamName, teamEmail }, token)

      yar.flash(
        sessionNames.successNotification,
        'Team details have been changed'
      )

      return h.redirect(`/library/${slug}`).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          teamName: schema.extract('teamName'),
          teamEmail: schema.extract('teamEmail')
        }),
        failAction: redirectWithErrors
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

/**
 * @typedef {ServerRoute<{ Params: { slug: string } }>} RequestBySlug
 * @typedef {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'organisation'> }>} RequestUpdateOrganisationBySlug
 * @typedef {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'teamName' | 'teamEmail'> }>} RequestUpdateTeamBySlug
 */
