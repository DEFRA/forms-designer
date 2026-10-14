import { Scopes, isSummaryPage } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { reorderSections } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import {
  getFocus,
  repositionItem
} from '~/src/models/forms/editor-v2/pages-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/sections-reorder.js'
import { editorv2Path } from '~/src/models/links.js'
import { itemOrderSchema } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_FULL_PATH_REORDER_SECTIONS =
  '/library/{slug}/editor-v2/sections-reorder'

const reorderSectionsKey = sessionNames.reorderSections

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_REORDER_SECTIONS,
    async handler(request, h) {
      const { params, auth, yar, query } = request
      const { token } = auth.credentials
      const { slug } = params
      const { focus } = /** @type {{focus: string}} */ (query)

      const focusObj = getFocus(focus)

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      // Section reorder
      const sectionOrder =
        getFlashFromSession(yar, reorderSectionsKey) ??
        definition.sections.map((x) => `${x.id}`).join(',')

      return h.view(
        'forms/editor-v2/sections-reorder',
        viewModel.sectionsReorderViewModel(
          metadata,
          definition,
          sectionOrder,
          focusObj
        )
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
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: Pick<FormEditorInputPage, 'movement' | 'itemOrder'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_REORDER_SECTIONS,
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
        const definition = await forms.getDraftFormDefinition(
          metadata.id,
          token
        )

        if (itemOrder.length > 0) {
          await reorderSections(metadata.id, token, itemOrder)
        }
        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)
        yar.clear(reorderSectionsKey)

        const cyaPage = definition.pages.find(isSummaryPage)
        return h
          .redirect(
            editorv2Path(
              slug,
              `page/${cyaPage?.id}/check-answers-settings/sections`
            )
          )
          .code(StatusCodes.SEE_OTHER)
          .takeover()
      }

      if (movement) {
        const [direction, sectionId] = movement.split('|')

        const newSectionOrder = repositionItem(
          itemOrder,
          direction,
          sectionId
        ).join(',')

        setFlashInSession(yar, reorderSectionsKey, newSectionOrder)

        return h
          .redirect(editorv2Path(slug, `sections-reorder?focus=${movement}`))
          .code(StatusCodes.SEE_OTHER)
      }

      return h
        .redirect(editorv2Path(slug, `sections-reorder`))
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
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  })
]

/**
 * @import { FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
