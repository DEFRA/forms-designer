import { ControllerType, hasComponents } from '@defra/forms-model'

import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import config from '~/src/config.js'
import { editorv2Path, formsLibraryPath } from '~/src/models/links.js'

export const BACK_TO_ADD_AND_EDIT_PAGES = 'Back to add and edit pages'
export const SAVE_AND_CONTINUE = 'Save and continue'
export const SAVE = 'Save'
export const GOVUK_LABEL__M = 'govuk-label--m'
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
  const page = definition.pages.find((x) => x.id === pageId)
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
 * @param {string} activePage
 */
export function getFormSpecificNavigation(
  formPath,
  _metadata,
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
 */
export function baseModelFields(slug, pageTitle) {
  return {
    backLink: {
      href: editorv2Path(slug, 'pages'),
      text: BACK_TO_ADD_AND_EDIT_PAGES
    },
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    useNewMasthead: true
  }
}

/**
 * @param {string} slug
 */
export function buildPreviewUrl(slug) {
  return `${config.previewUrl}/preview/draft/${slug}`
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition } from '@defra/forms-model'
 */
