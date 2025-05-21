import { randomUUID } from 'crypto'

import { ComponentType } from '@defra/forms-model'
import Joi from 'joi'

import {
  Direction,
  EnhancedAction,
  ListAction
} from '~/src/common/constants/editor.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'

const radiosSectionListItemsAnchor = '#list-items'
const errorKey = sessionNames.validationFailure.editorQuestionDetails

const listUniquenessSchema = Joi.object({
  radioText: Joi.array().items(Joi.string()).unique().messages({
    'array.unique': 'Item text must be unique in the list'
  })
})

/**
 * @param { ListItem | undefined } itemForEdit
 * @param {boolean} expanded
 */
export function setEditRowState(itemForEdit, expanded) {
  return {
    radioId: itemForEdit?.id ?? '',
    radioText: itemForEdit?.text ?? '',
    radioHint: itemForEdit?.hint?.text ?? '',
    radioValue: itemForEdit?.value ?? '',
    expanded
  }
}

/**
 * Repositions a list item in the array
 * @param {{ id?: string }[]} listItems
 * @param {string} direction
 * @param {string} itemId
 * @returns {{ id?: string }[]}
 */
export function repositionListItem(listItems, direction, itemId) {
  if (!listItems.length) {
    return listItems
  }

  const itemIdx = listItems.findIndex((x) => x.id === itemId)

  const isValidDirection =
    (direction === Direction.Down && itemIdx < listItems.length - 1) ||
    (direction === Direction.Up && itemIdx > 0)

  if (itemIdx === -1 || !isValidDirection) {
    return listItems
  }

  const positionIndex = direction === Direction.Down ? itemIdx + 1 : itemIdx - 1

  const newListItems = [...listItems]
  const itemToMove = newListItems[itemIdx]
  newListItems.splice(itemIdx, 1)
  newListItems.splice(positionIndex, 0, itemToMove)

  return newListItems
}

/**
 * @param { string | undefined } id
 * @param { string | undefined } direction
 * @returns {boolean}
 */
export function paramsValidForMove(id, direction) {
  return (
    !!id &&
    !!direction &&
    (direction === Direction.Up || direction === Direction.Down)
  )
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {RequestQuery} query
 * @returns { string | undefined } - anchor (beginning with '#') or a url
 */
export function handleEnhancedActionOnGet(yar, stateId, query) {
  const { action, id, direction } =
    /** @type {{ action?: string, id?: string, direction?: string }} */ (query)
  if (!action) {
    return undefined
  }

  const state = getQuestionSessionState(yar, stateId)
  if (!state?.questionType) {
    throw new Error('Invalid session contents')
  }

  if (action === ListAction.Delete) {
    return `/delete-list-item/${id}`
  }

  if (action === ListAction.Edit) {
    const itemForEdit = state.listItems?.find((x) => x.id === id)

    setQuestionSessionState(yar, stateId, {
      ...state,
      editRow: setEditRowState(itemForEdit, true)
    })
    return '#add-option-form'
  }

  if (action === ListAction.Cancel) {
    setQuestionSessionState(yar, stateId, {
      ...state,
      editRow: setEditRowState(undefined, false)
    })
    return radiosSectionListItemsAnchor
  }

  if (action === ListAction.Reorder) {
    const newState = {
      questionType: state.questionType,
      questionDetails: state.questionDetails,
      editRow: { expanded: false },
      listItems: state.listItems,
      isReordering: true
    }
    setQuestionSessionState(yar, stateId, newState)
    return radiosSectionListItemsAnchor
  }

  if (action === ListAction.Move) {
    if (paramsValidForMove(id, direction)) {
      const newList = repositionListItem(
        state.listItems ?? [],
        String(direction),
        String(id)
      )
      setQuestionSessionState(yar, stateId, {
        ...state,
        listItems: newList,
        lastMovedId: String(id),
        lastMoveDirection: String(direction)
      })
    }
    return '#'
  }

  if (action === ListAction.DoneReordering) {
    setQuestionSessionState(yar, stateId, {
      ...state,
      isReordering: false,
      editRow: { expanded: false }
    })
    return radiosSectionListItemsAnchor
  }

  return undefined
}

/**
 *
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {QuestionSessionState} state
 * @param {string } stateId
 * @returns { string | undefined }
 */
function handleSaveItem(request, state, stateId) {
  const { yar, payload } = request
  const listItemsSnapshot =
    state.listItems?.map((x) => {
      return { ...x }
    }) ?? []

  const foundRow = listItemsSnapshot.find((x) => x.id === payload.radioId)
  if (foundRow) {
    // Update
    foundRow.text = payload.radioText
    foundRow.hint = payload.radioHint
      ? {
          text: payload.radioHint
        }
      : undefined
    foundRow.value = payload.radioValue
  } else {
    // Insert
    listItemsSnapshot.push({
      text: payload.radioText,
      hint: payload.radioHint
        ? {
            text: payload.radioHint
          }
        : undefined,
      value: payload.radioValue !== '' ? payload.radioValue : payload.radioText,
      id: randomUUID()
    })
  }
  const fullItemTexts = listItemsSnapshot.map((x) => x.text)

  // Check for uniqueness
  const { error } = listUniquenessSchema.validate({
    radioText: fullItemTexts
  })
  if (error) {
    addErrorsToSession(request, error, errorKey)
    return '#'
  }

  setQuestionSessionState(yar, stateId, {
    ...state,
    editRow: setEditRowState(undefined, false),
    listItems: listItemsSnapshot
  })
  return radiosSectionListItemsAnchor
}

/**
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {string} stateId
 * @param {Partial<ComponentDef>} questionDetails
 * @returns { string | undefined }
 */
export function handleEnhancedActionOnPost(request, stateId, questionDetails) {
  const { yar, payload } = request
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
      radioText: payload.radioText,
      radioHint: payload.radioHint,
      radioValue: payload.radioValue,
      expanded: true
    },
    isReordering: preState.isReordering,
    lastMovedId: preState.lastMovedId,
    lastMoveDirection: preState.lastMoveDirection,
    listItems: preState.listItems ?? []
  })

  if (enhancedAction === EnhancedAction.AddItem) {
    setQuestionSessionState(yar, stateId, state)
    return '#add-option-form'
  }

  if (enhancedAction === EnhancedAction.Reorder) {
    state.isReordering = true
    setQuestionSessionState(yar, stateId, state)
    return radiosSectionListItemsAnchor
  }

  if (enhancedAction === ListAction.DoneReordering) {
    state.isReordering = false
    setQuestionSessionState(yar, stateId, state)
    return radiosSectionListItemsAnchor
  }

  if (enhancedAction === EnhancedAction.SaveItem) {
    return handleSaveItem(request, state, stateId)
  }

  return undefined
}

/**
 * @param {FormEditorInputQuestion} payload
 * @returns {FormEditorInputQuestion}
 */
export function enforceFileUploadFieldExclusivity(payload) {
  if (payload.questionType === ComponentType.FileUploadField) {
    const exactFiles = payload.exactFiles

    if (exactFiles && exactFiles !== '') {
      payload.minFiles = ''
      payload.maxFiles = ''
    }
  }

  return payload
}

/**
 * @import { ComponentDef,  FormEditorInputQuestionDetails, FormEditorInputQuestion,  QuestionSessionState, ListItem } from '@defra/forms-model'
 * @import { Request, RequestQuery } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
