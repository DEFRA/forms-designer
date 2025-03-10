import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'
import {
  excludeEndPages,
  getFocus,
  repositionPage
} from '~/src/models/forms/editor-v2/pages-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/pages-reorder.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_REORDER_PAGES =
  '/library/{slug}/editor-v2/pages-reorder'

const reorderPagesKey = sessionNames.reorderPages

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_REORDER_PAGES,
    async handler(request, h) {
      const { params, auth, yar, query } = request
      const { token } = auth.credentials
      const { slug } = params
      const { focus } = /** @type {{focus: string}} */ (query)

      const focusObj = getFocus(focus)

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      // Page reorder
      const pageOrder =
        getFlashFromSession(yar, reorderPagesKey) ??
        excludeEndPages(definition.pages)
          .map((x) => `${x.id}`)
          .join(',')

      return h.view(
        'forms/editor-v2/pages-reorder',
        viewModel.pagesReorderViewModel(
          metadata,
          definition,
          pageOrder,
          focusObj
        )
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
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormEditorInputPage, 'movement' | 'pageOrder'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_REORDER_PAGES,
    handler(request, h) {
      const { params, payload, yar } = request
      const { slug } = params
      const { movement, pageOrder } =
        /** @type {{ movement: string, pageOrder: string}} */ (payload)

      const [direction, pageId] = movement.split('|')

      const newPageOrder = repositionPage(pageOrder, direction, pageId)
      setFlashInSession(yar, reorderPagesKey, newPageOrder)

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(editorv2Path(slug, `pages-reorder?focus=${movement}`))
        .code(StatusCodes.SEE_OTHER)
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
 * @import { FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
