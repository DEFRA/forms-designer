import { Scopes, paginationOptionFields } from '@defra/forms-model'
import Joi from 'joi'

import config from '~/src/config.js'
import * as audit from '~/src/lib/audit.js'
import * as forms from '~/src/lib/forms.js'
import { historyViewModel } from '~/src/models/forms/history.js'
import { formOverviewPath } from '~/src/models/links.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/history',
    options: {
      /**
       * @param {RequestFormHistory} request
       */
      async handler(request, h) {
        const { auth, params, query } = request
        const { token } = auth.credentials
        const { page, perPage } = query

        // Retrieve form by slug
        const form = await forms.get(params.slug, token)

        // Get form definition if draft exists
        let definition
        if (form.draft) {
          definition = await forms.getDraftFormDefinition(form.id, token)
        }

        const auditResponse = await audit.getFormHistory(form.id, token, {
          page,
          perPage,
          consolidate: true
        })

        // Handle page overflow - redirect to first page before building view model
        const { totalPages } = auditResponse.meta.pagination
        if (totalPages > 0 && page > totalPages) {
          const formPath = formOverviewPath(form.slug)
          const redirectUrl = new URL(`${formPath}/history`, config.appBaseUrl)
          redirectUrl.searchParams.set('page', '1')
          redirectUrl.searchParams.set('perPage', String(perPage))

          return h.redirect(redirectUrl.pathname + redirectUrl.search)
        }

        const model = historyViewModel(form, definition, auditResponse)

        return h.view('forms/history', model)
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormRead}`]
        }
      },
      validate: {
        query: Joi.object({
          ...paginationOptionFields
        }),
        failAction: (request, h, error) => {
          const { params } = request
          request.log('error', {
            message: error?.message,
            stack: error?.stack
          })

          // Redirect to default pagination on invalid query params
          const formPath = formOverviewPath(params.slug)
          const redirectUrl = new URL(`${formPath}/history`, config.appBaseUrl)

          return h.redirect(redirectUrl.pathname).takeover()
        }
      }
    }
  })
]

/**
 * @typedef {Request<{ Params: { slug: string }; Query: PaginationOptions }>} RequestFormHistory
 */

/**
 * @import { PaginationOptions } from '@defra/forms-model'
 * @import { Request, ServerRoute } from '@hapi/hapi'
 */
