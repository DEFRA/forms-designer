import { SchemaVersion, Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import * as viewModel from '~/src/models/forms/editor-v2/pages.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_PATH_PAGES = 'pages'
export const ROUTE_FULL_PATH_PAGES = '/library/{slug}/editor-v2/pages'

const notificationKey = sessionNames.successNotification

/**
 * @param { string[] | string | undefined } filterOptions
 */
export function buildFilterQuery(filterOptions) {
  if (!filterOptions) {
    return ''
  }

  if (typeof filterOptions === 'string') {
    return filterOptions
  }

  return filterOptions.join(',')
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Query: { filter: string | undefined } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGES,
    async handler(request, h) {
      const { params, auth, yar, query } = request
      const { token } = auth.credentials
      const { slug } = params
      const { filter } = query

      const metadata = await forms.get(slug, token)
      const formId = metadata.id

      const definition = await forms.getDraftFormDefinition(formId, token)

      if (definition.schema !== SchemaVersion.V2) {
        return h
          .redirect(editorv2Path(slug, 'migrate'))
          .code(StatusCodes.SEE_OTHER)
      }

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      const filterArray = !filter || filter === '' ? [] : filter.split(',')

      return h.view(
        'forms/editor-v2/pages',
        viewModel.pagesViewModel(
          metadata,
          definition,
          filterArray,
          notification
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormRead}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: { conditionsFilter: string[] | string | undefined } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGES,
    handler(request, h) {
      const { params, payload } = request
      const { slug } = params

      const filterQuery = buildFilterQuery(payload.conditionsFilter)

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(
          editorv2Path(
            slug,
            filterQuery !== '' ? `pages?filter=${filterQuery}` : 'pages'
          )
        )
        .code(StatusCodes.SEE_OTHER)
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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
