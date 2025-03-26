import { ComponentType, randomId } from '@defra/forms-model'

import { QuestionTypeDescriptions } from '~/src/common/constants/editor.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import { advancedSettingsPerComponentType } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import {
  getFieldList,
  getFileUploadFields,
  getSelectedFileTypesFromCSV
} from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestion,
  getQuestionNum,
  tickBoxes
} from '~/src/models/forms/editor-v2/common.js'
import { getFieldComponentType } from '~/src/models/forms/editor-v2/page-fields.js'
import { advancedSettingsFields } from '~/src/models/forms/editor-v2/question-details-advanced-settings.js'
import { editorv2Path, formOverviewPath } from '~/src/models/links.js'

const allowedParentFileTypes = [
  { value: 'documents', text: 'Documents' },
  { value: 'images', text: 'Images' },
  { value: 'tabular-data', text: 'Tabular data' }
]

const allowedDocumentTypes = [
  { value: 'pdf', text: 'PDF' },
  { value: 'doc', text: 'DOC' },
  { value: 'docx', text: 'DOCX' },
  { value: 'odt', text: 'ODT' },
  { value: 'txt', text: 'TXT' }
]

const allowedImageTypes = [
  { value: 'jpg', text: 'JPG' },
  { value: 'jpeg', text: 'JPEG' },
  { value: 'png', text: 'PNG' }
]

const allowedTabularDataTypes = [
  { value: 'xls', text: 'XLS' },
  { value: 'xlsx', text: 'XLSX' },
  { value: 'csv', text: 'CSV' },
  { value: 'ods', text: 'ODS' }
]

/**
 * @param {InputFieldsComponentsDef | undefined} question
 */
export function getSelectedFileTypes(question) {
  const isFileUpload = question?.type === ComponentType.FileUploadField

  if (!isFileUpload) {
    return {}
  }

  const selectedTypes = question.options.accept?.split(',')
  const allowedDocumentExtensions = allowedDocumentTypes.map((x) => x.value)
  const documentTypes =
    selectedTypes?.filter((x) => allowedDocumentExtensions.includes(x)) ?? []

  const allowedImageExtensions = allowedImageTypes.map((x) => x.value)
  const imageTypes =
    selectedTypes?.filter((x) => allowedImageExtensions.includes(x)) ?? []

  const allowedTabularDataExtensions = allowedTabularDataTypes.map(
    (x) => x.value
  )
  const tabularDataTypes =
    selectedTypes?.filter((x) => allowedTabularDataExtensions.includes(x)) ?? []

  const fileTypes = []
  if (documentTypes.length) {
    fileTypes.push('documents')
  }
  if (imageTypes.length) {
    fileTypes.push('images')
  }
  if (tabularDataTypes.length) {
    fileTypes.push('tabular-data')
  }

  return {
    fileTypes,
    documentTypes,
    imageTypes,
    tabularDataTypes
  }
}

const zeroIsValidForFields = ['maxFuture', 'maxPast', 'precision']

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
  const fileTypes = getSelectedFileTypesFromCSV(questionFields)

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
 * @param {{ fields: FormEditorGovukField }} fields
 * @param {ComponentType} questionType
 * @param {{ tabularDataTypes?: string[] | undefined; imageTypes?: string[] | undefined; documentTypes?: string[] | undefined; fileTypes?: string[] | undefined; name: string; question: string | undefined; hintText: string | undefined; questionOptional: string; shortDescription: string | undefined; }} formValues
 * @param { ErrorDetails | undefined } formErrors
 */
export function addFileUploadFields(
  fields,
  questionType,
  formValues,
  formErrors
) {
  if (questionType === ComponentType.FileUploadField) {
    // Causes side-effects
    fields.fields.fileTypes = {
      id: 'fileTypes',
      name: 'fileTypes',
      idPrefix: 'fileTypes',
      fieldset: {
        legend: {
          text: 'Select the file types you accept',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: tickBoxes(allowedParentFileTypes, formValues.fileTypes),
      ...insertValidationErrors(formErrors?.fileTypes)
    }

    fields.fields.documentTypes = {
      id: 'documentTypes',
      name: 'documentTypes',
      idPrefix: 'documentTypes',
      items: tickBoxes(allowedDocumentTypes, formValues.documentTypes),
      ...insertValidationErrors(formErrors?.documentTypes)
    }

    fields.fields.imageTypes = {
      id: 'imageTypes',
      name: 'imageTypes',
      idPrefix: 'imageTypes',
      items: tickBoxes(allowedImageTypes, formValues.imageTypes),
      ...insertValidationErrors(formErrors?.imageTypes)
    }

    fields.fields.tabularDataTypes = {
      id: 'tabularDataTypes',
      name: 'tabularDataTypes',
      idPrefix: 'tabularDataTypes',
      items: tickBoxes(allowedTabularDataTypes, formValues.tabularDataTypes),
      ...insertValidationErrors(formErrors?.tabularDataTypes)
    }
  }

  return fields
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
    pageNum
  }
}
/**
 * @param {ComponentDef} question
 * @param {ValidationFailure<FormEditor> | undefined} validation
 * @returns {GovukField[]}
 */
export function getExtraFields(question, validation) {
  const extraFieldNames = /** @type {string[]} */ (
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
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @param {string} questionId
 * @param {ComponentType | undefined} questionTypeBase
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionDetailsViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  questionTypeBase,
  validation
) {
  const {
    pageTitle,
    navigation,
    question: questionFields,
    pageNum,
    questionNum
  } = getDetails(metadata, definition, pageId, questionId, questionTypeBase)

  const questionType = questionTypeBase ?? questionFields.type

  const { formErrors } = validation ?? {}

  const basePageFields = getFieldList(
    /** @type {InputFieldsComponentsDef} */ (questionFields),
    questionType,
    validation
  )

  const uploadFields = getFileUploadFields(questionFields, validation)
  const extraFields = /** @type {GovukField[]} */ (
    getExtraFields(questionFields, validation)
  )

  const extraFieldNames = extraFields.map((field) => field.name ?? 'unknown')
  const allFieldNames = Object.keys(basePageFields).concat(extraFieldNames)
  const errorList = buildErrorList(formErrors, allFieldNames)

  return {
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
    questionType: questionFields.type,
    questionTypeDesc: QuestionTypeDescriptions.find(
      (x) => x.type === questionFields.type
    )?.description,
    changeTypeUrl: editorv2Path(
      metadata.slug,
      `page/${pageId}/question/${questionId}`
    ),
    buttonText: SAVE_AND_CONTINUE,
    isOpen: hasDataOrErrorForDisplay(extraFieldNames, errorList, extraFields),
    getFieldType: (/** @type {GovukField} */ field) =>
      getFieldComponentType(field)
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, FormEditor, FormEditorGovukField, GovukField, InputFieldsComponentsDef, TextFieldComponent } from '@defra/forms-model'
 * @import { ErrorDetails, ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
