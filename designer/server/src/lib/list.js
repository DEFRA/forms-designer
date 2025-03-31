import config from '~/src/config.js'
import { postJson, putJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'
import { mapQuestionDetails } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)
const postJsonByListType = /** @type {typeof postJson<List>} */ (postJson)
const putJsonByListType = /** @type {typeof putJson<List>} */ (putJson)

/**
 *
 * @param {Partial<FormEditorInputQuestion>} payload
 * @param {string } listId
 * @returns {Partial<ComponentDef>}
 */
export function buildAutoCompleteComponentFromPayload(payload, listId) {
  const baseComponentDetails = mapQuestionDetails(payload)

  return {
    ...baseComponentDetails,
    list: listId
  }
}

/**
 * Creates a new list on the draft definition
 * @param {string} formId
 * @param {string} token
 * @param {Partial<List>} list
 * @returns {Promise<List>}
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
 * @param {string} listId
 * @param {string} token
 * @param {Partial<List>} list
 * @returns {Promise<List>}
 */
export async function updateList(formId, listId, token, list) {
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
 * @import {  FormDefinition, List, FormEditorInputQuestion, ComponentDef} from '@defra/forms-model'
 */
