import { ComponentType, hasComponents } from '@defra/forms-model'

import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import { formOverviewPath } from '~/src/models/links.js'

const TypeOfDelete = {
  Question: 'question',
  Page: 'page'
}

/**
 * Determines details for display in the deletion confirmation page
 * @param {ComponentDef[]} components
 * @param { Page | undefined } page
 * @param { string | undefined } questionId
 * @returns {{ bodyText: string, buttonText: string, pageTitle: string, captionText: string, cancelPath: string }}
 */
export function determineDetails(components, page, questionId) {
  const formComponents = components.filter(
    (comp, idx) => !(comp.type === ComponentType.Markdown && idx === 0)
  )

  const pageOrQuestion =
    questionId && formComponents.length > 1
      ? TypeOfDelete.Question
      : TypeOfDelete.Page

  return {
    bodyText: `You cannot recover deleted ${pageOrQuestion}s.`,
    buttonText: `Delete ${pageOrQuestion}`,
    pageTitle: `Are you sure you want to delete this ${pageOrQuestion}?`,
    captionText: determineCaptionText(formComponents, page, questionId),
    cancelPath: determineCancelPath(pageOrQuestion, components, questionId)
  }
}

/**
 * @param {ComponentDef[]} formComponents
 * @param { Page | undefined } page
 * @param { string | undefined } questionId
 * @returns {string}
 */
export function determineCaptionText(formComponents, page, questionId) {
  if (questionId) {
    const question = formComponents.find((x) => x.id === questionId)
    if (question && !page?.title) {
      return question.title
    }
  }
  return page?.title ? page.title : formComponents[0].title
}

/**
 * Determines the route to return the user back to the calling page
 * @param {string} questionOrPage
 * @param {ComponentDef[]} components
 * @param { string | undefined } questionId
 * @returns {string}
 */
export function determineCancelPath(questionOrPage, components, questionId) {
  if (questionOrPage === TypeOfDelete.Page) {
    const isGuidance =
      components.length === 1 && components[0].type === ComponentType.Markdown
    const questionReturn = questionId
      ? `question/${questionId}/details`
      : 'questions'
    return isGuidance ? `guidance/${questionId}` : questionReturn
  }
  return `question/${questionId}/details`
}

/**
 * Model to represent confirmation page dialog for a given form.
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} [questionId]
 */
export function deleteQuestionConfirmationPageViewModel(
  metadata,
  definition,
  pageId,
  questionId
) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(formPath, metadata, 'Editor')

  const page = definition.pages.find((x) => x.id === pageId)
  const components = hasComponents(page) ? page.components : []

  const { bodyText, buttonText, cancelPath, captionText, pageTitle } =
    determineDetails(components, page, questionId)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    navigation,
    pageHeading: {
      text: metadata.title
    },
    bodyCaptionText: captionText,
    bodyHeadingText: pageTitle,
    bodyText,
    buttons: [
      {
        text: buttonText,
        classes: 'govuk-button--warning'
      },
      {
        href: `${formPath}/editor-v2/page/${pageId}/${cancelPath}`,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * @import { ComponentDef, FormDefinition, FormMetadata, Page } from '@defra/forms-model'
 */
