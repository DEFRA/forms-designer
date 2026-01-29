import {
  ComponentType,
  getYesNoList,
  hasComponents,
  hasListField,
  isFormType
} from '@defra/forms-model'
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
 *
 * @param {number | undefined} num
 * @returns {boolean}
 */
export function numberHasValue(num) {
  return typeof num === 'number'
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
 *
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns { ComponentDef[] }
 */
export function getComponentsOnPageFromDefinition(definition, pageId) {
  const page = getPageFromDefinition(definition, pageId)
  return hasComponents(page) ? page.components : []
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
  ComponentType.RadiosField,
  ComponentType.SelectField
]

/**
 * @param { ComponentType | undefined } type
 * @param { QuestionSessionState | undefined } state
 * @returns {boolean}
 */
export function noListToSave(type, state) {
  return !isListComponentType(type) || !state?.listItems
}

/**
 * @param {(component: ComponentDef) => boolean} predicate
 * @returns {(page: Page) => boolean}
 */
export function isFulfilledOnPageComponent(predicate) {
  return /** @type {(page: Page) => boolean}} */ (
    (page) => {
      return hasComponents(page) && page.components.some(predicate)
    }
  )
}

/**
 * @param { ComponentType | undefined } type
 * @returns {boolean}
 */
export function isListComponentType(type) {
  return componentsSavingLists.includes(type ?? ComponentType.TextField)
}

/**
 * TypeGuard to check if component is a ListComponentsDef
 * @param { ComponentDef | undefined } component
 * @returns { component is ListComponentsDef }
 */
export function isListComponent(component) {
  return isListComponentType(component?.type)
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

  if (component.type === ComponentType.YesNoField) {
    return getYesNoList()
  }

  const listId = hasListField(component) ? component.list : undefined

  if (listId) {
    return definition.lists.find((list) => list.id === listId)
  }

  return undefined
}

/**
 * Turns a list into a string for auto complete (or keeps as a string if already a string)
 * @param { Item[] | ListItem[] | string | undefined } listItems
 */
export function mapListToTextareaStr(listItems) {
  if (typeof listItems === 'string') {
    return listItems
  }

  return (
    listItems
      ?.map(({ text, value }) => (value === text ? text : `${text}:${value}`))
      .join('\r\n') ?? ''
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

  if (!isListComponent(component)) {
    return undefined
  }

  const { id } = component

  const list = getListFromComponent(component, definition)

  if (!list) {
    return undefined
  }

  const predicate = /** @type {(component: ComponentDef) => boolean} */ (
    (currentComponent) =>
      isListComponent(currentComponent) &&
      currentComponent.id !== id &&
      currentComponent.list === list.id
  )
  const listIsNotUnique = definition.pages.some(
    isFulfilledOnPageComponent(predicate)
  )

  return listIsNotUnique ? undefined : list.id
}

/**
 * Returns an array of list ids are unique to the page
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns {string[]}
 */
export function findPageUniquelyMappedLists(definition, pageId) {
  const page = getPageFromDefinition(definition, pageId)

  return hasComponents(page)
    ? page.components.reduce((listIds, component) => {
        if (component.id !== undefined) {
          const listId = findUniquelyMappedList(
            definition,
            pageId,
            component.id
          )

          if (listId) {
            return [...listIds, listId]
          }
        }
        return listIds
      }, /** @type {string[]} */ ([]))
    : []
}

/**
 * Helper function to determine if a page has a title
 * @param {Page} page - the page id
 * @returns {boolean}
 */
export function hasPageTitle(page) {
  return !!page.title
}

/**
 * Helper function to return the count of form components on a page
 * @param {Page} page - the page
 * @returns {number}
 */
export function getFormComponentsCount(page) {
  return hasComponents(page)
    ? page.components.filter((component) => isFormType(component.type)).length
    : 0
}

/**
 * Helper function to return if a page requires a title
 * @param {Page | undefined} page - the page
 * @returns {boolean}
 */
export function requiresPageTitle(page) {
  return !!page && getFormComponentsCount(page) > 0 && !hasPageTitle(page)
}

/**
 * Helper function to determine if a payment question already exists in the form
 * @param {FormDefinition} definition - the form definition
 * @returns {boolean}
 */
export function hasPaymentQuestionInForm(definition) {
  if (definition.pages.length === 0) {
    return false
  }

  for (const page of definition.pages) {
    const hasPayment = hasComponents(page)
      ? page.components.some((comp) => comp.type === ComponentType.PaymentField)
      : false
    if (hasPayment) {
      return true
    }
  }
  return false
}

/**
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 * @import { ComponentDef, FormDefinition, Item, List, ListItem, Page, QuestionSessionState, ListComponentsDef } from '@defra/forms-model'
 * @import Wreck from '@hapi/wreck'
 */
