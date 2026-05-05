import { randomUUID } from 'node:crypto'

import { isConditionWrapperV2 } from '@defra/forms-model'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import {
  removeConditionalAmountById,
  setConditionalAmountEditState,
  upsertConditionalAmount
} from '~/src/lib/payment-conditional-amount-helpers.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { paymentConditionalAmountSchema } from '~/src/models/forms/editor-v2/base-settings-fields.js'

export const PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR = '#payment-conditional-amounts'
const errorKey = sessionNames.validationFailure.editorQuestionDetails

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @returns {string}
 */
export function handleAddConditionalAmount(yar, stateId) {
  const state = getQuestionSessionState(yar, stateId) ?? {}
  setQuestionSessionState(yar, stateId, {
    ...state,
    conditionalAmountEditRow: setConditionalAmountEditState(undefined, true)
  })
  return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
}

/**
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {string} stateId
 * @param {FormDefinition} [definition]
 * @returns {string}
 */
export function handleSaveConditionalAmount(request, stateId, definition) {
  const { yar, payload } = request
  const state = getQuestionSessionState(yar, stateId) ?? {}
  const editRow = state.conditionalAmountEditRow ?? {
    expanded: true,
    id: '',
    amount: '',
    condition: ''
  }
  const items = state.conditionalAmounts ?? []
  const matchedIndex =
    typeof editRow.id === 'string' && editRow.id !== ''
      ? items.findIndex((i) => i.id === editRow.id)
      : -1
  const treatAsNew = matchedIndex === -1
  const labelIndex = treatAsNew ? items.length + 1 : matchedIndex + 1

  const candidate = {
    amount: payload.conditionalAmount,
    condition: payload.conditionalAmountCondition
  }

  const { error, value } = paymentConditionalAmountSchema.validate(candidate, {
    abortEarly: false
  })

  const semanticError = error
    ? null
    : buildSemanticConditionError(value, items, editRow, definition)

  const finalError = error ?? semanticError

  if (finalError) {
    setQuestionSessionState(yar, stateId, {
      ...state,
      conditionalAmountEditRow: {
        ...editRow,
        amount: candidate.amount,
        condition: candidate.condition
      }
    })
    addErrorsToSession(
      request,
      errorKey,
      remapConditionalAmountErrors(finalError, labelIndex)
    )
    return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
  }

  const id = treatAsNew ? randomUUID() : /** @type {string} */ (editRow.id)
  const next = upsertConditionalAmount(items, {
    id,
    amount: value.amount,
    condition: value.condition
  })

  setQuestionSessionState(yar, stateId, {
    ...state,
    conditionalAmounts: next,
    conditionalAmountEditRow: setConditionalAmountEditState(undefined, false)
  })
  return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
}

/**
 * @param {{ amount: number, condition: string }} value
 * @param {ConditionalAmountState[]} items
 * @param {ConditionalAmountEditRow} editRow
 * @param {FormDefinition | undefined} definition
 * @returns {Joi.ValidationError | null}
 */
function buildSemanticConditionError(value, items, editRow, definition) {
  if (!definition) {
    return null
  }
  const validIds = new Set(
    definition.conditions
      .filter(isConditionWrapperV2)
      .map((c) => /** @type {string} */ (c.id))
  )
  if (!validIds.has(value.condition)) {
    return buildConditionError('Select an existing condition')
  }
  const editingId = typeof editRow.id === 'string' ? editRow.id : ''
  const duplicate = items.some(
    (item) => item.id !== editingId && item.condition === value.condition
  )
  if (duplicate) {
    return buildConditionError(
      'You already have a payment amount for this condition'
    )
  }
  return null
}

/**
 * @param {string} message
 * @returns {Joi.ValidationError}
 */
