import {
  getConditionV2,
  idSchema,
  isConditionWrapperV2,
  pageTypeSchema,
  slugSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/condition.js'
import { editorv2Path } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_FULL_PATH_CONDITION = `/library/{slug}/editor-v2/condition/{conditionId?}`

const errorKey = sessionNames.validationFailure.editorPage
const notificationKey = sessionNames.successNotification

export const schema = Joi.object().keys({
  componentId: pageTypeSchema.messages({
    '*': 'Select a question'
  }),
  operator: pageTypeSchema.messages({
    '*': 'Select a condition type'
  }),
  value: pageTypeSchema.messages({
    '*': 'Enter a value'
  }),
  displayName: pageTypeSchema.messages({
    '*': 'Enter a value'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId?: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CONDITION,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, conditionId } = params

      // Get form metadata and definition
      const { metadata, definition } = await getForm(slug, token)

      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      const condition = conditionId
        ? getConditionV2(definition, conditionId)
        : undefined

      return h.view(
        'forms/editor-v2/condition',
        viewModel.conditionViewModel(
          metadata,
          definition,
          condition,
          notification
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
      },
      validate: {
        params: Joi.object().keys({
          slug: slugSchema,
          conditionId: idSchema.optional()
        })
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string | undefined }, Payload: Pick<FormEditorInputPage, 'pageType'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_CONDITION,
    handler(request, h) {
      const { payload, params } = request
      const { slug, conditionId } = params
      const { pageType } = payload

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(
          editorv2Path(
            slug,
            `page/${conditionId ?? 'new'}/${pageType}/new${pageType === 'guidance' ? '' : '/type'}`
          )
        )
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
 * @import { FormEditorInputPage } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
