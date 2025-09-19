import { isFormType } from '@defra/forms-model'

import { formatList } from '~/src/common/helpers/format.js'
import { findConditionsReferencingComponents } from '~/src/lib/condition-references.js'
import { deletePage, deleteQuestion } from '~/src/lib/editor.js'
import { getComponentsOnPageFromDefinition } from '~/src/lib/utils.js'

/**
 * Builds a message describing why deletion cannot proceed
 * @param {'page' | 'question'} target
 * @param {ComponentDef[]} components
 * @param {ConditionWrapperV2[]} conditions
 */
export function buildConditionUsageMessage(target, components, conditions) {
  const componentNames = [
    ...new Set(
      components
        .map((component) => component.title || component.name || component.id)
        .filter(Boolean)
    )
  ]
  const conditionNames = [
    ...new Set(
      conditions
        .map((condition) => condition.displayName || condition.id)
        .filter(Boolean)
    )
  ]

  const conditionLabel =
    conditionNames.length === 1 ? 'condition' : 'conditions'
  const conditionPronoun =
    conditionNames.length === 1 ? 'that condition' : 'those conditions'
  const conditionPhrase =
    conditionNames.length > 0
      ? `the ${conditionLabel} ${formatList(
          conditionNames.map((name) => `"${name}"`)
        )}`
      : 'existing conditions'

  if (target === 'question') {
    const questionDescriptor =
      componentNames.length === 1
        ? `The question '${componentNames[0]}'`
        : 'This question'

    return `${questionDescriptor} cannot be deleted because it is used in ${conditionPhrase}. Update or delete ${conditionPronoun} first.`
  }

  const questionPrefix =
    componentNames.length === 1 ? 'The question' : 'The questions'
  const componentLabel =
    componentNames.length > 0
      ? `${questionPrefix} ${formatList(
          componentNames.map((name) => `'${name}'`)
        )}`
      : 'Questions on this page'
  const componentVerb = componentNames.length === 1 ? 'is' : 'are'

  return `${componentLabel} ${componentVerb} used in ${conditionPhrase}, so this page cannot be deleted. Update or delete ${conditionPronoun} first.`
}

/**
 * Describes how this deletion interacts with conditions
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string | undefined} questionId
 */
export function getConditionDependencyContext(definition, pageId, questionId) {
  const components = getComponentsOnPageFromDefinition(definition, pageId)
  const formComponents = components.filter((component) =>
    isFormType(component.type)
  )

  const deletingQuestionOnly = Boolean(questionId) && formComponents.length > 1

  const componentsForDeletion = deletingQuestionOnly
    ? formComponents.filter((component) => component.id === questionId)
    : formComponents

  const componentIds = new Set(
    componentsForDeletion
      .map((component) => component.id)
      .filter((id) => id !== undefined)
  )

  const { conditions, componentIds: matchedComponentIds } =
    findConditionsReferencingComponents(definition, componentIds)

  const blockingComponents = componentsForDeletion.filter(
    (component) => component.id && matchedComponentIds.has(component.id)
  )

  return {
    deletingQuestionOnly,
    componentsForDeletion,
    blockingConditions: conditions,
    blockingComponents
  }
}

/**
 * Builds error view model for condition dependency blocking deletion
 * @param {DependencyContext} dependencyContext
 */
export function buildConditionDependencyErrorView(dependencyContext) {
  const componentsForMessage = dependencyContext.blockingComponents.length
    ? dependencyContext.blockingComponents
    : dependencyContext.componentsForDeletion

  const message = buildConditionUsageMessage(
    dependencyContext.deletingQuestionOnly ? 'question' : 'page',
    componentsForMessage,
    dependencyContext.blockingConditions
  )

  return {
    message,
    componentsForMessage
  }
}

/**
 * Handles the actual deletion operation (question or page)
 * @param {string} formId
 * @param {string} token
 * @param {string} pageId
 * @param {string | undefined} questionId
 * @param {FormDefinition} definition
 * @param {boolean} deletingQuestionOnly
 */
export async function performDeletion(
  formId,
  token,
  pageId,
  questionId,
  definition,
  deletingQuestionOnly
) {
  if (deletingQuestionOnly && questionId) {
    await deleteQuestion(formId, token, pageId, questionId, definition)
  } else {
    await deletePage(formId, token, pageId, definition)
  }
}

/**
 * @typedef {object} DependencyContext
 * @property {boolean} deletingQuestionOnly - Whether we're deleting a single question vs entire page
 * @property {ComponentDef[]} componentsForDeletion - Components that would be deleted
 * @property {ConditionWrapperV2[]} blockingConditions - Conditions that prevent deletion
 * @property {ComponentDef[]} blockingComponents - Components that are referenced by conditions
 */

/**
 * @import { ComponentDef, ConditionWrapperV2, FormDefinition } from '@defra/forms-model'
 */
