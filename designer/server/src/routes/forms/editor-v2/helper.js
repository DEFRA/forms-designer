import { randomUUID } from 'crypto'

import { sessionNames } from '~/src/common/constants/session-names.js'

/**
 * @param {Yar} yar
 * @param {FormEditor | undefined} formValues
 */
export function getQuestionType(yar, formValues) {
  const questionTypeFromSession = /** @type {ComponentType | undefined} */ (
    yar.flash(sessionNames.questionType).at(0)
  )

  return /** @type {ComponentType | undefined} */ (
    formValues?.questionType ?? questionTypeFromSession
  )
}

/**
 * @param {Yar} yar
 */
export function clearEnhancedActionState(yar) {
  yar.set(sessionNames.enhancedActionState, null)
}

/**
 * @param {Yar} yar
 */
export function getEnhancedActionStateFromSession(yar) {
  return yar.get(sessionNames.enhancedActionState)
}

/**
 * @param { { id?: string, label?: string, hint?: string, value?: string } | undefined } itemForEdit
 * @param {boolean} expanded
 */
export function setItemState(itemForEdit, expanded) {
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
 * @param {RequestQuery} query
 * @returns { string | undefined }
 */
export function handleEnhancedActionOnGet(yar, query) {
  const { action, id } = query
  if (!action) {
    return undefined
  }

  const state = yar.get(sessionNames.enhancedActionState) ?? {
    state: {},
    listItems: []
  }

  if (action === 'delete') {
    const newList = state.listItems.filter((x) => x.id !== id)
    yar.set(sessionNames.enhancedActionState, {
      ...state,
      listItems: newList
    })
    return '#list-items'
  }

  if (action === 'edit') {
    const itemForEdit = state.listItems.find((x) => x.id === id)
    yar.set(sessionNames.enhancedActionState, {
      ...state,
      state: setItemState(itemForEdit, true)
    })
    return '#add-option-form'
  }

  if (action === 'cancel') {
    yar.set(sessionNames.enhancedActionState, {
      ...state,
      state: setItemState(undefined, false)
    })
    return '#list-items'
  }

  return undefined
}

/**
 * @param {Yar} yar
 * @param {FormEditorInputQuestionDetails} payload
 * @param {Partial<ComponentDef>} questionDetails
 * @returns { string | undefined }
 */
export function handleEnhancedActionOnPost(yar, payload, questionDetails) {
  const { enhancedAction } = payload
  const preState = yar.get(sessionNames.enhancedActionState) ?? {
    state: {},
    listItems: []
  }
  const enhancedActionState = /** @type {EnhancedActionState} */ ({
    questionDetails,
    state: {
      radioId: payload.radioId,
      radioLabel: payload.radioLabel,
      radioHint: payload.radioHint,
      radioValue: payload.radioValue,
      expanded: true
    },
    listItems: preState.listItems
  })
  if (enhancedAction === 'add-item') {
    yar.set(sessionNames.enhancedActionState, enhancedActionState)
    return '#add-option'
  }
  if (enhancedAction === 'save-item') {
    const foundRow = enhancedActionState.listItems.find(
      (x) => x.id === payload.radioId
    )
    if (foundRow) {
      // Update
      foundRow.label = payload.radioLabel
      foundRow.hint = payload.radioHint
      foundRow.value = payload.radioValue
    } else {
      // Insert
      enhancedActionState.listItems.push({
        label: payload.radioLabel,
        hint: payload.radioHint,
        value: payload.radioValue,
        id: randomUUID()
      })
    }

    yar.set(sessionNames.enhancedActionState, {
      ...enhancedActionState,
      state: setItemState(undefined, false)
    })
    return '#list-items'
  }
  return undefined
}

/**
 * @import { ComponentDef, ComponentType, FormEditor, FormEditorInputQuestionDetails, EnhancedActionState } from '@defra/forms-model'
 * @import { RequestQuery } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
