import { randomUUID } from 'crypto'

import { hasComponents } from '@defra/forms-model'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'

const radiosSectionListItemsAnchor = '#list-items'

/**
 * @param {Yar} yar
 */
export function clearEnhancedActionState(yar) {
  yar.set(sessionNames.enhancedActionState, null)
}

/**
 * @param {Yar} yar
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @returns { EnhancedActionState | undefined }
 */
export function getEnhancedActionStateFromSession(
  yar,
  definition,
  pageId,
  questionId
) {
  const state = yar.get(sessionNames.enhancedActionState)
  if (state) {
    return state
  }

  // Read list from definition and store in session
  const page = getPageFromDefinition(definition, pageId)
  const component = /** @type { ListComponentsDef | undefined } */ (
    hasComponents(page)
      ? page.components.find((x) => x.id === questionId)
      : undefined
  )
  const listName = component?.list
  if (listName) {
    const items = definition.lists.find((x) => x.name === listName)?.items ?? []
    const newState = /** @type { EnhancedActionState} */ ({
      state: {},
      listItems: items.map((item) => ({
        id: randomUUID(),
        label: item.text,
        // hint: item.hint,
        value: item.value
      }))
    })
    yar.set(sessionNames.enhancedActionState, newState)
    return newState
  }

  return undefined
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
    return radiosSectionListItemsAnchor
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
    return radiosSectionListItemsAnchor
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

  if (!enhancedAction) {
    return undefined
  }

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
    return radiosSectionListItemsAnchor
  }
  return undefined
}

/**
 * @import { ComponentDef,  FormEditorInputQuestionDetails, EnhancedActionState, FormDefinition, ListComponentsDef } from '@defra/forms-model'
 * @import { RequestQuery } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
