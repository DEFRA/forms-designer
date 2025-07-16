import {
  FormDefinitionError,
  conditionWrapperSchemaV2,
  isConditionWrapperV2,
  slugSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { addCondition } from '~/src/lib/editor.js'
import {
  createJoiError,
  isInvalidFormErrorType
} from '~/src/lib/error-boom-helper.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  createConditionSessionState,
  setConditionSessionState
} from '~/src/lib/session-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/conditions-join.js'
import { editorFormPath } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_PATH = `/library/{slug}/editor-v2/conditions-join/{conditionId}`

const errorKey = sessionNames.validationFailure.editorCondition
const notificationKey = sessionNames.successNotification

const idSchema = Joi.string().uuid().allow('new').required()
const stateIdSchema = Joi.string().optional()

const conditionSchema = Joi.object({
  conditions: Joi.array().min(2).items(Joi.string()).required().messages({
    '*': 'Select at least 2 conditions to join'
  }),
  coordinator: conditionWrapperSchemaV2.extract('coordinator').messages({
    'any.required': 'Choose how you want to combine conditions'
  }),
  displayName: conditionWrapperSchemaV2.extract('displayName').messages({
    'string.empty': 'Enter condition name'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, conditionId } = params

      const { metadata, definition } = await getForm(slug, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      const existingCondition =
        conditionId !== 'new'
          ? definition.conditions
              .filter(isConditionWrapperV2)
              .find((c) => c.id === conditionId)
          : undefined

      return h.view(
        'forms/editor-v2/conditions-join',
        viewModel.conditionsJoinViewModel(
          metadata,
          definition,
          conditionId,
          existingCondition,
          validation,
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
          conditionId: idSchema.optional(),
          stateId: stateIdSchema
        })
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string }, Payload: JoinedConditionPayload }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH,
    async handler(request, h) {
      const { auth, params, payload, yar } = request
      const { slug, conditionId } = params
      const { token } = auth.credentials
      const { displayName, coordinator, conditions } = payload

      const metadata = await forms.get(slug, token)

      const data = /** @type {ConditionWrapperV2} */ ({
        id: conditionId === 'new' ? undefined : conditionId,
        displayName,
        coordinator,
        items: conditions.map((cond) => ({
          id: crypto.randomUUID(),
          conditionId: cond
        }))
      })

      try {
        if (conditionId === 'new') {
          await addCondition(metadata.id, token, data)
        } else {
          const stateId = createConditionSessionState(yar)

          const sessionState = {
            id: conditionId,
            stateId,
            conditionWrapper: data
          }

          setConditionSessionState(yar, stateId, sessionState)

          return h
            .redirect(
              editorFormPath(
                slug,
                `condition-check-changes/${conditionId}/${stateId}`
              )
            )
            .code(StatusCodes.SEE_OTHER)
        }

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

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
      validate: {
        payload: conditionSchema,
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
 * @typedef {{ displayName: string, coordinator: string, conditions: string[] }} JoinedConditionPayload
 */

/**
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
