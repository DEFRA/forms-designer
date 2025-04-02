import { randomUUID } from 'crypto'

import { ComponentType, hasComponents, randomId } from '@defra/forms-model'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'

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
  return `${sessionNames.questionSessionState}-${stateId}`
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
    !componentsSavingLists.includes(
      state?.questionType ?? ComponentType.TextField
    ) ||
    state?.editRow
  ) {
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
    const newState = /** @type { QuestionSessionState} */ ({
      editRow: {},
      listItems: items.map((item) => ({
        id: randomUUID(),
        label: item.text,
        // hint: item.hint,
        value: item.value
      }))
    })
    yar.set(sessionNames.questionSessionState, newState)
    return newState
  }

  return state
}

/**
 * @import { QuestionSessionState, FormDefinition, ListComponentsDef } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
