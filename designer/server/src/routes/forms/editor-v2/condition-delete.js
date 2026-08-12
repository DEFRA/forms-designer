import { FormDefinitionError, Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { findConditionReferences } from '~/src/lib/condition-references.js'
import { deleteCondition } from '~/src/lib/editor.js'
import { isInvalidFormErrorType } from '~/src/lib/error-boom-helper.js'
import * as forms from '~/src/lib/forms.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/condition-delete.js'
import { editorFormPath } from '~/src/models/links.js'

const ROUTE_FULL_PATH = `/library/{slug}/editor-v2/condition/{conditionId}/delete`
const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, conditionId } = params

      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        viewModel.deleteConditionConfirmationPageViewModel(
          metadata,
          definition,
          conditionId
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
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, conditionId } = params

      const metadata = await forms.get(slug, token)
      const formId = metadata.id

      try {
        const definition = await forms.getDraftFormDefinition(formId, token)
        const references = findConditionReferences(definition, conditionId)

        // The confirmation page offers no delete button in this state, so this
        // only catches a definition that changed since it was rendered
        if (viewModel.getDeletionBlockedMessage(references)) {
          return h.view(
            CONFIRMATION_PAGE_VIEW,
            viewModel.deleteConditionConfirmationPageViewModel(
              metadata,
              definition,
              conditionId
            )
          )
        }

        const { outputs } = references

        // The author was warned these email actions go with the condition. They
        // are removed first because the definition schema rejects an output
        // pointing at a condition that no longer exists.
        if (outputs.length > 0) {
          const removedIndexes = new Set(outputs.map((output) => output.index))

          definition.outputs = (definition.outputs ?? []).filter(
            (_output, index) => !removedIndexes.has(index)
          )

          await forms.updateDraftFormDefinition(formId, definition, token)
        }

        await deleteCondition(formId, token, conditionId)

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        return h
          .redirect(editorFormPath(slug, 'conditions'))
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        if (
          isInvalidFormErrorType(
            err,
            FormDefinitionError.RefConditionConditionId
          )
        ) {
          // Race condition backstop - if the form was updated in forms-manager whilst this
          // function was running.
          const definition = await forms.getDraftFormDefinition(formId, token)

          return h.view(
            CONFIRMATION_PAGE_VIEW,
            viewModel.deleteConditionConfirmationPageViewModel(
              metadata,
              definition,
              conditionId,
              viewModel.CONDITION_REFERENCE_MESSAGE
            )
          )
        }

        throw err
      }
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
 * @import { ServerRoute } from '@hapi/hapi'
 */
