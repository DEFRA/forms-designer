import { ComponentType, randomId } from '@defra/forms-model'

import { QuestionTypeDescriptions } from '~/src/common/constants/editor.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { insertValidationErrors, isCheckboxSelected } from '~/src/lib/utils.js'
import {
  advancedSettingsPerComponentType,
  getFieldComponentType
} from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import {
  GOVUK_LABEL__M,
  SAVE_AND_CONTINUE,
  baseModelFields,
  getFormSpecificNavigation,
  getPageNum,
  getQuestion,
  getQuestionNum,
  tickBoxes
} from '~/src/models/forms/editor-v2/common.js'
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
    return {
      fileTypes: undefined,
      documentTypes: undefined,
      imageTypes: undefined,
      tabularDataTypes: undefined
    }
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
    fileTypes: { fileTypes },
    documentTypes: { documentTypes },
    imageTypes: { imageTypes },
    tabularDataTypes: { tabularDataTypes }
  }
}

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
  }

  return false
}

/**
 * @param { InputFieldsComponentsDef | undefined} question
 */
export function mapToQuestionDetails(question) {
  const { fileTypes, documentTypes, imageTypes, tabularDataTypes } =
    getSelectedFileTypes(question)

  return {
    name: question?.name ?? randomId(),
    question: question?.title,
    hintText: question?.hint,
    questionOptional: `${question?.options.required === false}`,
    shortDescription: question?.shortDescription,
    ...fileTypes,
    ...documentTypes,
    ...imageTypes,
    ...tabularDataTypes
  }
}

/**
 * @param { InputFieldsComponentsDef | undefined } question
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
function questionDetailsFields(question, validation) {
  const formValues = validation?.formValues ?? mapToQuestionDetails(question)
  const fields = /** @type {{ fields: FormEditorGovukField }} */ ({
    fields: {
      name: {
        value: formValues.name
      },
      question: {
        name: 'question',
        id: 'question',
        label: {
          text: 'Question',
          classes: GOVUK_LABEL__M
        },
        value: formValues.question,
        ...insertValidationErrors(validation?.formErrors.question)
      },
      hintText: {
        name: 'hintText',
        id: 'hintText',
        label: {
          text: 'Hint text (optional)',
          classes: GOVUK_LABEL__M
        },
        rows: 3,
        value: formValues.hintText,
        ...insertValidationErrors(validation?.formErrors.hintText)
      },
      questionOptional: {
        name: 'questionOptional',
        id: 'questionOptional',
        classes: 'govuk-checkboxes--small',
        items: [
          {
            value: 'true',
            text: 'Make this question optional',
            checked: isCheckboxSelected(formValues.questionOptional)
          }
        ]
      },
      shortDescription: {
        id: 'shortDescription',
        name: 'shortDescription',
        idPrefix: 'shortDescription',
        label: {
          text: 'Short description',
          classes: GOVUK_LABEL__M
        },
        hint: {
          text: "Enter a short description for this question like 'licence period'. Short descriptions are used in error messages and on the check your answers page."
        },
        value: formValues.shortDescription,
        ...insertValidationErrors(validation?.formErrors.shortDescription)
      }
    }
  })

  if (question?.type === ComponentType.FileUploadField) {
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
      ...insertValidationErrors(validation?.formErrors.fileTypes)
    }

    fields.fields.documentTypes = {
      id: 'documentTypes',
      name: 'documentTypes',
      idPrefix: 'documentTypes',
      items: tickBoxes(allowedDocumentTypes, formValues.documentTypes),
      ...insertValidationErrors(validation?.formErrors.documentTypes)
    }

    fields.fields.imageTypes = {
      id: 'imageTypes',
      name: 'imageTypes',
      idPrefix: 'imageTypes',
      items: tickBoxes(allowedImageTypes, formValues.imageTypes),
      ...insertValidationErrors(validation?.formErrors.imageTypes)
    }

    fields.fields.tabularDataTypes = {
      id: 'tabularDataTypes',
      name: 'tabularDataTypes',
      idPrefix: 'tabularDataTypes',
      items: tickBoxes(allowedTabularDataTypes, formValues.tabularDataTypes),
      ...insertValidationErrors(validation?.formErrors.tabularDataTypes)
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
 * @param {ComponentType | undefined} questionType
 * @param {ValidationFailure<FormEditor>} [validation]
 */
export function questionDetailsViewModel(
  metadata,
  definition,
  pageId,
  questionId,
  questionType,
  validation
) {
  const { pageTitle, navigation, question, pageNum, questionNum } = getDetails(
    metadata,
    definition,
    pageId,
    questionId,
    questionType
  )

  const { formErrors } = validation ?? {}

  const baseFields = questionDetailsFields(
    /** @type {InputFieldsComponentsDef} */ (question),
    validation
  )

  const extraFields = /** @type {GovukField[]} */ (
    getExtraFields(question, validation)
  )

  const extraFieldNames = extraFields.map((field) => field.name ?? 'unknown')
  const allFieldNames = Object.keys(baseFields).concat(extraFieldNames)
  const errorList = buildErrorList(formErrors, allFieldNames)

  return {
    ...baseModelFields(metadata.slug, pageTitle),
    fields: baseFields.fields,
    extraFields,
    cardTitle: `Question ${questionNum}`,
    cardCaption: `Page ${pageNum}`,
    cardHeading: `Edit question ${questionNum}`,
    navigation,
    errorList,
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    questionType: question.type,
    questionTypeDesc: QuestionTypeDescriptions.find(
      (x) => x.type === question.type
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
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
