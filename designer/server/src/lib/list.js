import config from '~/src/config.js'
import { delJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  findPageUniquelyMappedLists,
  findUniquelyMappedList,
  getHeaders
} from '~/src/lib/utils.js'

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
  const foundList = definition.lists.find((list) => list.id === upsertedList.id)

  if (foundList) {
    return updateList(formId, foundList.id, token, {
      ...foundList,
      ...upsertedList
    })
  }

  return createList(formId, token, upsertedList)
}

/**
 * Removes a list from a question if question list is unique
 * @param {string} formId
 * @param {FormDefinition} definition
 * @param {string} token
 * @param {string} pageId
 * @param {string} questionId
 */
export async function removeUniquelyMappedListFromQuestion(
  formId,
  definition,
  token,
  pageId,
  questionId
) {
  const listIdToDelete = findUniquelyMappedList(definition, pageId, questionId)

  if (listIdToDelete !== undefined) {
    await deleteList(formId, listIdToDelete, token)
  }
}

/**
 * Deletes all the uniquely mapped lists
 * @param {string} formId
 * @param {FormDefinition} definition
 * @param {string} token
 * @param {string} pageId
 */
export async function removeUniquelyMappedListsFromPage(
  formId,
  definition,
  token,
  pageId
) {
  const listIdsToDelete = findPageUniquelyMappedLists(definition, pageId)

  let listId
  for (listId of listIdsToDelete) {
    await deleteList(formId, listId, token)
  }
}

/**
 * @param {FormDefinition} definition
 * @param { string | undefined } listRef
 * @param { Item[] | undefined } listItems
 * @returns {Item[]}
 */
export function populateListIds(definition, listRef, listItems) {
  /**
   * @param {Item[]} listItems
   * @param {Item} item
   */
  function populateExistingId(listItems, item) {
    const found =
      listItems.find((i) => i.id === item.id) ??
      listItems.find((i) => i.value === item.value) ??
      listItems.find((i) => i.text === item.text)
    return {
      id: found?.id,
      text: item.text,
      value: item.value,
      hint: item.hint
    }
  }

  const existingList = definition.lists.find((x) => x.id === listRef)
  const existingListItems = existingList?.items ?? []

  return /** @type {Item[]} */ (
    listItems?.map((x) => populateExistingId(existingListItems, x))
  )
}

/**
 * @import { FormDefinition, FormEditorInputQuestion, Item, List } from '@defra/forms-model'
 */
