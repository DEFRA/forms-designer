import {
  ConditionsModel,
  ControllerType,
  convertConditionWrapperFromV2,
  getYesNoList,
  hasComponents,
  hasComponentsEvenIfNoNext,
  isConditionWrapperV2,
  yesNoListId
} from '@defra/forms-model'

import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'
import { editorv2Path, formsLibraryPath } from '~/src/models/links.js'

export const BACK_TO_ADD_AND_EDIT_PAGES = 'Back to add and edit pages'
export const BACK_TO_MANAGE_CONDITIONS = 'Back to manage conditions'
export const SAVE_AND_CONTINUE = 'Save and continue'
export const SAVE = 'Save'
export const GOVUK_LABEL__M = 'govuk-label--m'
export const GOVUK_INPUT_WIDTH_2 = 'govuk-input--width-2'
export const GOVUK_INPUT_WIDTH_3 = 'govuk-input--width-3'
export const CHANGES_SAVED_SUCCESSFULLY = 'Changes saved successfully'

/**
 * @param {FormDefinition} definition
 * @param {string} pageId
 */
export function getPageNum(definition, pageId) {
  if (pageId === 'new') {
    return (
      definition.pages.filter((x) => x.controller !== ControllerType.Summary)
        .length + 1
    )
  }
  const pageIdx = definition.pages.findIndex((x) => x.id === pageId)
  return pageIdx + 1
}

/**
 * @param {FormDefinition} definition
 * @param {string} pageId
 */
export function getQuestionsOnPage(definition, pageId) {
  const page = getPageFromDefinition(definition, pageId)
  return hasComponents(page) ? page.components : []
}

/**
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 */
export function getQuestionNum(definition, pageId, questionId) {
  const questions = getQuestionsOnPage(definition, pageId)
  if (questionId === 'new') {
    return questions.length + 1
  }
  const questionIdx = questions.findIndex((x) => x.id === questionId)
  return questionIdx === -1 ? questions.length + 1 : questionIdx + 1
}

/**
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 */
export function getQuestion(definition, pageId, questionId) {
  return /** @type {ComponentDef | undefined } */ (
    getQuestionsOnPage(definition, pageId).find((x) => x.id === questionId)
  )
}

/**
 * Returns the navigation bar items as an array. Where activePage matches
 * a page, that page will have isActive:true set.
 * @param {string} formPath
 * @param {FormMetadata} _metadata
 * @param {FormDefinition} _formDefinition
 * @param {string} activePage
 */
export function getFormSpecificNavigation(
  formPath,
  _metadata,
  _formDefinition,
  activePage = ''
) {
  const navigationItems = [
    ['Forms library', formsLibraryPath],
    ['Overview', formPath],
    ['Editor', `${formPath}/editor-v2/pages`]
  ]

  return navigationItems.map((item) =>
    buildEntry(item[0], item[1], { isActive: item[0] === activePage })
  )
}

/**
 * @param {string} slug
 * @param {string} pageTitle
 * @param {string} pageHeading
 */
export function baseModelFields(slug, pageTitle, pageHeading) {
  return {
    backLink: {
      href: editorv2Path(slug, 'pages'),
      text: BACK_TO_ADD_AND_EDIT_PAGES
    },
    pageTitle,
    pageHeading: {
      text: pageHeading,
      size: 'large'
    },
    useNewMasthead: true
  }
}

/**
 * Builds a live form URL based on its slug.
 * @param {string} slug - The unique identifier for the form.
 */
export function buildFormUrl(slug) {
  const encodedSlug = encodeURIComponent(slug)

  return `${config.previewUrl}/form/${encodedSlug}`
}

/**
 * Builds a URL for previewing a form based on its slug and status.
 * @param {string} slug - The unique identifier for the form.
 * @param {FormStatus} status - The current status of the form.
 */
export function buildPreviewUrl(slug, status) {
  const encodedSlug = encodeURIComponent(slug)
  const encodedStatus = encodeURIComponent(status)

  return `${config.previewUrl}/form/preview/${encodedStatus}/${encodedSlug}`
}

/**
 * Builds a URL for previewing error messages for a question based on its slug.
 * @param {string} slug - The unique identifier for the form.
 */
export function buildPreviewErrorsUrl(slug) {
  const encodedSlug = encodeURIComponent(slug)

  return `${config.previewUrl}/error-preview/draft/${encodedSlug}`
}

/**
 * @param {{ text?: string, value?: string, checked?: boolean }[] | undefined } items
 * @param {string[] | undefined} selectedItems
 */
export function tickBoxes(items, selectedItems) {
  if (!selectedItems?.length) {
    return items
  }

  return /** @type {{ text?: string, value?: string, checked?: boolean }[] } */ (
    items
      ? items.map((item) => {
          return {
            ...item,
            checked: selectedItems.includes(item.value ?? '')
          }
        })
      : []
  )
}

/**
 * Gets the presentation string for a V2 condition wrapper
 * @param {ConditionWrapperV2} conditionWrapper - The V2 condition wrapper
 * @param {FormDefinition} definition - The form definition containing pages, conditions, and lists
 * @returns {string} The presentation string for the condition
 */
export function toPresentationStringV2(conditionWrapper, definition) {
  const { pages, conditions, lists } = definition
  const components = pages.flatMap((p) =>
    hasComponentsEvenIfNoNext(p) ? p.components : []
  )

  const v2Conditions = /** @type {ConditionWrapperV2[]} */ (
    conditions.filter(isConditionWrapperV2)
  )

  /** @type {RuntimeFormModel} */
  const accessors = {
    getListById: (listId) => lists.find((list) => list.id === listId),
    getComponentById: (componentId) =>
      components.find((component) => component.id === componentId),
    getConditionById: (conditionId) =>
      v2Conditions.find((condition) => condition.id === conditionId)
  }

  const conditionAsV1 = convertConditionWrapperFromV2(
    conditionWrapper,
    accessors
  )
  return ConditionsModel.from(conditionAsV1.value).toPresentationString()
}

/**
 * Gets the presentation HTML for a V2 condition wrapper
 * @param {ConditionWrapperV2} conditionWrapper - The V2 condition wrapper
 * @param {FormDefinition} definition - The form definition containing pages, conditions, and lists
 * @returns {string} The presentation HTML for the condition
 */
export function toPresentationHtmlV2(conditionWrapper, definition) {
  const { pages, conditions, lists } = definition

  if (!lists.find((x) => x.id === yesNoListId)) {
    lists.push(getYesNoList())
  }

  const components = pages.flatMap((p) =>
    hasComponentsEvenIfNoNext(p) ? p.components : []
  )

  const v2Conditions = /** @type {ConditionWrapperV2[]} */ (
    conditions.filter(isConditionWrapperV2)
  )

  /** @type {RuntimeFormModel} */
  const accessors = {
    getListById: (listId) => lists.find((list) => list.id === listId),
    getComponentById: (componentId) =>
      components.find((component) => component.id === componentId),
    getConditionById: (conditionId) =>
      v2Conditions.find((condition) => condition.id === conditionId)
  }

  const conditionAsV1 = convertConditionWrapperFromV2(
    conditionWrapper,
    accessors
  )
  return ConditionsModel.from(conditionAsV1.value).toPresentationHtml()
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, FormStatus, Page, ConditionWrapperV2, RuntimeFormModel } from '@defra/forms-model'
 */
