import { FormDefinitionError } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { updateCondition } from '~/src/lib/editor.js'
import {
  createJoiError,
  isInvalidFormErrorType
} from '~/src/lib/error-boom-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { getConditionSessionState } from '~/src/lib/session-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/condition-check-changes.js'
import { editorFormPath } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

const ROUTE_PATH_CONDITION_CHANGES = `/library/{slug}/editor-v2/condition-check-changes/{conditionId}/{stateId?}`
const errorKey = sessionNames.validationFailure.editorCondition

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string, stateId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_CONDITION_CHANGES,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, conditionId, stateId } = params

      // Get form metadata and definition
      const { metadata, definition } = await getForm(slug, token)

      const originalCondition = /** @type {ConditionWrapperV2} */ (
        definition.conditions.find((x) =>
          'id' in x ? x.id === conditionId : undefined
        )
      )

      const state = getConditionSessionState(yar, stateId)

      return h.view(
        'forms/editor-v2/condition-check-changes',
        viewModel.conditionCheckChangesViewModel(
          metadata,
          definition,
          originalCondition,
          state,
          conditionId
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
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string, stateId: string }, Payload: ConditionWrapperV2 }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CONDITION_CHANGES,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug, conditionId, stateId } = params
      const { token } = auth.credentials

      const metadata = await forms.get(slug, token)

      try {
        const state = getConditionSessionState(yar, stateId)

        payload.id = conditionId
        await updateCondition(
          metadata.id,
          token,
          state?.conditionWrapper ?? /** @type {ConditionWrapperV2} */ ({})
        )

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        // Redirect to conditions list page
        return h
          .redirect(editorFormPath(slug, `conditions`))
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        if (
          isInvalidFormErrorType(
            err,
            FormDefinitionError.UniqueConditionDisplayName
          )
        ) {
          const joiErr = createJoiError(
            'displayName',
            'Duplicate condition name'
          )

          return redirectWithErrors(request, h, joiErr, errorKey, '#')
        }

        throw err
      }
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
 * @typedef {Partial<Omit<ConditionWrapperV2, 'items'>> & { action?: string, removeAction?: string, items?: Partial<ConditionDataV2>[] }} ConditionWrapperPayload
 */

/**
 * @import { ConditionDataV2, ConditionWrapperV2 } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
