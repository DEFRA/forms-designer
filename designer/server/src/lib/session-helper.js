import { randomUUID } from 'crypto'

import { ComponentType, randomId } from '@defra/forms-model'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { getComponentFromDefinition } from '~/src/lib/utils.js'

/**
 * @param {Yar} yar
 * @param {string} key
 */
export function getFlashFromSession(yar, key) {
  const sessionVal = /** @type { string[] | undefined } */ (yar.flash(key))
  return /** @type { string | undefined } */ (sessionVal?.at(0))
}

/**
 * @param {Yar} yar
 * @param {string} key
 * @param {string} value
 */
export function setFlashInSession(yar, key, value) {
  yar.flash(key, value)
}

/**
 * @param {string} stateId
 */
export function questionSessionKey(stateId) {
  return /** @type {QuestionSessionStateKey} */ (
    `${sessionNames.questionSessionState}-${stateId}`
  )
}

/**
 * @param {Yar} yar
 */
export function createQuestionSessionState(yar) {
  const stateId = randomId()
  yar.set(questionSessionKey(stateId), {})
  return stateId
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {QuestionSessionState | undefined } model
 */
export function setQuestionSessionState(yar, stateId, model) {
  yar.set(questionSessionKey(stateId), model)
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {QuestionSessionState | undefined } model
 */
export function mergeQuestionSessionState(yar, stateId, model) {
  const state = yar.get(questionSessionKey(stateId)) ?? {}
  yar.set(questionSessionKey(stateId), {
    ...state,
    ...model
  })
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @returns { QuestionSessionState | undefined }
 */
export function getQuestionSessionState(yar, stateId) {
  return yar.get(questionSessionKey(stateId))
}

/**
 * @param {Yar} yar
 * @param {string} stateId
 */
export function clearQuestionSessionState(yar, stateId) {
  yar.set(questionSessionKey(stateId), undefined)
}

const componentsSavingLists = [
  ComponentType.CheckboxesField,
  ComponentType.RadiosField
]

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @returns { QuestionSessionState | undefined }
 */
export function buildQuestionSessionState(
  yar,
  stateId,
  definition,
  pageId,
  questionId
) {
  const state = getQuestionSessionState(yar, stateId)
  if (
    state?.questionType &&
    !componentsSavingLists.includes(state.questionType)
  ) {
    return state
  }

  if (state?.questionType && state.listItems) {
    return state
  }

  const component = getComponentFromDefinition(definition, pageId, questionId)
  const listId = /** @type { ListComponentsDef | undefined } */ (component)
    ?.list
  const items = listId
    ? (definition.lists.find((x) => x.id === listId)?.items ?? [])
    : []

  const newState = /** @type { QuestionSessionState} */ ({
    questionType: state?.questionType ?? component?.type,
    editRow: state?.editRow ?? {},
    listItems: items.map((item) => ({
      id: item.id ?? randomUUID(),
      text: item.text,
      hint: item.hint,
      value: item.value
    }))
  })
  setQuestionSessionState(yar, stateId, newState)
  return newState
}

/**
 * @import { QuestionSessionState, FormDefinition, ListComponentsDef } from '@defra/forms-model'
 * @import {QuestionSessionStateKey, Yar } from '@hapi/yar'
 */
