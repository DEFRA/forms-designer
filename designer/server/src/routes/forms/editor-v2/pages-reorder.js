import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { reorderPages } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
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

/**
 * @param {string|undefined} value
 * @returns {string[]}
 */
const customItemOrder = (value) => {
  if (value?.length) {
    return value.split(',')
  }

  return []
}

export const itemOrderSchema = Joi.object()
  .keys({
    saveChanges: Joi.boolean().default(false).optional(),
    movement: Joi.string().optional(),
    itemOrder: Joi.any().custom(customItemOrder)
  })
  .required()

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

      // Form metadata and page components
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormEditorInputPage, 'movement' | 'itemOrder'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_REORDER_PAGES,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { slug } = params
      const { movement, itemOrder, saveChanges } =
        /** @type {{ movement: string, itemOrder: string[], saveChanges: boolean}} */ (
          payload
        )

      if (saveChanges) {
        const { token } = auth.credentials
        const metadata = await forms.get(slug, token)

        if (itemOrder.length > 0) {
          await reorderPages(metadata.id, token, itemOrder)
        }
        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)
        yar.clear(reorderPagesKey)

        return h
          .redirect(editorv2Path(slug, 'pages'))
          .code(StatusCodes.SEE_OTHER)
          .takeover()
      }

      if (movement) {
        const [direction, pageId] = movement.split('|')

        const newPageOrder = repositionPage(itemOrder, direction, pageId).join(
          ','
        )

        setFlashInSession(yar, reorderPagesKey, newPageOrder)

        return h
          .redirect(editorv2Path(slug, `pages-reorder?focus=${movement}`))
          .code(StatusCodes.SEE_OTHER)
      }

      return h
        .redirect(editorv2Path(slug, `pages-reorder`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: itemOrderSchema
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
 * @import { FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
