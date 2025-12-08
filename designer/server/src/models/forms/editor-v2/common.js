import { hasComponents, isFormType, isSummaryPage } from '@defra/forms-model'

import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'
import {
  editorv2Path,
  formsLibraryPath,
  formsSupportPath
} from '~/src/models/links.js'

export const BACK_TO_ADD_AND_EDIT_PAGES = 'Back to add and edit pages'
export const BACK_TO_MANAGE_CONDITIONS = 'Back to conditions'
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
    return definition.pages.filter((x) => !isSummaryPage(x)).length + 1
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
  const questions = getQuestionsOnPage(definition, pageId).filter(
    (q) => isFormType(q.type) // Exclude non-form components such as Markdown
  )
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
    ['Editor', `${formPath}/editor-v2/pages`],
    ['Support', formsSupportPath]
  ]

  return navigationItems.map(([menuName, path]) =>
    buildEntry(menuName, path, { isActive: menuName === activePage })
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
 * Get the Check Your Answers (Summary) page ID from the definition
 * @param {FormDefinition} definition
 * @returns {string | undefined}
 */
export function getCyaPageId(definition) {
  const cyaPage = definition.pages.find((page) => isSummaryPage(page))
  return cyaPage?.id
}

/**
 * @typedef {object} SectionInfo
 * @property {string} id - The section ID
 * @property {string} title - The section title
 * @property {boolean} hideTitle - Whether the section title is hidden
 * @property {string} changeUrl - URL to change section assignment
 */

/**
 * Get section information for a page
 * @param {FormDefinition} definition
 * @param {Page} page
 * @param {string} slug
 * @returns {SectionInfo | undefined}
 */
export function getSectionForPage(definition, page, slug) {
  if (!page.section) {
    return undefined
  }

  const section = definition.sections.find((s) => s.id === page.section)
  if (!section) {
    return undefined
  }

  const cyaPageId = getCyaPageId(definition)
  const changeUrl = cyaPageId
    ? editorv2Path(slug, `page/${cyaPageId}/check-answers-settings/sections`)
    : ''

  return {
    id: section.id ?? '',
    title: section.title,
    hideTitle: section.hideTitle ?? false,
    changeUrl
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, Page } from '@defra/forms-model'
 */
