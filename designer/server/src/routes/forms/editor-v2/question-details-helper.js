import { randomUUID } from 'node:crypto'

import {
  ComponentType,
  ExtensionType,
  findExclusiveItemIndex,
  getAdditionalQuestion,
  isExclusiveItem,
  randomId
} from '@defra/forms-model'
import Joi from 'joi'

import {
  Direction,
  EnhancedAction,
  ListAction
} from '~/src/common/constants/editor.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { createJoiError } from '~/src/lib/error-boom-helper.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { stringHasValue } from '~/src/lib/utils.js'
import {
  handleAddConditionalAmount,
  handleCancelConditionalAmount,
  handleEditConditionalAmount,
  handleRemoveConditionalAmount,
  handleSaveConditionalAmount
} from '~/src/routes/forms/editor-v2/payment-conditional-amount-actions.js'

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
  const additionalQuestion = getAdditionalQuestion(itemForEdit)

  // The exclusive keys are only added when the item uses them, so that the
  // edit row of a list without an exclusive item looks as it always has
  return {
    radioId: itemForEdit?.id ?? '',
    radioText: itemForEdit?.text ?? '',
    radioHint: itemForEdit?.hint?.text ?? '',
    radioValue: itemForEdit?.value ?? '',
    ...(isExclusiveItem(itemForEdit) ? { radioExclusive: true } : {}),
    ...(additionalQuestion
      ? {
          radioAdditionalTitle: additionalQuestion.title,
          radioAdditionalHint: additionalQuestion.hint ?? '',
          radioAdditionalMaxLength: additionalQuestion.schema.max,
          radioAdditionalOptional:
            additionalQuestion.options?.required === false
        }
      : {}),
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

  // A move that would leave the exclusive item stranded in the middle of the
  // list is refused, since the list could not then be saved
  const exclusiveIdx = findExclusiveItemIndex(newListItems)
  if (exclusiveIdx > 0 && exclusiveIdx < newListItems.length - 1) {
    return listItems
  }

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
 * Handle delete action
 * @param {string|undefined} id - Item ID
 * @returns {string} - redirect URL
 */
function handleDeleteAction(id) {
  return `/delete-list-item/${id}`
}

/**
 * Handle edit action
 * @param {QuestionSessionState} state - Current state
 * @param {Yar} yar - Yar session
 * @param {string} stateId - State ID
 * @param {string|undefined} id - Item ID
 * @returns {string} - redirect anchor
 */
function handleEditAction(state, yar, stateId, id) {
  const itemForEdit = state.listItems?.find((x) => x.id === id)

  setQuestionSessionState(yar, stateId, {
    ...state,
    editRow: setEditRowState(itemForEdit, true)
  })
  return '#add-option-form'
}

/**
 * Handle cancel action
 * @param {QuestionSessionState} state - Current state
 * @param {Yar} yar - Yar session
 * @param {string} stateId - State ID
 * @returns {string} - redirect anchor
 */
function handleCancelAction(state, yar, stateId) {
  setQuestionSessionState(yar, stateId, {
    ...state,
    editRow: setEditRowState(undefined, false)
  })
  return radiosSectionListItemsAnchor
}

/**
 * Handle reorder action
 * @param {QuestionSessionState} state - Current state
 * @param {Yar} yar - Yar session
 * @param {string} stateId - State ID
 * @returns {string} - redirect anchor
 */
function handleReorderAction(state, yar, stateId) {
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

/**
 * Handle move action
 * @param {QuestionSessionState} state - Current state
 * @param {Yar} yar - Yar session
 * @param {string} stateId - State ID
 * @param {string|undefined} id - Item ID
 * @param {string|undefined} direction - Move direction
 * @returns {string} - redirect anchor
 */
function handleMoveAction(state, yar, stateId, id, direction) {
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

/**
 * Handle done reordering action
 * @param {QuestionSessionState} state - Current state
 * @param {Yar} yar - Yar session
 * @param {string} stateId - State ID
 * @returns {string} - redirect anchor
 */
function handleDoneReorderingAction(state, yar, stateId) {
  setQuestionSessionState(yar, stateId, {
    ...state,
    isReordering: false,
    editRow: { expanded: false }
  })
  return radiosSectionListItemsAnchor
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

  const actionHandlers = {
    [ListAction.Delete]: () => handleDeleteAction(id),
    [ListAction.Edit]: () => handleEditAction(state, yar, stateId, id),
    [ListAction.Cancel]: () => handleCancelAction(state, yar, stateId),
    [ListAction.Reorder]: () => handleReorderAction(state, yar, stateId),
    [ListAction.Move]: () =>
      handleMoveAction(state, yar, stateId, id, direction),
    [ListAction.DoneReordering]: () =>
      handleDoneReorderingAction(state, yar, stateId),
    'edit-conditional-amount': () =>
      handleEditConditionalAmount(yar, stateId, id),
    'cancel-conditional-amount': () =>
      handleCancelConditionalAmount(yar, stateId),
    'remove-conditional-amount': () =>
      handleRemoveConditionalAmount(yar, stateId, id)
  }

  const handler = actionHandlers[action]
  // its not always truthy here as it could be undefined
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (handler) {
    return handler()
  }

  return undefined
}

/**
 * Builds the extensions to store against the item being edited.
 *
 * Only the exclusive item may carry a follow-up question, so clearing the
 * exclusive box drops both. The follow-up question keeps the id and name it
 * was first given, so that renaming its title does not move the answer to a
 * different key in form state.
 * @param {FormEditorInputQuestionDetails} payload
 * @param { ListItem | undefined } existingItem
 * @returns {Extension[]}
 */
export function buildItemExtensions(payload, existingItem) {
  if (!payload.radioExclusive) {
    return []
  }

  /** @type {Extension[]} */
  const extensions = [{ type: ExtensionType.Exclusive }]

  const title = payload.radioAdditionalTitle?.trim()

  if (!title) {
    return extensions
  }

  const existing = getAdditionalQuestion(existingItem)
  const maxLength = payload.radioAdditionalMaxLength

  extensions.push({
    type: ExtensionType.AdditionalQuestion,
    id: existing?.id ?? randomUUID(),
    name: existing?.name ?? randomId(),
    title,
    ...(payload.radioAdditionalHint
      ? { hint: payload.radioAdditionalHint }
      : {}),
    options: { required: !payload.radioAdditionalOptional },
    schema: maxLength ? { max: maxLength } : {}
  })

  return extensions
}

/**
 * The exclusive item has to sit at one end of the list, so that the "or"
 * divider can be rendered against it.
 * @param {ListItem[]} listItems
 * @param {number} itemIdx
 * @returns {boolean}
 */
export function isValidExclusivePosition(listItems, itemIdx) {
  return itemIdx === 0 || itemIdx === listItems.length - 1
}

/**
 *
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {QuestionSessionState} state
 * @param {string } stateId
 * @returns { string | undefined }
 */
export function handleSaveItem(request, state, stateId) {
  const { yar, payload } = request
  const listItemsSnapshot =
    state.listItems?.map((x) => {
      return { ...x }
    }) ?? []

  const foundRow = listItemsSnapshot.find((x) => x.id === payload.radioId)
  const extensions = buildItemExtensions(payload, foundRow)

  if (foundRow) {
    // Update
    foundRow.text = payload.radioText
    foundRow.hint = payload.radioHint
      ? {
          text: payload.radioHint
        }
      : undefined
    foundRow.value = stringHasValue(payload.radioValue)
      ? payload.radioValue
      : payload.radioText
    if (extensions.length) {
      foundRow.extensions = extensions
    } else {
      delete foundRow.extensions
    }
  } else {
    // Insert
    listItemsSnapshot.push({
      text: payload.radioText,
      hint: payload.radioHint
        ? {
            text: payload.radioHint
          }
        : undefined,
      value: stringHasValue(payload.radioValue)
        ? payload.radioValue
        : payload.radioText,
      id: randomUUID(),
      ...(extensions.length ? { extensions } : {})
    })
  }
  const fullItemTexts = listItemsSnapshot.map((x) => x.text)

  // Check for uniqueness
  const { error } = listUniquenessSchema.validate({
    radioText: fullItemTexts
  })
  if (error) {
    addErrorsToSession(request, errorKey, error)
    return '#'
  }

  const savedItemIdx = foundRow
    ? listItemsSnapshot.indexOf(foundRow)
    : listItemsSnapshot.length - 1

  if (extensions.length) {
    if (!isValidExclusivePosition(listItemsSnapshot, savedItemIdx)) {
      addErrorsToSession(
        request,
        errorKey,
        createJoiError(
          'radioExclusive',
          'A ‘none of the above’ item must be the first or the last item in the list'
        )
      )
      return '#'
    }

    // Only one item in a list can be the exclusive one. The exclusive and
    // follow-up question extensions are the only ones there are, so an item
    // that is no longer exclusive has nothing left to keep.
    for (const [idx, item] of listItemsSnapshot.entries()) {
      if (idx !== savedItemIdx && isExclusiveItem(item)) {
        delete item.extensions
      }
    }
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
 * @param {QuestionSessionState} preState
 * @param {string} enhancedAction
 * @param {FormDefinition} [definition]
 * @returns {string | undefined}
 */
function dispatchConditionalAmountAction(
  request,
  stateId,
  questionDetails,
  preState,
  enhancedAction,
  definition
) {
  const { yar } = request
  setQuestionSessionState(yar, stateId, { ...preState, questionDetails })
  if (enhancedAction === EnhancedAction.AddConditionalAmount) {
    return handleAddConditionalAmount(yar, stateId)
  }
  if (enhancedAction === EnhancedAction.SaveConditionalAmount) {
    return handleSaveConditionalAmount(request, stateId, definition)
  }
  return handleCancelConditionalAmount(yar, stateId)
}

/**
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {string} stateId
 * @param {Partial<ComponentDef>} questionDetails
 * @param {FormDefinition} [definition]
 * @returns { string | undefined }
 */
export function handleEnhancedActionOnPost(
  request,
  stateId,
  questionDetails,
  definition
) {
  const { yar, payload } = request
  const { enhancedAction } = payload

  if (!enhancedAction) {
    return undefined
  }

  const preState = getQuestionSessionState(yar, stateId)
  if (!preState?.questionType) {
    throw new Error('Invalid session contents')
  }

  if (
    enhancedAction === EnhancedAction.AddConditionalAmount ||
    enhancedAction === EnhancedAction.SaveConditionalAmount ||
    enhancedAction === EnhancedAction.CancelConditionalAmount
  ) {
    return dispatchConditionalAmountAction(
      request,
      stateId,
      questionDetails,
      preState,
      enhancedAction,
      definition
    )
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

  return dispatchRadiosListAction(request, state, stateId, enhancedAction)
}

/**
 * @param {Request<{ Payload: FormEditorInputQuestionDetails }>} request
 * @param {QuestionSessionState} state
 * @param {string} stateId
 * @param {string} enhancedAction
 * @returns { string | undefined }
 */
function dispatchRadiosListAction(request, state, stateId, enhancedAction) {
  const { yar } = request

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
 * @import { ComponentDef, FormDefinition, FormEditorInputQuestionDetails, FormEditorInputQuestion, QuestionSessionState, ListItem, Extension } from '@defra/forms-model'
 * @import { Request, RequestQuery } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
