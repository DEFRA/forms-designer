import { randomUUID } from 'node:crypto'

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

const PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR = '#payment-conditional-amounts'
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
 * @returns {string}
 */
export function handleSaveConditionalAmount(request, stateId) {
  const { yar, payload } = request
  const state = getQuestionSessionState(yar, stateId) ?? {}
  const editRow = state.conditionalAmountEditRow ?? {
    expanded: true,
    id: '',
    amount: '',
    condition: ''
  }
  const items = state.conditionalAmounts ?? []
  const labelIndex = editRow.id
    ? Math.max(items.findIndex((i) => i.id === editRow.id) + 1, 1)
    : items.length + 1

  const candidate = {
    amount: payload.conditionalAmount,
    condition: payload.conditionalAmountCondition
  }

  const { error, value } = paymentConditionalAmountSchema.validate(candidate, {
    abortEarly: false
  })

  if (error) {
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
      remapConditionalAmountErrors(error, labelIndex)
    )
    return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
  }

  const id =
    typeof editRow.id === 'string' && editRow.id !== ''
      ? editRow.id
      : randomUUID()
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
  const state = getQuestionSessionState(yar, stateId) ?? {}
  const items = state.conditionalAmounts ?? []
  if (!id) {
    return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
  }
  setQuestionSessionState(yar, stateId, {
    ...state,
    conditionalAmounts: removeConditionalAmountById(items, id)
  })
  return PAYMENT_CONDITIONAL_AMOUNTS_ANCHOR
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
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 * @import { Request } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
