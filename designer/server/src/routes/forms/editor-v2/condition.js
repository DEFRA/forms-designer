import { randomUUID } from 'crypto'

import { OperatorName, getConditionV2, slugSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import qs from 'qs'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  addErrorsToSession,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import { redirectWithAnchorOrUrl } from '~/src/lib/redirect-helper.js'
import {
  createConditionSessionState,
  getConditionSessionState,
  setConditionSessionState
} from '~/src/lib/session-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/condition.js'
import { editorFormPath } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_PATH_CONDITION = `/library/{slug}/editor-v2/condition/{conditionId}/{stateId?}`
export const ROUTE_PATH_CONDITION_SET_COMPONENT_ID = `/library/{slug}/editor-v2/condition/{conditionId}/{stateId}/set-component`
export const ROUTE_PATH_CONDITION_SET_OPERATOR = `/library/{slug}/editor-v2/condition/{conditionId}/{stateId}/set-operator`

const errorKey = sessionNames.validationFailure.editorPage
const notificationKey = sessionNames.successNotification

const idSchema = Joi.string().required() //  .uuid().valid('new').required()
const stateIdSchema = Joi.string().optional()
const operatorSchema = Joi.string()
  .valid(...Object.values(OperatorName))
  .required()

export const addConditionSchema = Joi.object()
  .keys({
    componentId: idSchema.messages({
      '*': 'Select a question'
    }),
    operator: operatorSchema.messages({
      '*': 'Select a condition type'
    }),
    value: Joi.string().required().messages({
      '*': 'Select a value'
    }),
    addCondition: Joi.boolean().optional()
  })
  .options({ stripUnknown: true })

export const schema = addConditionSchema.concat(
  Joi.object().keys({
    displayName: Joi.string().required().messages({
      '*': 'Enter condition name'
    })
  })
)

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
 * @param {ConditionSessionState} sessionState
 * @param {{ componentId: string, operator: OperatorName, value: ConditionListItemRefValueDataV2 | ConditionStringValueDataV2 | RelativeDateValueData }} payload
 * @param {string} displayName
 */
export function applyConditionStateChange(sessionState, payload, displayName) {
  const conditionIdx = 0
  // TODO - find condition for update based on id

  // TODO - handle type ConditionRefDataV2
  if (sessionState.conditionWrapper) {
    sessionState.conditionWrapper.displayName = displayName
    sessionState.conditionWrapper.items[conditionIdx] =
      /** @type {ConditionDataV2} */ ({
        ...sessionState.conditionWrapper.items[conditionIdx],
        ...payload
      })
  } else {
    sessionState.conditionWrapper = {
      id: randomUUID(),
      displayName,
      items: [
        {
          id: randomUUID(),
          ...payload
        }
      ]
    }
  }
  return sessionState
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
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string, stateId: string }, Payload: { componentId?: string, operator?: string, displayName?: string, addCondition?: boolean } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CONDITION,
    handler(request, h) {
      const { payload, params, yar } = request
      const { slug, conditionId, stateId } = params
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { componentId, operator, displayName, addCondition } = payload

      const payloadAsQueryStringArray = Object.entries(payload).map(
        ([key, value]) => {
          return `${key}=${value}`
        }
      )

      const payloadAsQueryString = payloadAsQueryStringArray.join('&')

      const parsed = qs.parse(payloadAsQueryString)

      if (parsed.addCondition) {
        parsed.items.push(
          /** @type {ConditionDataV2} */ ({
            id: randomUUID()
          })
        )
        delete parsed.addCondition
      }

      if (addCondition) {
        const state = getConditionSessionState(yar, stateId)
        const newState = {
          ...state,
          conditionWrapper: {
            ...state?.conditionWrapper,
            conditions: parsed.conditions
          }
        }
        setConditionSessionState(yar, stateId, newState)
      }

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(editorFormPath(slug, `condition/${conditionId}/${stateId}`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      // validate: {
      //   payload: addConditionSchema,
      //   failAction: (request, h, error) => {
      //     return redirectWithErrors(request, h, error, errorKey)
      //   }
      // },
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
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId: string, stateId: string }, Payload: { componentId: string, displayName: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CONDITION_SET_COMPONENT_ID,
    handler(request, h) {
      const { payload, params, yar } = request
      const { slug, conditionId, stateId } = params
      const { componentId, displayName } = payload

      const sessionState = getConditionSessionState(yar, stateId) ?? {}

      const newState = applyConditionStateChange(
        sessionState,
        { componentId },
        displayName
      )

      setConditionSessionState(yar, stateId, newState)

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(editorFormPath(slug, `condition/${conditionId}/${stateId}`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object()
          .keys({
            componentId: schema.extract('componentId'),
            confirmSelectComponent: Joi.boolean().required().allow(true),
            displayName: schema.extract('displayName').optional().allow('')
          })
          .options({ stripUnknown: true }),
        failAction: (request, h, error) => {
          const { params } = request
          const { slug, conditionId, stateId } = params
          addErrorsToSession(request, error, errorKey)

          return h
            .redirect(
              editorFormPath(slug, `condition/${conditionId}/${stateId}`)
            )
            .code(StatusCodes.SEE_OTHER)
            .takeover()
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
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId?: string, stateId: string }, Payload: { operator: string, displayName: string }, Query: { componentId: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CONDITION_SET_OPERATOR,
    handler(request, h) {
      const { payload, params, yar } = request
      const { slug, conditionId, stateId } = params
      const { operator, displayName } = payload

      const sessionState = getConditionSessionState(yar, stateId) ?? {}

      const newState = applyConditionStateChange(
        sessionState,
        { operator },
        displayName
      )

      setConditionSessionState(yar, stateId, newState)

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(editorFormPath(slug, `condition/${conditionId}/${stateId}`))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object()
          .keys({
            operator: schema.extract('operator'),
            confirmSelectOperator: Joi.boolean().required().allow(true),
            displayName: schema.extract('displayName').optional().allow('')
          })
          .options({ stripUnknown: true }),
        failAction: (request, h, error) => {
          const { params } = request
          const { slug, conditionId, stateId } = params

          addErrorsToSession(request, error, errorKey)

          return h
            .redirect(
              editorFormPath(slug, `condition/${conditionId}/${stateId}`)
            )
            .code(StatusCodes.SEE_OTHER)
            .takeover()
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
 * @import { ConditionDataV2, ConditionListItemRefValueDataV2, ConditionSessionState, ConditionStringValueDataV2, ConditionWrapperV2, RelativeDateValueData, FormDefinition } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
