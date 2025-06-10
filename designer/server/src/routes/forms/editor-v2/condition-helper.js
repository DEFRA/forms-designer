import { randomUUID } from 'crypto'

import { getConditionV2 } from '@defra/forms-model'
import Joi from 'joi'

import {
  getConditionSessionState,
  setConditionSessionState
} from '~/src/lib/session-helper.js'

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
 * @param {{ coordinator?: Coordinator, displayName?: string }} payload
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

/**
 * Process schema error messages to add a suffix to condition item errors
 * @param { Error | undefined } error
 */
export function processErrorMessages(error) {
  if (Joi.isError(error)) {
    error.details = error.details.filter((err) => {
      return err.type !== 'array.includesRequiredUnknowns'
    })

    error.details.forEach((err) => {
      if (err.path.length > 1) {
        // Must be that part of a condition item is in
        // error so we append a "for condition X" suffix
        const idx = err.path.at(1)
        if (typeof idx === 'number') {
          err.message = `${err.message} for condition ${idx + 1}`
        }
      }
    })
  }
}

/**
 * @import { Coordinator, ConditionDataV2, ConditionSessionState, ConditionWrapperV2, FormDefinition } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
