import { YesNoField } from '@defra/forms-engine-plugin/engine/components/YesNoField.js'
import { createComponent } from '@defra/forms-engine-plugin/helpers.js'
import { ComponentType, randomId } from '@defra/forms-model'

import { QuestionTypeDescriptions } from '~/src/common/constants/editor.js'
import { getPageFromDefinition } from '~/src/lib/utils.js'
import { advancedSettingsPerComponentType } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import {
  getFieldList,
  getFileUploadFields,
  getSelectedFileTypesFromCSVMimeTypes
} from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestion,
  getQuestionNum
} from '~/src/models/forms/editor-v2/common.js'
import { enhancedFieldsPerComponentType } from '~/src/models/forms/editor-v2/enhanced-fields.js'
import { getFieldComponentType } from '~/src/models/forms/editor-v2/page-fields.js'
import { getPreviewModel } from '~/src/models/forms/editor-v2/question-details/preview.js'
import {
  advancedSettingsFields,
  enhancedFields
} from '~/src/models/forms/editor-v2/question-details-advanced-settings.js'
import {
  getQuestionErrorInfo,
  getQuestionPageInfo,
  getQuestionViewModelData
} from '~/src/models/forms/editor-v2/question-details-helper.js'
import { formOverviewPath } from '~/src/models/links.js'

const zeroIsValidForFields = [
  'maxFuture',
  'maxPast',
  'precision',
  'minFiles',
  'min',
  'max'
]

/**
 * Determines if the details section should be expanded i.e. if there is a validation error or some data populated
 * in the details section
 * @param {string[]} extraFieldNames
 * @param {ErrorDetailsItem[] | undefined} errorList
 * @param {GovukField[]} extraFields
 */
export function hasDataOrErrorForDisplay(
  extraFieldNames,
  errorList,
  extraFields
) {
  const fieldsInError = errorList ? errorList.map((x) => x.href) : []

  const errorFound = extraFieldNames.some((field) => {
    return fieldsInError.some((err) => err === `#${field}`)
  })
  if (errorFound) {
    return true
  }

  for (const fieldObj of extraFields) {
    if (fieldObj.value) {
      return true
    }
    if (
      zeroIsValidForFields.includes(fieldObj.name ?? 'unknown') &&
      fieldObj.value !== undefined
    ) {
      return true
    }
  }

  return false
}

/**
 * @param { ComponentType | undefined } questionType
 * @returns {{ baseErrors: any[], advancedSettingsErrors: any[] }}
 */
export function getErrorTemplates(questionType) {
  if (questionType === ComponentType.YesNoField) {
    return YesNoField.getAllPossibleErrors()
  }

  const component = createComponent(
    /** @type {ComponentDef} */ ({
      type: questionType ?? ComponentType.Html,
      title: 'Dummy',
      name: 'dummy',
      options: { required: true },
      schema: {}
    }),
    {}
  )

  const errorTemplates =
    'getAllPossibleErrors' in component
      ? component.getAllPossibleErrors()
      : { baseErrors: [], advancedSettingsErrors: [] }

  return errorTemplates
}

/**
 * @param { InputFieldsComponentsDef | undefined} questionFields
 */
