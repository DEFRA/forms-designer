import { randomId } from '@defra/forms-model'

import { QuestionTypeDescriptions } from '~/src/common/constants/editor.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
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
  buildPreviewErrorsUrl,
  buildPreviewUrl,
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
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

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
    navigation: getFormSpecificNavigation(formPath, metadata, 'Editor'),
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
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {string} stateId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {QuestionSessionState} [state]
 */
export function questionDetailsViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  stateId,
  validation,
  state
) {
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
  validation = overrideFormValuesForEnhancedAction(validation, state)
  const enhancedFieldList = /** @type {GovukField[]} */ (
    getEnhancedFields(questionFieldsOverride, validation)
  )
  const extraFieldNames = extraFields.map((field) => field.name ?? 'unknown')
  const errorList = buildErrorList(validation?.formErrors)
  const previewPageUrl = `${buildPreviewUrl(metadata.slug)}${details.pagePath}?force`
  const previewErrorsUrl = `${buildPreviewErrorsUrl(metadata.slug)}${details.pagePath}/${questionFieldsOverride.id}`
  const urlPageBase = editorv2Path(metadata.slug, `page/${pageId}`)
  const deleteUrl = `${urlPageBase}/delete/${questionId}`
  const changeTypeUrl = `${urlPageBase}/question/${questionId}/type/${stateId}`
  const pageHeading = details.pageTitle
  const pageTitle = `Edit question ${details.questionNum} - ${formTitle}`
  const model = getPreviewModel(basePageFields, questionType)
  return {
    listDetails: getListDetails(state, questionFieldsOverride),
    state,
    enhancedFields: enhancedFieldList,
    ...baseModelFields(metadata.slug, pageTitle, pageHeading),
    name: details.question.name || randomId(),
    questionId,
    basePageFields,
    uploadFields,
    extraFields,
    cardTitle: `Question ${details.questionNum}`,
    cardCaption: `Page ${details.pageNum}`,
    cardHeading: `Edit question ${details.questionNum}`,
    navigation: details.navigation,
    errorList,
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    model,
    json: JSON.stringify(model),
    questionType: questionFieldsOverride.type,
    questionTypeDesc: QuestionTypeDescriptions.find(
      (x) => x.type === questionFieldsOverride.type
    )?.description,
    changeTypeUrl,
    buttonText: SAVE_AND_CONTINUE,
    previewPageUrl,
    previewErrorsUrl,
    deleteUrl,
    isOpen: hasDataOrErrorForDisplay(extraFieldNames, errorList, extraFields),
    getFieldType: (/** @type {GovukField} */ field) =>
      getFieldComponentType(field)
  }
}

/**
 * @import { ComponentType, ComponentDef, QuestionSessionState, FormMetadata, FormDefinition, FormEditor, GovukField, InputFieldsComponentsDef, TextFieldComponent } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
