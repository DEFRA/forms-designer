import { randomUUID } from 'crypto'

import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'

const radiosSectionListItemsAnchor = '#list-items'
const errorKey = sessionNames.validationFailure.editorQuestionDetails

const listUniquenessSchema = Joi.object({
  radioText: Joi.array().unique('text').messages({
    'array.unique': 'Item text must be unique in the list'
  })
})

/**
 * @param { { id?: string, text?: string, hint?: string, value?: string } | undefined } itemForEdit
 * @param {boolean} expanded
 */
export function setEditRowState(itemForEdit, expanded) {
  return {
    radioId: itemForEdit?.id ?? '',
    radioText: itemForEdit?.text ?? '',
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
 * @param {Request<{ Payload: FormEditorInputQuestionDetails; }>} request
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
      foundRow.text = payload.radioText
      foundRow.hint = payload.radioHint
      foundRow.value = payload.radioValue
    } else {
      // Insert
      const fullItemTexts = (state.listItems?.map((x) => x.text) ?? []).concat(
        payload.radioText
      )
      // Check for uniqueness
      const { error } = listUniquenessSchema.validate({
        radioText: fullItemTexts
      })
      if (error) {
        addErrorsToSession(request, error, errorKey)
        return '#'
      }
      state.listItems?.push({
        text: payload.radioText,
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
 * @import { Request, RequestQuery } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
