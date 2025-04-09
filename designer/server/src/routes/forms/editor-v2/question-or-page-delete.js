import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import { deletePage } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { getComponentsOnPageFromDefinition } from '~/src/lib/utils.js'
import * as viewModel from '~/src/models/forms/editor-v2/question-delete.js'
import { editorv2Path } from '~/src/models/links.js'

const ROUTE_FULL_PATH_PAGE = `/library/{slug}/editor-v2/page/{pageId}/delete/{questionId?}`
const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId?: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        viewModel.deleteQuestionConfirmationPageViewModel(
          metadata,
          definition,
          pageId,
          questionId
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId?: string }}>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, pageId, questionId } = params

      const metadata = await forms.get(slug, token)
      let deletePageOrQuestion = 'page'
      if (questionId) {
        // If only one (non-guidance question) on the page, 'deleting the question' becomes 'deleting the page'
        const definition = await forms.getDraftFormDefinition(
          metadata.id,
          token
        )
        const components = getComponentsOnPageFromDefinition(definition, pageId)
        const nonGuidanceComponents = components.filter(
          (comp, idx) => comp.type === ComponentType.Markdown && idx === 0
        )
        if (nonGuidanceComponents.length > 1) {
          deletePageOrQuestion = 'question'
        }
      }

      if (deletePageOrQuestion === 'question') {
        // await deleteQuestion(metadata.id, token, pageId, questionId)
      } else {
        await deletePage(metadata.id, token, pageId)
      }

      // Redirect POST to GET
      return h.redirect(editorv2Path(slug, 'pages')).code(StatusCodes.SEE_OTHER)
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
