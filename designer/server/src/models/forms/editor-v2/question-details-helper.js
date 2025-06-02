import {
  ConditionsModel,
  FormStatus,
  convertConditionWrapperFromV2,
  isConditionWrapperV2
} from '@defra/forms-model'

import { createRuntimeFormModel } from '~/src/lib/utils.js'
import {
  buildPreviewErrorsUrl,
  buildPreviewUrl
} from '~/src/models/forms/editor-v2/common.js'
import { editorv2Path } from '~/src/models/links.js'

/**
 * Gets page condition details and presentation string
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns {{ pageCondition: string | undefined, pageConditionDetails: ConditionWrapperV2 | undefined, pageConditionPresentationString: string | null }}
 */
export function getPageConditionDetails(definition, pageId) {
  const page = definition.pages.find((p) => p.id === pageId)
  const pageCondition = page?.condition
  const pageConditionDetails = pageCondition
    ? /** @type {ConditionWrapperV2 | undefined} */ (
        definition.conditions.find((c) => c.name === pageCondition)
      )
    : undefined

  let pageConditionPresentationString = null
  if (pageConditionDetails) {
    const accessors = createRuntimeFormModel(definition)

    const conditionAsV1 = convertConditionWrapperFromV2(
      /** @type {ConditionWrapperV2} */ (pageConditionDetails),
      accessors
    )
    pageConditionPresentationString = ConditionsModel.from(
      conditionAsV1.value
    ).toPresentationString()
  }

  return {
    pageCondition,
    pageConditionDetails,
    pageConditionPresentationString
  }
}

/**
 * Gets filtered and sorted V2 conditions
 * @param {FormDefinition} definition
 * @returns {ConditionWrapperV2[]}
 */
export function getConditionsData(definition) {
  return definition.conditions
    .filter(isConditionWrapperV2)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}

/**
 * Gets tabs configuration
 * @param {string} currentTab
 * @returns {Array<{ id: string, label: string, active: boolean }>}
 */
export function getTabsConfiguration(currentTab) {
  return [
    {
      id: 'question',
      label: 'Question',
      active: currentTab === 'question'
    },
    {
      id: 'conditions',
      label: 'Conditions',
      active: currentTab === 'conditions'
    }
  ]
}

/**
 * Gets URL configuration for the question details
 * @param {string} metadataSlug
 * @param {string} pageId
 * @param {string} questionId
 * @param {string} stateId
 * @param {string | undefined} pagePath
 * @param {string | undefined} questionFieldsOverrideId
 * @returns {{ previewPageUrl: string, previewErrorsUrl: string, deleteUrl: string, changeTypeUrl: string, conditionsManagerPath: string, pageConditionsApiUrl: string }}
 */
export function getUrlsConfiguration(
  metadataSlug,
  pageId,
  questionId,
  stateId,
  pagePath,
  questionFieldsOverrideId
) {
  const previewPageUrl = `${buildPreviewUrl(metadataSlug, FormStatus.Draft)}${pagePath}?force`
  const previewErrorsUrl = `${buildPreviewErrorsUrl(metadataSlug)}${pagePath}/${questionFieldsOverrideId}`
  const urlPageBase = editorv2Path(metadataSlug, `page/${pageId}`)
  const deleteUrl = `${urlPageBase}/delete/${questionId}`
  const changeTypeUrl = `${urlPageBase}/question/${questionId}/type/${stateId}`
  const conditionsManagerPath = editorv2Path(metadataSlug, 'conditions')
  const pageConditionsApiUrl = editorv2Path(
    metadataSlug,
    `page/${pageId}/conditions`
  )

  return {
    previewPageUrl,
    previewErrorsUrl,
    deleteUrl,
    changeTypeUrl,
    conditionsManagerPath,
    pageConditionsApiUrl
  }
}

/**
 * @import { FormDefinition, ConditionWrapperV2 } from '@defra/forms-model'
 */
