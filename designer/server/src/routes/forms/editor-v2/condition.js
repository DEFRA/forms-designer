import { randomUUID } from 'crypto'
import Stream from 'node:stream'

import {
  conditionDataSchemaV2,
  conditionWrapperSchemaV2,
  getConditionV2,
  slugSchema
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { addCondition } from '~/src/lib/editor.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import {
  redirectWithAnchorOrUrl,
  redirectWithErrors
} from '~/src/lib/redirect-helper.js'
import {
  createConditionSessionState,
  getConditionSessionState,
  setConditionSessionState
} from '~/src/lib/session-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/condition.js'
import { editorFormPath } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_PATH_CONDITION = `/library/{slug}/editor-v2/condition/{conditionId}/{stateId?}`

const errorKey = sessionNames.validationFailure.editorPage
const notificationKey = sessionNames.successNotification

const idSchema = Joi.string().uuid().allow('new').required()
const stateIdSchema = Joi.string().optional()

// Custom condition wrapper payload schema that
// only allows conditions, not condition references
const conditionWrapperSchema = conditionWrapperSchemaV2.keys({
  displayName: conditionWrapperSchemaV2.extract('displayName').messages({
    'string.empty': 'Enter condition name'
  }),
  coordinator: conditionWrapperSchemaV2.extract('coordinator').messages({
    'any.required': 'Choose how you want to combine conditions'
  }),
  items: Joi.array()
    .items(
      conditionDataSchemaV2.keys({
        componentId: conditionDataSchemaV2.extract('componentId').messages({
          'string.empty': 'Select a question for condition {{../key}}'
        })
      })
    )
    .description('Array of conditions')
})

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {FormDefinition} definition
 * @param {string} conditionId
 * @returns {ConditionSessionState}
 */
export function buildSessionState(yar, stateId, definition, conditionId) {
  const state = getConditionSessionState(yar, stateId)
  if (!state?.id) {
    const newState = {
      id: conditionId,
      stateId,
      conditionWrapper:
        conditionId && conditionId !== 'new'
          ? getConditionV2(definition, conditionId)
          : /** @type {ConditionWrapperV2} */ ({
              id: randomUUID(),
              items: [{ id: randomUUID() }]
            })
    }
    setConditionSessionState(yar, stateId, newState)
    return newState
  }
  return state
}

/**
 * @param {Yar} yar
 * @param {ConditionWrapperPayload} payload
 * @param {string} stateId
 * @param {Partial<ConditionDataV2>[]} items
 */
export function saveSessionState(yar, payload, stateId, items) {
  const { coordinator, displayName } = payload
  const state = getConditionSessionState(yar, stateId)
  const newState = {
    ...state,
    conditionWrapper: {
      ...state?.conditionWrapper,
      items,
      displayName,
      coordinator
    }
  }

  // @ts-expect-error - dynamic parse so enforcing type is problematic
  setConditionSessionState(yar, stateId, newState)
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string, stateId?: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_CONDITION,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug, conditionId, stateId } = params

      // Set up session if not yet exists
      if (!stateId || !getConditionSessionState(yar, stateId)) {
        const newStateId = createConditionSessionState(yar)
        return redirectWithAnchorOrUrl(
          h,
          slug,
          conditionId,
          '',
          newStateId,
          '',
          `condition/${conditionId}/${newStateId}`
        )
      }

      // Get form metadata and definition
      const { metadata, definition } = await getForm(slug, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      const sessionState = buildSessionState(
        yar,
        stateId,
        definition,
        conditionId
      )

      return h.view(
        'forms/editor-v2/condition',
        viewModel.conditionViewModel(
          metadata,
          definition,
          sessionState,
          notification,
          validation
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
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string, stateId: string }, Payload: ConditionWrapperV2 }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CONDITION,
    async handler(request, h) {
      const { auth, params, payload } = request
      const { slug } = params
      const { token } = auth.credentials

      const metadata = await forms.get(slug, token)

      await addCondition(metadata.id, token, payload)

      // Redirect to conditions list page
      return h
        .redirect(editorFormPath(slug, `conditions`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: conditionWrapperSchema.append({
          action: Joi.string()
            .valid(
              'addCondition',
              'confirmSelectComponentId',
              'confirmSelectOperator'
            )
            .optional(),
          removeAction: Joi.number().integer().optional()
        }),
        failAction: (request, h, error) => {
          // Guard for type safety
          if (
            typeof request.payload !== 'object' ||
            request.payload instanceof Stream ||
            Buffer.isBuffer(request.payload)
          ) {
            throw Boom.badRequest(
              'Unexpected payload data in conditions fail action'
            )
          }

          /**
           *  @type {ConditionWrapperPayload}
           */
          const payload = request.payload
          const { params, yar } = request
          const { slug, conditionId, stateId } = params
          const { items = [] } = payload

          if (payload.action || payload.removeAction) {
            if (payload.action === 'addCondition') {
              items.push({ id: randomUUID() })
            } else if (payload.removeAction) {
              items.splice(Number(payload.removeAction), 1)
            }

            saveSessionState(yar, payload, stateId, items)

            // Redirect POST to GET without resubmit on back button
            return h
              .redirect(
                editorFormPath(slug, `condition/${conditionId}/${stateId}`)
              )
              .code(StatusCodes.SEE_OTHER)
              .takeover()
          } else {
            saveSessionState(yar, payload, stateId, items)

            // Filter out unwanted schema errors
            if (Joi.isError(error)) {
              error.details = error.details.filter((err) => {
                return err.type !== 'array.includesRequiredUnknowns'
              })
            }

            return redirectWithErrors(request, h, error, errorKey)
          }
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
 * @typedef {Partial<Omit<ConditionWrapperV2, 'items'>> & { action?: string, removeAction?: string, items?: Partial<ConditionDataV2>[] }} ConditionWrapperPayload
 */

/**
 * @import { ConditionDataV2, ConditionSessionState, ConditionWrapperV2, FormDefinition } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
