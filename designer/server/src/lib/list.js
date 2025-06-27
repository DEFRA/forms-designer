import { ConditionType, randomId } from '@defra/forms-model'

import config from '~/src/config.js'
import { delJson, postJson, putJson } from '~/src/lib/fetch.js'
import {
  findPageUniquelyMappedLists,
  findUniquelyMappedList,
  getHeaders,
  stringHasValue
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
 * Maps FormEditorInputQuestion payload to AutoComplete Component
 * @param {Partial<FormEditorInputQuestion>} questionDetails
 * @param {Item[]} listItems
 * @param {FormDefinition} definition
 * @returns {Partial<List>}
 */
export function buildListFromDetails(questionDetails, listItems, definition) {
  const listId = stringHasValue(questionDetails.list)
    ? questionDetails.list
    : undefined
  const existingList = definition.lists.find((x) => x.id === listId)
  return {
    id: existingList ? existingList.id : undefined,
    name: existingList ? existingList.name : randomId(),
    title: `List for question ${questionDetails.name}`,
    type: 'string',
    items: listItems.map((item) => {
      return {
        id: item.id,
        text: item.text,
        hint: item.hint,
        value: stringHasValue(`${item.value}`) ? item.value : item.text
      }
    })
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
 */
export function matchLists(definition, listRef, listItems) {
  /**
   * @param {Item[]} listItems
   * @param {Item} item
   */
  function populateExistingId(listItems, item) {
    const found =
      listItems.find((i) => i.value === item.value) ??
      listItems.find((i) => i.text === item.text)
    return {
      id: found?.id,
      text: item.text,
      value: item.value
    }
  }

  const existingList = definition.lists.find((x) => x.id === listRef)
  const existingListItems = existingList?.items ?? []

  const listItemsWithIds = /** @type {Item[]} */ (
    listItems?.map((x) => populateExistingId(existingListItems, x))
  )

  // TODO - add hint text into the match
  const existingListMapped = existingListItems.map((x) => ({
    text: x.text,
    value: x.value
  }))
  const incomingListMapped =
    listItems?.map((x) => ({ text: x.text, value: x.value })) ?? []

  const incomingListValues = incomingListMapped.map((x) => x.value)

  const deletions = existingListMapped
    .filter((x) => !incomingListValues.includes(x.value))
    .map((x) => populateExistingId(existingListItems, x))
  return { deletions, listItemsWithIds }
}

/**
 * @param {FormDefinition} definition
 * @param {Item[]} listItems
 * @param {string} listName
 */
export function usedInConditions(definition, listItems, listName) {
  const conditions = /** @type {ConditionWrapperV2[]} */ (definition.conditions)
  if (conditions.length === 0) {
    return []
  }

  const listItemIds = listItems
    .map((item) => item.id)
    .filter((x) => x !== undefined)

  /*
  const listRefConditions = conditions
    .filter(cond =>
      cond.items.some(item =>
        'type' in item ? item.type === ConditionType.ListItemRef &&
          // @ts-expect-error - itemId takes some unnecessary coercing of types to satisfy tslint
          listItemIds.includes(item.value.itemId): false))
  */

  // TODO - write this better
  const breakableConditions = conditions.filter((cond) =>
    cond.items.some((item) =>
      'type' in item ? item.type === ConditionType.ListItemRef : false
    )
  )

  const brokenConditions = []
  const listRows = definition.lists.find((x) => x.id === listName)?.items
  for (const itemId of listItemIds) {
    for (const condition of breakableConditions) {
      // @ts-expect-error - itemId takes some unnecessary coercing of types to satisfy tslint
      if (condition.items.some((item) => item.value.itemId === itemId)) {
        brokenConditions.push({
          displayName: condition.displayName,
          itemId,
          entryText: listRows?.find((x) => x.id === itemId)?.text
        })
      }
    }
  }

  return brokenConditions
}

/**
 * @import { ConditionWrapperV2, FormDefinition, FormEditorInputQuestion, Item, List } from '@defra/forms-model'
 */
