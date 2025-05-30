import { slugSchema } from '@defra/forms-model'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as viewModel from '~/src/models/forms/editor-v2/conditions.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_FULL_PATH_CONDITIONS = '/library/{slug}/editor-v2/conditions'

const notificationKey = sessionNames.successNotification

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CONDITIONS,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      // Get form metadata and definition
      const { metadata, definition } = await getForm(slug, token)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/conditions',
        viewModel.conditionsViewModel(metadata, definition, notification)
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      },
      validate: {
        params: Joi.object().keys({
          slug: slugSchema
        })
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