export function mapToQuestionDetails(questionFields) {
  const fileTypes = getSelectedFileTypesFromCSVMimeTypes(questionFields)

  return {
    name: questionFields?.name ?? randomId(),
    question: questionFields?.title,
    hintText: questionFields?.hint,
    questionOptional: `${questionFields?.options.required === false}`,
    shortDescription: questionFields?.shortDescription,
    ...fileTypes
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {ComponentType | undefined} questionType
 */
export function getDetails(
  metadata,
  definition,
  pageId,
  questionId,
  questionType
) {
  const formPath = formOverviewPath(metadata.slug)
  const pageNum = getPageNum(definition, pageId)
  const page = getPageFromDefinition(definition, pageId)
  const questionNum = getQuestionNum(definition, pageId, questionId)
  const question = getQuestion(definition, pageId, questionId)

  // Override question type if it has been passed in i.e. changed as part of the route to this page
  const questionOverride = /** @type {ComponentDef} */ (
    question ?? { schema: {}, options: {} }
  )

  questionOverride.type = questionType ?? questionOverride.type

  return {
    pageTitle: metadata.title,
    navigation: getFormSpecificNavigation(
      formPath,
      metadata,
      definition,
      'Editor'
    ),
    question: questionOverride,
    questionNum,
    pageNum,
    pagePath: page?.path
  }
}

/**
 * @param {ComponentDef} question
 * @param {ValidationFailure<FormEditor> | undefined} validation
 * @returns {GovukField[]}
 */
export function getExtraFields(question, validation) {
  const extraFieldNames = /** @type {ComponentType[]} */ (
    advancedSettingsPerComponentType[question.type]
  )

  if (extraFieldNames.length) {
    return advancedSettingsFields(
      extraFieldNames,
      /** @type {TextFieldComponent} */ (question),
      validation
    )
  }
  return /** @type {GovukField[]} */ ([])
}

/**
 * @param {ComponentDef} question
 * @param {ValidationFailure<FormEditor> | undefined} validation
 * @returns {GovukField[]}
 */
export function getEnhancedFields(question, validation) {
  const extraFieldNames = /** @type {ComponentType[]} */ (
    enhancedFieldsPerComponentType[question.type]
  )

  if (extraFieldNames.length) {
    return enhancedFields(
      extraFieldNames,
      /** @type {TextFieldComponent} */ (question),
      validation
    )
  }
  return /** @type {GovukField[]} */ ([])
}

/**
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param { QuestionSessionState | undefined } state
 */
export function overrideFormValuesForEnhancedAction(validation, state) {
  if (!validation && state?.editRow?.radioId) {
    return {
      formValues: /** @type {FormEditor} */ (state.editRow),
      formErrors: {}
    }
  }

  return validation
}

/**
 * @param { QuestionSessionState | undefined } state
 * @param {ComponentDef} questionFields
 */
export function getListDetails(state, questionFields) {
  const listItems = state?.listItems ?? []
  const foundIdx = listItems.findIndex((x) => x.id === state?.editRow?.radioId)
  const rowNum = foundIdx > -1 ? foundIdx + 1 : listItems.length + 1
  const listName = 'list' in questionFields ? questionFields.list : ''
  return {
    rowNumBeingEdited: rowNum,
    list: listName
  }
}

/**
 * Gets all field-related data for question details
 * @param {ComponentDef} questionFieldsOverride
 * @param {ComponentType | undefined} questionType
 * @param {ValidationFailure<FormEditor> | undefined} validation
 * @param {FormDefinition} definition
 * @param {QuestionSessionState | undefined} state
 * @returns {{ basePageFields: any[], uploadFields: any, extraFields: GovukField[], enhancedFields: GovukField[], processedValidation: ValidationFailure<FormEditor> | undefined }}
 */
function getQuestionFieldsData(
  questionFieldsOverride,
  questionType,
  validation,
  definition,
  state
) {
  const basePageFields = getFieldList(
    /** @type {InputFieldsComponentsDef} */ (questionFieldsOverride),
    questionType,
    validation,
    definition
  )
  const uploadFields = getFileUploadFields(questionFieldsOverride, validation)
  const extraFields = /** @type {GovukField[]} */ (
    getExtraFields(questionFieldsOverride, validation)
  )

  const processedValidation = overrideFormValuesForEnhancedAction(
    validation,
    state
  )
  const enhancedFieldList = /** @type {GovukField[]} */ (
    getEnhancedFields(questionFieldsOverride, processedValidation)
  )

  return {
    basePageFields,
    uploadFields,
    extraFields,
    enhancedFields: enhancedFieldList,
    processedValidation
  }
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {string} stateId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {{ state?: QuestionSessionState, currentTab?: string, conditionsValidation?: ValidationFailure<any> }} [options]
 */
export function questionDetailsViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  stateId,
  validation,
  options = {}
) {
  const { state, currentTab = 'question', conditionsValidation } = options
  const questionType = state?.questionType
  const details = getDetails(
    metadata,
    definition,
    pageId,
    questionId,
    questionType
  )
  const formTitle = metadata.title
  const questionFieldsOverride = /** @type {ComponentDef} */ (
    state?.questionDetails ?? details.question
  )

  const fieldData = getQuestionFieldsData(
    questionFieldsOverride,
    questionType,
    validation,
    definition,
    state
  )

  const errorInfo = getQuestionErrorInfo(
    fieldData.extraFields,
    fieldData.processedValidation,
    questionType,
    getErrorTemplates,
    hasDataOrErrorForDisplay
  )

  const pageInfo = getQuestionPageInfo(details, formTitle)

  const viewModelData = getQuestionViewModelData(definition, {
    metadataSlug: metadata.slug,
    pageId,
    questionId,
    stateId,
    pagePath: details.pagePath,
    questionFieldsOverrideId: questionFieldsOverride.id,
    currentTab
  })

  return buildQuestionDetailsViewModel(
    { details, fieldData, errorInfo, pageInfo, viewModelData },
    { state, questionFieldsOverride, questionType },
    { questionId, stateId, metadataSlug: metadata.slug, currentTab },
    conditionsValidation
  )
}

/**
 * Builds the final question details view model object
 * @param {{ details: any, fieldData: any, errorInfo: any, pageInfo: any, viewModelData: any }} dataObjects
 * @param {{ state: any, questionFieldsOverride: ComponentDef, questionType: ComponentType | undefined }} questionData
 * @param {{ questionId: string, stateId: string, metadataSlug: string, currentTab: string }} identifiers
 * @param {ValidationFailure<any> | undefined} conditionsValidation
 * @returns {{ questionType: ComponentType, [key: string]: any }}
 */
function buildQuestionDetailsViewModel(
  dataObjects,
  questionData,
  identifiers,
  conditionsValidation
) {
  const { details, fieldData, errorInfo, pageInfo, viewModelData } = dataObjects
  const { state, questionFieldsOverride, questionType } = questionData
  const { questionId, stateId, metadataSlug, currentTab } = identifiers

  return {
    listDetails: getListDetails(state, questionFieldsOverride),
    state,
    enhancedFields: fieldData.enhancedFields,
    ...baseModelFields(metadataSlug, pageInfo.pageTitle, pageInfo.pageHeading),
    name: details?.question?.name ?? randomId(),
    questionId,
    stateId,
    basePageFields: fieldData.basePageFields,
    uploadFields: fieldData.uploadFields,
    extraFields: fieldData.extraFields,
    errorTemplates: errorInfo.errorTemplates,
    cardTitle: pageInfo.cardTitle,
    cardCaption: pageInfo.cardCaption,
    cardHeading: pageInfo.cardHeading,
    navigation: details.navigation,
    errorList: errorInfo.errorList,
    formErrors: fieldData.processedValidation?.formErrors,
    formValues: fieldData.processedValidation?.formValues,
    model: getPreviewModel(fieldData.basePageFields, state, questionType),
    questionType: questionFieldsOverride.type,
    questionTypeDesc: QuestionTypeDescriptions.find(
      (x) => x.type === questionFieldsOverride.type
    )?.description,
    changeTypeUrl: viewModelData.urls.changeTypeUrl,
    buttonText: SAVE_AND_CONTINUE,
    previewPageUrl: viewModelData.urls.previewPageUrl,
    previewErrorsUrl: viewModelData.urls.previewErrorsUrl,
    deleteUrl: viewModelData.urls.deleteUrl,
    isOpen: errorInfo.isOpen,
    getFieldType: (/** @type {GovukField} */ field) =>
      getFieldComponentType(field),
    tabs: viewModelData.tabs,
    currentTab,
    pageCondition: viewModelData.conditionDetails.pageCondition,
    pageConditionDetails: viewModelData.conditionDetails.pageConditionDetails,
    pageConditionPresentationString:
      viewModelData.conditionDetails.pageConditionPresentationString,
    allConditions: viewModelData.allConditions,
    conditionsManagerPath: viewModelData.urls.conditionsManagerPath,
    pageConditionsApiUrl: viewModelData.urls.pageConditionsApiUrl,
    conditionsFormErrors: conditionsValidation?.formErrors,
    conditionsFormValues: conditionsValidation?.formValues
  }
}

/**
 * @import { ComponentDef, QuestionSessionState, FormMetadata, FormDefinition, FormEditor, GovukField, InputFieldsComponentsDef, TextFieldComponent, ConditionWrapperV2 } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
