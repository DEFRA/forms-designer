import { randomUUID } from 'node:crypto'

import { ComponentType, randomId } from '@defra/forms-model'

import {
  addPageAndFirstQuestion,
  addQuestion,
  updateQuestion
} from '~/src/lib/editor.js'
import { matchLists, upsertList, usedInConditions } from '~/src/lib/list.js'
import { setQuestionSessionState } from '~/src/lib/session-helper.js'
import {
  getComponentFromDefinition,
  isListComponentType,
  stringHasValue
} from '~/src/lib/utils.js'

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
 * @param {string} formId
 * @param {FormDefinition} definition
 * @param {string} token
 * @param {Partial<ComponentDef>} questionDetails
 * @param {Item[] | undefined } listItems
 * @returns {Promise<undefined|string>}
 */
export async function saveList(
  formId,
  definition,
  token,
  questionDetails,
  listItems
) {
  if (!isListComponentType(questionDetails.type ?? ComponentType.TextField)) {
    return undefined
  }

  const listMapped = buildListFromDetails(
    questionDetails,
    listItems ?? [],
    definition
  )

  if (listMapped.id) {
    // compare lists - one from state, one from definition
    const listId =
      'list' in questionDetails && questionDetails.list !== ''
        ? questionDetails.list
        : undefined
    const { listItemsWithIds } = matchLists(definition, listId, listItems)
    listMapped.items = listItemsWithIds
  }

  const { list, status } = await upsertList(
    formId,
    definition,
    token,
    listMapped
  )

  return status === 'created' ? list.id : undefined
}

/**
 * @param {string} formId
 * @param {string} token
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {Partial<ComponentDef>} questionDetails
 * @param { Item[] | undefined } listItems
 * @returns {Promise<string>}
 */
export async function saveQuestion(
  formId,
  token,
  definition,
  pageId,
  questionId,
  questionDetails,
  listItems
) {
  // Create or update the list (if this is a Component that uses a List)
  const listId = await saveList(
    formId,
    definition,
    token,
    questionDetails,
    listItems
  )

  const questDetailsWithList = listId
    ? { ...questionDetails, list: listId }
    : questionDetails

  if (pageId === 'new') {
    const newPage = await addPageAndFirstQuestion(
      formId,
      token,
      questDetailsWithList
    )
    return newPage.id ?? 'unknown'
  } else if (questionId === 'new') {
    await addQuestion(formId, token, pageId, questDetailsWithList)
  } else {
    await updateQuestion(
      formId,
      token,
      definition,
      pageId,
      questionId,
      questDetailsWithList
    )
  }
  return pageId
}

/**
 *
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {Item[]} listElements
 * @param {Yar} yar
 * @param { QuestionSessionState | undefined } state
 * @param {string} stateId
 * @returns
 */
export function handleListConflict(
  definition,
  pageId,
  questionId,
  listElements,
  yar,
  state,
  stateId
) {
  const component = getComponentFromDefinition(definition, pageId, questionId)
  const listName = component && 'list' in component ? component.list : ''
  const { additions, deletions, listItemsWithIds } = matchLists(
    definition,
    listName,
    /** @type {Item[]} */ (listElements)
  )

  const listItems = listItemsWithIds.map((item) => {
    return {
      ...item,
      id: item.id ?? randomUUID()
    }
  })

  const conditions = usedInConditions(definition, deletions, listName)
  if (conditions.length) {
    const affectedConditions = /** @type {ListConflict[]} */ (
      conditions.map((cond) => {
        return {
          conflictItem: {
            id: cond.itemId,
            text: cond.entryText ?? ''
          },
          conditionNames: [cond.displayName],
          linkableItems: deletions
            .filter((d) => d.id === cond.itemId)
            .concat(additions)
            .filter((x) => x.text !== cond.entryText)
            .sort(({ text: itemA }, { text: itemB }) =>
              itemA.localeCompare(itemB)
            )
        }
      })
    )

    // Remove duplicates
    const dedupedConflicts = affectedConditions.filter(
      (cond, index, self) =>
        index ===
        self.findIndex((c) => c.conflictItem.id === cond.conflictItem.id)
    )

    // Populate condition names
    for (const conf of dedupedConflicts) {
      conf.conditionNames = affectedConditions
        .filter((x) => x.conflictItem.id === conf.conflictItem.id)
        .map((y) => y.conditionNames[0])
    }

    setQuestionSessionState(yar, stateId, {
      ...state,
      listConflicts: dedupedConflicts,
      listItems
    })

    return true
  }
  return false
}

/**
 * @import { ComponentDef,  FormDefinition, FormEditorInputQuestion,  Item, QuestionSessionState, List, ListConflict } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 */
