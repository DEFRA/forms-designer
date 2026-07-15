import { isFormType } from '~/src/components/helpers.js'
import {
  getPageFromDefinition,
  hasComponents,
  isSummaryPage
} from '~/src/pages/helpers.js'

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
 * @import { FormDefinition } from '~/src/form/form-definition/types.js'
 */
