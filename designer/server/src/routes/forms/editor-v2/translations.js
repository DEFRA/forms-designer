import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { translationsViewModel } from '~/src/models/forms/editor-v2/translations.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_PAGE = `/library/{slug}/editor-v2/welsh`

const errorKey = sessionNames.validationFailure.editorPage

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageNum: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const model = translationsViewModel(metadata, definition, validation)

      return h.view('forms/editor-v2/translations', model)
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string | undefined }, Payload: Pick<FormEditorInputPage, 'pageType'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE,
    handler(request, h) {
      const { params } = request
      const { slug } = params

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(editorv2Path(slug,'pages'))
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
 * @import { FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
