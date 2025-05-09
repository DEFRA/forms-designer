import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import { errorViewModel } from '~/src/models/errors.js'

export const ROUTE_FULL_PATH = `/library/{slug}/editor-v2/error`

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    handler(_request, h) {
      const errorMessage =
        'Sorry, there is a problem with the service - failed to save session state'

      return h.view(
        `${StatusCodes.INTERNAL_SERVER_ERROR}`,
        errorViewModel(errorMessage)
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