function buildConditionError(message) {
  return new Joi.ValidationError(
    message,
    [
      {
        message,
        path: ['condition'],
        type: 'any.invalid',
        context: { key: 'condition', label: 'condition' }
      }
    ],
    null
  )
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {string | undefined} id
 * @returns {string}
 */
export function handleEditConditionalAmount(yar, stateId, id) {
  const state = getQuestionSessionState(yar, stateId) ?? {}
  const item = (state.conditionalAmounts ?? []).find((i) => i.id === id)
  if (!item) {
    return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
  }
  setQuestionSessionState(yar, stateId, {
    ...state,
    conditionalAmountEditRow: setConditionalAmountEditState(item, true)
  })
  return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @returns {string}
 */
export function handleCancelConditionalAmount(yar, stateId) {
  const state = getQuestionSessionState(yar, stateId) ?? {}
  setQuestionSessionState(yar, stateId, {
    ...state,
    conditionalAmountEditRow: setConditionalAmountEditState(undefined, false)
  })
  return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {string | undefined} id
 * @returns {string}
 */
export function handleRemoveConditionalAmount(yar, stateId, id) {
  if (!id) {
    return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
  }
  const state = getQuestionSessionState(yar, stateId) ?? {}
  const items = state.conditionalAmounts ?? []
  if (!items.some((item) => item.id === id)) {
    return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
  }
  setQuestionSessionState(yar, stateId, {
    ...state,
    conditionalAmounts: removeConditionalAmountById(items, id)
  })
  return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
}

/**
 * If the inline conditional-amount edit row is open, copy the user-typed values
 * from the request payload into `state.conditionalAmountEditRow`. Used in the
 * route's failAction so that base-field validation errors don't wipe what the
 * user typed in the inline form before re-render.
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {string} stateId
 */
export function persistInlineConditionalAmountDraft(request, stateId) {
  const { yar, payload } = request
  const state = getQuestionSessionState(yar, stateId) ?? {}
  const editRow = state.conditionalAmountEditRow
  if (!editRow?.expanded) {
    return
  }
  setQuestionSessionState(yar, stateId, {
    ...state,
    conditionalAmountEditRow: {
      ...editRow,
      amount: payload.conditionalAmount,
      condition: payload.conditionalAmountCondition
    }
  })
}

/**
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {string} stateId
 * @param {FormDefinition} [definition]
 * @returns {Joi.ValidationError | null}
 */
export function buildInlineConditionalAmountError(
  request,
  stateId,
  definition
) {
  const { yar, payload } = request
  const state = getQuestionSessionState(yar, stateId) ?? {}
  if (!state.conditionalAmountEditRow?.expanded) {
    return null
  }
  const items = state.conditionalAmounts ?? []
  const editRow = state.conditionalAmountEditRow
  const matchedIndex =
    typeof editRow.id === 'string' && editRow.id !== ''
      ? items.findIndex((i) => i.id === editRow.id)
      : -1
  const labelIndex = matchedIndex === -1 ? items.length + 1 : matchedIndex + 1
  const candidate = {
    amount: payload.conditionalAmount,
    condition: payload.conditionalAmountCondition
  }
  const { error, value } = paymentConditionalAmountSchema.validate(candidate, {
    abortEarly: false
  })
  const semanticError = error
    ? null
    : buildSemanticConditionError(value, items, editRow, definition)
  const finalError = error ?? semanticError
  if (!finalError) {
    return null
  }
  return remapConditionalAmountErrors(finalError, labelIndex)
}

/**
 * Remap Joi error details so they land on the editor's UI input ids
 * (#conditionalAmount / #conditionalAmountCondition) and so the amount
 * 'required' message carries the dynamic tile index.
 * @param {Joi.ValidationError} error
 * @param {number} labelIndex
 * @returns {Joi.ValidationError}
 */
function remapConditionalAmountErrors(error, labelIndex) {
  const SCHEMA_KEY_TO_FIELD = {
    amount: 'conditionalAmount',
    condition: 'conditionalAmountCondition'
  }
  const remapped = error.details.map((detail) => {
    const schemaKey = String(detail.path[0])
    const mappedKey =
      schemaKey in SCHEMA_KEY_TO_FIELD
        ? SCHEMA_KEY_TO_FIELD[
            /** @type {keyof typeof SCHEMA_KEY_TO_FIELD} */ (schemaKey)
          ]
        : undefined
    const fieldName = mappedKey ?? schemaKey
    const isAmountRequired =
      schemaKey === 'amount' &&
      detail.message.startsWith('Enter payment amount')
    return {
      ...detail,
      path: [fieldName],
      message: isAmountRequired
        ? `Enter payment amount ${labelIndex}`
        : detail.message,
      context: {
        ...(detail.context ?? {}),
        key: fieldName,
        label: fieldName
      }
    }
  })
  return new Joi.ValidationError(error.message, remapped, error._original)
}

/**
 * @import { ConditionalAmountEditRow, ConditionalAmountState, FormDefinition, FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import { Request } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
