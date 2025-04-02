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
  buildPreviewUrl,
  getFormSpecificNavigation,
  getPageNum,
  getQuestion,
  getQuestionNum
} from '~/src/models/forms/editor-v2/common.js'
import { enhancedFieldsPerComponentType } from '~/src/models/forms/editor-v2/enhanced-fields.js'
import { getFieldComponentType } from '~/src/models/forms/editor-v2/page-fields.js'
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
 */
export function getRowNumBeingEdited(state) {
  const listItems = state?.listItems ?? []
  const foundIdx = listItems.findIndex((x) => x.id === state?.editRow?.radioId)
  if (foundIdx > -1) {
    return foundIdx + 1
  }

  return listItems.length + 1
}

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {ValidationFailure<FormEditor>} [validation]
 * @param {QuestionSessionState} [state]
 */
export function questionDetailsViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  validation,
  state
) {
  const questionType = state?.questionType
  const {
    pageTitle,
    navigation,
    question: questionFields,
    pageNum,
    questionNum,
    pagePath
  } = getDetails(metadata, definition, pageId, questionId, questionType)

  const questionFieldsOverride = /** @type {ComponentDef} */ (
    state?.questionDetails ?? questionFields
  )

  const { formErrors } = validation ?? {}

  const basePageFields = getFieldList(
    /** @type {InputFieldsComponentsDef} */ (questionFieldsOverride),
    questionType,
    validation
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
  const errorList = buildErrorList(formErrors)
  const previewPageUrl = `${buildPreviewUrl(metadata.slug)}${pagePath}?force`
  const rowNumBeingEdited = getRowNumBeingEdited(state)

  return {
    rowNumBeingEdited,
    state,
    enhancedFields: enhancedFieldList,
    ...baseModelFields(metadata.slug, pageTitle),
    name: questionFields.name || randomId(),
    basePageFields,
    uploadFields,
    extraFields,
    cardTitle: `Question ${questionNum}`,
    cardCaption: `Page ${pageNum}`,
    cardHeading: `Edit question ${questionNum}`,
    navigation,
    errorList,
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionType: questionFieldsOverride.type,
    questionTypeDesc: QuestionTypeDescriptions.find(
      (x) => x.type === questionFieldsOverride.type
    )?.description,
    changeTypeUrl: editorv2Path(
      metadata.slug,
      `page/${pageId}/question/${questionId}`
    ),
    buttonText: SAVE_AND_CONTINUE,
    previewPageUrl,
    isOpen: hasDataOrErrorForDisplay(extraFieldNames, errorList, extraFields),
    getFieldType: (/** @type {GovukField} */ field) =>
      getFieldComponentType(field),
    deleteUrl: editorv2Path(
      metadata.slug,
      `page/${pageId}/delete/${questionId}`
    )
  }
}

/**
 * @import { ComponentType, ComponentDef, QuestionSessionState, FormMetadata, FormDefinition, FormEditor, GovukField, InputFieldsComponentsDef, TextFieldComponent } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
