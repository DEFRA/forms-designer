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
  const isNew = conditionId && conditionId !== 'new'
  const foundCondition = isNew
    ? getConditionV2(definition, conditionId)
    : undefined
  if (!state?.id) {
    const newState = {
      id: conditionId,
      stateId,
      conditionWrapper: isNew
        ? foundCondition
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
    error.details.forEach((err) => {
      if (err.path.length > 1) {
        // Period, unit and direction need extra attention
        if (err.context?.key === 'period') {
          err.message = `${err.message} period`
        }
        if (err.context?.key === 'unit') {
          err.message = `${err.message} unit`
        }
        if (err.context?.key === 'direction') {
          err.message = `${err.message} direction`
        }

        // Must be that part of a condition item is in
        // error so we append a "for condition X" suffix
        const idx = err.path.at(1)
        if (typeof idx === 'number' && idx > 0) {
          err.message = `${err.message} for additional condition ${idx}`
        }
      }
    })
  }
}

/**
 * @import { Coordinator, ConditionDataV2, ConditionSessionState, ConditionWrapperV2, FormDefinition } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
