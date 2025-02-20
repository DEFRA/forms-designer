import { pageTypeSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import * as editor from '~/src/models/forms/editor-v2.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_PAGE = `/library/{slug}/editor-v2/page/{pageId?}`

const errorKey = sessionNames.validationFailure.editorPage

export const schema = Joi.object().keys({
  pageType: pageTypeSchema.messages({
    '*': 'Choose a Page Type'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageNum: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      // Form metadata, validation errors
      const metadata = await forms.get(slug, token)

      const validation = yar.flash(errorKey).at(0)

      return h.view(
        'forms/question-radios',
        editor.addPageViewModel(metadata, {}, validation)
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string | undefined }, Payload: Pick<FormEditorInput, 'pageType'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE,
    handler(request, h) {
      const { payload, params } = request
      const { slug, pageId } = params
      const { pageType } = payload

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(editorv2Path(slug, `page/${pageId ?? 'first'}/${pageType}`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
        }
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
 * @import { FormEditorInput } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
