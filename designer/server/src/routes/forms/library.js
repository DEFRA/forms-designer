import {
  Scopes,
  paginationOptionFields,
  searchOptionFields
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import config from '~/src/config.js'
import * as audit from '~/src/lib/audit.js'
import * as forms from '~/src/lib/forms.js'
import { getSortOptions } from '~/src/lib/sort.js'
import { overviewHistoryViewModel } from '~/src/models/forms/history.js'
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
        const { auth, query, yar } = request
        const token = auth.credentials.token
        const { page, perPage, sort, title, author, organisations, status } =
          query

        const successNotification = yar
          .flash(sessionNames.successNotification)
          .at(0)

        const { sortBy, order } = getSortOptions(sort)
        const listOptions = {
          page,
          perPage,
          sortBy,
          order,
          title,
          author: author === 'all' ? '' : author,
          organisations,
          status,
          successNotification
        }
        const model = await library.listViewModel(token, listOptions)

        if (author === 'all') {
          model.search ??= {}
          model.search.author = 'all'
        }

        if (model.pagination) {
          const { totalPages } = model.pagination
          if (totalPages && page > totalPages) {
            // Redirect to the first page
            const redirectUrl = new URL('/library', config.appBaseUrl)
            redirectUrl.searchParams.set('page', '1')
            redirectUrl.searchParams.set('perPage', String(perPage))
            if (sort) {
              redirectUrl.searchParams.set('sort', sort)
            }
            if (title) {
              redirectUrl.searchParams.set('title', title)
            }

            return h.redirect(redirectUrl.pathname + redirectUrl.search)
          }
        }

        return h.view('forms/library', model)
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
          ...paginationOptionFields,
          ...searchOptionFields,
          sort: Joi.string()
            .valid('updatedDesc', 'updatedAsc', 'titleAsc', 'titleDesc')
            .optional()
        }),
        failAction: (request, _h, error) => {
          request.log('error', {
            message: error?.message,
            stack: error?.stack
          })

          throw Boom.badRequest()
        }
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
        let definition
        if (form.draft) {
          definition = await forms.getDraftFormDefinition(form.id, token)
        }

        const titleActionItems = []
        if (!form.live) {
          titleActionItems.push({
            href: `${formOverviewPath(form.slug)}/edit/title`,
            text: 'Change',
            visuallyHiddenText: 'title'
          })
        }

        let history
        try {
          const auditResponse = await audit.getFormHistory(form.id, token)
          history = overviewHistoryViewModel(form, auditResponse.auditRecords)
        } catch (err) {
          request.log('error', {
            message: 'Failed to fetch form history',
            error: err
          })
          history = {
            heading: {
              text: 'History',
              size: 'medium',
              level: '3'
            },
            items: [],
            viewFullHistoryLink: {
              text: 'View full history',
              href: `${formOverviewPath(form.slug)}/history`
            },
            hasItems: false
          }
        }

        const model = library.overviewViewModel(
          form,
          definition,
          yar.flash(sessionNames.successNotification).at(0)
        )

        return h.view('forms/overview', { ...model, titleActionItems, history })
      },
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
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  })
]

/**
 * @typedef {object} SortOptions
 * @property {'updatedDesc' | 'updatedAsc' | 'titleAsc' | 'titleDesc'} [sort] - The sort order
 */

/**
 * @typedef {PaginationOptions & SortOptions & SearchOptions} LibraryQueryParams
 */

/**
 * @typedef {Request<{ Query: LibraryQueryParams }>} RequestFormsLibrary
 */

/**
 * @import { Request } from '@hapi/hapi'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { PaginationOptions, SearchOptions } from '@defra/forms-model'
 */
