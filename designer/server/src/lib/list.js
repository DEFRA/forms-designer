import config from '~/src/config.js'
import { delJson, postJson, putJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'
import { mapBaseQuestionDetails } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)
const postJsonByListType =
  /** @type {typeof postJson<{ id: string; list: List; status: 'created' }>} */ (
    postJson
  )
const putJsonByListType =
  /** @type {typeof putJson<{ id: string; list: List; status: 'updated' }>} */ (
    putJson
  )

/**
 * Maps FormEditorInputQuestion payload to AutoComplete Component
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<ComponentDef>}
 */
export function mapAutoCompleteComponentFromPayload(payload) {
  const baseComponentDetails = mapBaseQuestionDetails(payload)
  return {
    ...baseComponentDetails,
    list: baseComponentDetails.name
  }
}

/**
 * Maps FormEditorInputQuestion payload to AutoComplete Component
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<List>}
 */
export function buildAutoCompleteListFromPayload(payload) {
  return {
    name: payload.name,
    title: payload.question,
    type: 'string',
    items: payload.autoCompleteOptions
  }
}

/**
 * Creates a new list on the draft definition
 * @param {string} formId
 * @param {string} token
 * @param {Partial<List>} list
 * @returns {Promise<{ id: string; list: List; status: 'created' }>}
 */
export async function createList(formId, token, list) {
  const addListUrl = new URL(
    `./${formId}/definition/draft/lists`,
    formsEndpoint
  )
  const { body } = await postJsonByListType(addListUrl, {
    payload: list,
    ...getHeaders(token)
  })

  return body
}

/**
 * Updates a list on the draft definition
 * @param {string} formId
 * @param {string | undefined} listId
 * @param {string} token
 * @param {Partial<List>} list
 * @returns {Promise<{ id: string; list: List; status: 'updated' }>}
 */
export async function updateList(formId, listId, token, list) {
  if (listId === undefined) {
    throw new Error(`Id missing from list with name - ${list.name}`)
  }

  const addListUrl = new URL(
    `./${formId}/definition/draft/lists/${listId}`,
    formsEndpoint
  )
  const { body } = await putJsonByListType(addListUrl, {
    payload: list,
    ...getHeaders(token)
  })

  return body
}

/**
 * Deletes a list
 * @param {string} formId
 * @param {string} listId
 * @param {string} token
 */
export async function deleteList(formId, listId, token) {
  const addListUrl = new URL(
    `./${formId}/definition/draft/lists/${listId}`,
    formsEndpoint
  )
  await delJson(addListUrl, getHeaders(token))
}

/**
 * Creates a new list if it does not exist, updates an existing list if it does
 * @param {string} formId
 * @param {FormDefinition} definition
 * @param {string} token
 * @param {Partial<List>} upsertedList
 * @returns {Promise<{ id: string; list: List; status: 'updated' | 'created' }>}
 */
export async function upsertList(formId, definition, token, upsertedList) {
  const foundList = definition.lists.find(
    (list) => list.name === upsertedList.name
  )

  if (foundList) {
    return updateList(formId, foundList.id, token, upsertedList)
  }

  return createList(formId, token, upsertedList)
}

/**
 * @import { FormDefinition, List, Item, FormEditorInputQuestion, AutocompleteFieldComponent, ComponentDef } from '@defra/forms-model'
 */
