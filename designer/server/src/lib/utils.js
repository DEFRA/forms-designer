import { ComponentType, hasComponents } from '@defra/forms-model'
import { getTraceId } from '@defra/hapi-tracing'
import slug from 'slug'

import config from '~/src/config.js'

/**
 * Returns a set of headers to use in a http request`
 * @param {string} token
 * @returns {Parameters<typeof Wreck.request>[2]}
 */
export function getHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(getTraceId() ? { [config.tracing.header]: getTraceId() } : {})
    }
  }
}

/**
 * Replace whitespace, en-dashes and em-dashes with spaces
 * before running through the slug package
 * @param {string} input
 */
export function slugify(input = '', options = {}) {
  const string = input.trimStart().replace(/[\s–—]/g, ' ')

  return slug(string, {
    fallback: false,
    lower: true,
    trim: true,
    ...options
  })
}

/**
 *
 * @param {string | undefined} checkboxVal
 * @returns {boolean}
 */
export function isCheckboxSelected(checkboxVal) {
  return checkboxVal === 'true' || checkboxVal === 'Y'
}

/**
 *
 * @param {string | undefined | null} str
 * @returns {boolean}
 */
export function stringHasValue(str) {
  if (!str) {
    return false
  }
  return str.length > 0
}

/**
 * @param {ErrorDetailsItem | undefined} formField
 */
export function insertValidationErrors(formField) {
  return {
    ...(formField && {
      errorMessage: {
        text: formField.text
      }
    })
  }
}

/**
 *
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns { Page | undefined }
 */
export function getPageFromDefinition(definition, pageId) {
  return definition.pages.find((x) => x.id === pageId)
}

/**
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @returns { ComponentDef | undefined }
 */
export function getComponentFromDefinition(definition, pageId, questionId) {
  const page = definition.pages.find((x) => x.id === pageId)
  return /** @type { ComponentDef | undefined } */ (
    hasComponents(page)
      ? page.components.find((x) => x.id === questionId)
      : undefined
  )
}

export const componentsSavingLists = [
  ComponentType.AutocompleteField,
  ComponentType.CheckboxesField,
  ComponentType.RadiosField
]

/**
 * @param { ComponentType | undefined } type
 * @param { QuestionSessionState | undefined } state
 * @returns {boolean}
 */
export function noListToSave(type, state) {
  return !isListComponent(type) || !state?.listItems
}

/**
 * @param {(component: ComponentDef) => boolean} predicate
 * @returns {(page: Page) => boolean}
 */
export function isFulfilledOnPageComponent(predicate) {
  return /** @type {(page: Page) => boolean}} */ (
    (page) => {
      return page.components.some(predicate)
    }
  )
}

/**
 * @param { ComponentType | undefined } type
 * @returns {boolean}
 */
export function isListComponent(type) {
  return componentsSavingLists.includes(type ?? ComponentType.TextField)
}

/**
 * Finds the list in the component, if it exists
 * @param { ComponentDef | undefined } component
 * @param {FormDefinition} definition
 * @returns { List | undefined }
 */
export function getListFromComponent(component, definition) {
  if (!component) {
    return undefined
  }
  const listName = 'list' in component ? component.list : undefined

  if (listName) {
    return definition.lists.find((list) => list.name === listName)
  }

  return undefined
}

/**
 * Turns a list into a string for auto complete
 * @param { List | undefined } list
 */
export function mapListToAutoCompleteStr(list) {
  return (
    list?.items.map(({ text, value }) => `${text}:${value}`).join('\r\n') ?? ''
  )
}

/**
 * Checks whether component list will be orphaned after deletion
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} componentId
 */
export function findUniquelyMappedList(definition, pageId, componentId) {
  const component = getComponentFromDefinition(definition, pageId, componentId)

  if (!isListComponent(component?.type)) {
    return undefined
  }

  const { id } = component

  const list = getListFromComponent(component, definition)

  if (!list) {
    return undefined
  }

  const predicate = /** @type {(component: ComponentDef) => boolean} */ (
    (component) => component.id !== id && component.list === list.name
  )
  const listIsNotUnique = definition.pages.some(
    isFulfilledOnPageComponent(predicate)
  )

  return listIsNotUnique ? undefined : list.id
}

/**
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 * @import { ComponentDef, FormDefinition, List, Page, QuestionSessionState } from '@defra/forms-model'
 * @import Wreck from '@hapi/wreck'
 */
