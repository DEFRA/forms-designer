import { paginationOptionsSchema } from '@defra/forms-model'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'
import * as library from '~/src/models/forms/library.js'
import { formOverviewPath } from '~/src/models/links.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/library',
    options: {
      /**
       * @param {RequestFormsLibrary} request
       */
      handler: async (request, h) => {
        const { auth, query } = request
        const token = auth.credentials.token

        const { page, perPage } = query

        const paginationOptions = { page, perPage }
        const model = await library.listViewModel(token, paginationOptions)

        if (model.pagination) {
          const { totalPages } = model.pagination
          if (page < 1 || page > totalPages) {
            // Redirect to the first page
            const redirectUrl = new URL('/library', config.appBaseUrl)
            redirectUrl.searchParams.set('page', '1')
            redirectUrl.searchParams.set('perPage', String(perPage))
            return h.redirect(redirectUrl.pathname + redirectUrl.search)
          }
        }

        return h.view('forms/library', model)
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_READ}`]
        }
      },
      validate: {
        query: paginationOptionsSchema
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}',
    options: {
      async handler(request, h) {
        const { auth, params, yar } = request
        const { token } = auth.credentials

        // Retrieve form by slug
        const form = await forms.get(params.slug, token)

        const titleActionItems = []
        if (!form.live) {
          titleActionItems.push({
            href: `${formOverviewPath(form.slug)}/edit/title`,
            text: 'Change',
            visuallyHiddenText: 'title'
          })
        }

        const model = library.overviewViewModel(
          form,
          yar.flash(sessionNames.successNotification).at(0)
        )

        return h.view('forms/overview', { ...model, titleActionItems })
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_READ}`]
        }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/editor',
    options: {
      async handler(request, h) {
        const { auth, params } = request
        const { token } = auth.credentials

        // Retrieve form by slug
        const form = await forms.get(params.slug, token)

        // Retrieve definition by ID
        const definition = await forms.getDraftFormDefinition(form.id, token)

        const model = library.editorViewModel(form, definition)
        return h.view('forms/editor', model)
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
 * @typedef {Request<{ Query: PaginationOptions }>} RequestFormsLibrary
 */

/**
 * @import { Request } from '@hapi/hapi'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { PaginationOptions } from '@defra/forms-model'
 */
