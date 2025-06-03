import {
  ConditionsModel,
  FormStatus,
  convertConditionWrapperFromV2,
  isConditionWrapperV2
} from '@defra/forms-model'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
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
        definition.conditions
          .filter(isConditionWrapperV2)
          .find((c) => c.id === pageCondition)
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
 * Gets error-related information for question details
 * @param {GovukField[]} extraFields
 * @param {ValidationFailure<FormEditor> | undefined} validation
 * @param {ComponentType | undefined} questionType
 * @param {Function} getErrorTemplates
 * @param {Function} hasDataOrErrorForDisplay
 * @returns {{ extraFieldNames: string[], errorList: any[], errorTemplates: any, isOpen: boolean }}
 */
export function getQuestionErrorInfo(
  extraFields,
  validation,
  questionType,
  getErrorTemplates,
  hasDataOrErrorForDisplay
) {
  const extraFieldNames = extraFields.map((field) => field.name ?? 'unknown')
  const errorList = buildErrorList(validation?.formErrors)
  const errorTemplates = getErrorTemplates(questionType)
  const isOpen = hasDataOrErrorForDisplay(
    extraFieldNames,
    errorList,
    extraFields
  )

  return {
    extraFieldNames,
    errorList,
    errorTemplates,
    isOpen
  }
}

/**
 * Gets page information (titles, headings, etc.) for question details
 * @param {any} details
 * @param {string} formTitle
 * @returns {{ pageHeading: string, pageTitle: string, cardTitle: string, cardCaption: string, cardHeading: string }}
 */
export function getQuestionPageInfo(details, formTitle) {
  const pageHeading = details.pageTitle
  const pageTitle = `Edit question ${details.questionNum} - ${formTitle}`
  const cardTitle = `Question ${details.questionNum}`
  const cardCaption = `Page ${details.pageNum}`
  const cardHeading = `Edit question ${details.questionNum}`

  return {
    pageHeading,
    pageTitle,
    cardTitle,
    cardCaption,
    cardHeading
  }
}

/**
 * Gets view model configuration data (URLs, conditions, tabs, etc.)
 * @param {FormDefinition} definition
 * @param {{ metadataSlug: string, pageId: string, questionId: string, stateId: string, pagePath: string | undefined, questionFieldsOverrideId: string | undefined, currentTab: string }} config
 * @returns {{ urls: any, conditionDetails: any, allConditions: any[], tabs: any[] }}
 */
export function getQuestionViewModelData(definition, config) {
  const {
    metadataSlug,
    pageId,
    questionId,
    stateId,
    pagePath,
    questionFieldsOverrideId,
    currentTab
  } = config

  const urls = getUrlsConfiguration(
    metadataSlug,
    pageId,
    questionId,
    stateId,
    pagePath,
    questionFieldsOverrideId
  )

  const conditionDetails = getPageConditionDetails(definition, pageId)
  const allConditions = getConditionsData(definition)
  const tabs = getTabsConfiguration(currentTab)

  return {
    urls,
    conditionDetails,
    allConditions,
    tabs
  }
}

/**
 * @import { FormDefinition, ConditionWrapperV2, ComponentType, GovukField, FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
