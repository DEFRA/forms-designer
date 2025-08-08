import { Scopes } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as edit from '~/src/models/forms/edit.js'
import { formOverviewPath } from '~/src/models/links.js'
import { redirectWithErrors, schema } from '~/src/routes/forms/create.js'
import { redirectToTitleWithErrors } from '~/src/routes/forms/helpers.js'

export const ROUTE_PATH_EDIT_LEAD_ORGANISATION =
  '/library/{slug}/edit/lead-organisation'
export const ROUTE_PATH_EDIT_TEAM = '/library/{slug}/edit/team'
export const ROUTE_PATH_EDIT_TITLE = '/library/{slug}/edit/title'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_LEAD_ORGANISATION,
    async handler(request, h) {
      const { yar, params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      return h.view(
        'forms/question-radios',
        edit.organisationViewModel(metadata, validation)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'organisation'> }>}
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

      return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          organisation: schema.extract('organisation')
        }),
        failAction: redirectWithErrors
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
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_TEAM,
    async handler(request, h) {
      const { yar, params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const { teamName, teamEmail } = await forms.get(slug, token)
      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      const metadata = { teamName, teamEmail, slug }

      return h.view(
        'forms/question-inputs',
        edit.teamDetailsViewModel(metadata, validation)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'teamName' | 'teamEmail'> }>}
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

      return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          teamName: schema.extract('teamName'),
          teamEmail: schema.extract('teamEmail')
        }),
        failAction: redirectWithErrors
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
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_EDIT_TITLE,
    async handler(request, h) {
      const { yar, params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const { title } = await forms.get(slug, token)
      const validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      const metadata = { title, slug }

      return h.view(
        'forms/question-input',
        edit.titleViewModel(metadata, validation)
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormMetadataInput, 'title'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_EDIT_TITLE,
    async handler(request, h) {
      const { yar, auth, payload, params } = request
      const { token } = auth.credentials

      const { title } = payload

      const { id } = await forms.get(params.slug, token)

      try {
        const { slug } = await forms.updateMetadata(id, { title }, token)

        yar.flash(
          sessionNames.successNotification,
          'Form name has been changed'
        )

        return h.redirect(formOverviewPath(slug)).code(StatusCodes.SEE_OTHER)
      } catch (err) {
        if (Boom.isBoom(err, StatusCodes.BAD_REQUEST)) {
          return redirectToTitleWithErrors(
            request,
            h,
            `${formOverviewPath(params.slug)}/edit/title`
          )
        }

        return Boom.internal(
          new Error('Failed to edit form title', {
            cause: err
          })
        )
      }
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          title: schema.extract('title')
        }),
        failAction: redirectWithErrors
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
 * @import { FormMetadataInput } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
