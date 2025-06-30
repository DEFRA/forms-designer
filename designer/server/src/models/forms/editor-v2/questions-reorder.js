import { getComponentsOnPageFromDefinition } from '~/src/lib/utils.js'
import {
  baseModelFields,
  getFormSpecificNavigation
} from '~/src/models/forms/editor-v2/common.js'
import {
  constructReorderPage,
  excludeEndPages,
  orderPages
} from '~/src/models/forms/editor-v2/pages-helper.js'
import { formOverviewPath } from '~/src/models/links.js'

/**
 * @param {FormDefinition} definition
 * @param {string} questionOrder
 * @param {{ button: string | undefined, pageId: string | undefined} | undefined} focus
 */
export function mapQuestionData(definition, questionOrder, focus) {
  if (!definition.pages.length) {
    return definition
  }

  const orderableQuestions = getComponentsOnPageFromDefinition(definition, pageId)

  const orderedQuestions = orderQuestions(orderableQuestions, questionOrder)

  return {
    ...definition,
    pages: orderedPages.map((page) => {
      return constructReorderPage(page, focus)
    })
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} questionOrder
 * @param {{ button: string | undefined, pageId: string | undefined } | undefined } focus
 */
export function questionsReorderViewModel(metadata, definition, questionOrder, focus) {
  const formTitle = metadata.title
  const pageHeading = 'Re-order questions'
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    definition,
    'Editor'
  )

  const pageActions = [
    {
      name: 'saveChanges',
      text: 'Save changes',
      classes: 'govuk-button--inverse',
      value: 'true',
      type: 'submit'
    }
  ]

  return {
    ...baseModelFields(
      metadata.slug,
      `${pageHeading} - ${formTitle}`,
      pageHeading
    ),
    ...mapQuestionData(definition, questionOrder, focus),
    formSlug: metadata.slug,
    navigation,
    pageCaption: {
      text: definition.name
    },
    pageDescription: {
      text: 'Use the up and down buttons or drag and drop questions to re-order them.'
    },
    pageActions,
    questionOrder
  }
}

/**
 * @import { FormMetadata, FormDefinition } from '@defra/forms-model'
 */
