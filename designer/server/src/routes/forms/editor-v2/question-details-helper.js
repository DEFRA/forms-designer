import { randomUUID } from 'crypto'

import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'

const radiosSectionListItemsAnchor = '#list-items'

/**
 * @param { { id?: string, label?: string, hint?: string, value?: string } | undefined } itemForEdit
 * @param {boolean} expanded
 */
export function setEditRowState(itemForEdit, expanded) {
  return {
    radioId: itemForEdit?.id ?? '',
    radioLabel: itemForEdit?.label ?? '',
    radioHint: itemForEdit?.hint ?? '',
    radioValue: itemForEdit?.value ?? '',
    expanded
  }
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {RequestQuery} query
 * @returns { string | undefined }
 */
export function handleEnhancedActionOnGet(yar, stateId, query) {
  const { action, id } = query
  if (!action) {
    return undefined
  }

  const state = getQuestionSessionState(yar, stateId)
  if (!state?.questionType) {
    throw new Error('Invalid session contents')
  }

  if (action === 'delete') {
    const newList = state.listItems?.filter((x) => x.id !== id)
    setQuestionSessionState(yar, stateId, {
      ...state,
      listItems: newList
    })
    return radiosSectionListItemsAnchor
  }

  if (action === 'edit') {
    const itemForEdit = state.listItems?.find((x) => x.id === id)

    setQuestionSessionState(yar, stateId, {
      ...state,
      editRow: setEditRowState(itemForEdit, true)
    })
    return '#add-option-form'
  }

  if (action === 'cancel') {
    setQuestionSessionState(yar, stateId, {
      ...state,
      editRow: setEditRowState(undefined, false)
    })
    return radiosSectionListItemsAnchor
  }

  return undefined
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {FormEditorInputQuestionDetails} payload
 * @param {Partial<ComponentDef>} questionDetails
 * @returns { string | undefined }
 */
export function handleEnhancedActionOnPost(
  yar,
  stateId,
  payload,
  questionDetails
) {
  const { enhancedAction } = payload

  if (!enhancedAction) {
    return undefined
  }

  const preState = getQuestionSessionState(yar, stateId)
  if (!preState?.questionType) {
    throw new Error('Invalid session contents')
  }

  const state = /** @type {QuestionSessionState} */ ({
    questionType: preState.questionType,
    questionDetails,
    editRow: {
      radioId: payload.radioId,
      radioLabel: payload.radioLabel,
      radioHint: payload.radioHint,
      radioValue: payload.radioValue,
      expanded: true
    },
    listItems: preState.listItems ?? []
  })
  if (enhancedAction === 'add-item') {
    setQuestionSessionState(yar, stateId, state)
    return '#add-option'
  }
  if (enhancedAction === 'save-item') {
    const foundRow = state.listItems?.find((x) => x.id === payload.radioId)
    if (foundRow) {
      // Update
      foundRow.label = payload.radioLabel
      foundRow.hint = payload.radioHint
      foundRow.value = payload.radioValue
    } else {
      // Insert
      state.listItems?.push({
        label: payload.radioLabel,
        hint: payload.radioHint,
        value: payload.radioValue,
        id: randomUUID()
      })
    }

    setQuestionSessionState(yar, stateId, {
      ...state,
      editRow: setEditRowState(undefined, false)
    })
    return radiosSectionListItemsAnchor
  }
  return undefined
}

/**
 * @import { ComponentDef,  FormEditorInputQuestionDetails, QuestionSessionState, FormDefinition, ListComponentsDef } from '@defra/forms-model'
 * @import { RequestQuery } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
