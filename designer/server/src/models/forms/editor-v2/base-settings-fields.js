import { ComponentType, questionDetailsFullSchema } from '@defra/forms-model'
import Joi from 'joi'

import { QuestionBaseSettings } from '~/src/common/constants/editor.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  tickBoxes
} from '~/src/models/forms/editor-v2/common.js'

export const baseSchema = Joi.object().keys({
  name: questionDetailsFullSchema.nameSchema,
  question: questionDetailsFullSchema.questionSchema.messages({
    '*': 'Enter a question'
  }),
  hintText: questionDetailsFullSchema.hintTextSchema,
  questionOptional: questionDetailsFullSchema.questionOptionalSchema,
  shortDescription: questionDetailsFullSchema.shortDescriptionSchema.messages({
    '*': 'Enter a short description'
  }),
  questionType: questionDetailsFullSchema.questionTypeFullSchema.messages({
    '*': 'The question type is missing'
  }),
  fileTypes: questionDetailsFullSchema.fileTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.required().messages({
      '*': 'Select the type of file you want to upload'
    })
  }),
  documentTypes: questionDetailsFullSchema.documentTypesSchema.when(
    'questionType',
    {
      is: 'FileUploadField',
      then: Joi.array().when('fileTypes', {
        is: Joi.array().has('documents'),
        then: Joi.required().messages({
          '*': 'Choose the document file types you accept'
        })
      })
    }
  ),
  imageTypes: questionDetailsFullSchema.imageTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.array().when('fileTypes', {
      is: Joi.array().has('images'),
      then: Joi.required().messages({
        '*': 'Choose the image file types you accept'
      })
    })
  }),
  tabularDataTypes: questionDetailsFullSchema.tabularDataTypesSchema.when(
    'questionType',
    {
      is: 'FileUploadField',
      then: Joi.array().when('fileTypes', {
        is: Joi.array().has('tabular-data'),
        then: Joi.required().messages({
          '*': 'Choose the tabular data file types you accept'
        })
      })
    }
  )
})

/**
 * @type {Record<keyof Omit<FormEditorGovukField, 'errorMessage'>, GovukField>}
 */
export const allBaseSettingsFields = {
  question: {
    name: 'question',
    id: 'question',
    label: {
      text: 'Question',
      classes: GOVUK_LABEL__M
    }
  },
  hintText: {
    name: 'hintText',
    id: 'hintText',
    label: {
      text: 'Hint text (optional)',
      classes: GOVUK_LABEL__M
    },
    rows: 3
  },
  questionOptional: {
    name: 'questionOptional',
    id: 'questionOptional',
    classes: 'govuk-checkboxes--small',
    items: [
      {
        value: 'true',
        text: 'Make this question optional',
        checked: false
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
    }
  },
  fileTypes: {
    id: 'fileTypes',
    name: 'fileTypes',
    idPrefix: 'fileTypes',
    fieldset: {
      legend: {
        text: 'Select the file types you accept',
        isPageHeading: false,
        classes: 'govuk-fieldset__legend--m'
      }
    }
  },
  documentTypes: {
    id: 'documentTypes',
    name: 'documentTypes',
    idPrefix: 'documentTypes'
  },
  imageTypes: {
    id: 'imageTypes',
    name: 'imageTypes',
    idPrefix: 'imageTypes'
  },
  tabularDataTypes: {
    id: 'tabularDataTypes',
    name: 'tabularDataTypes',
    idPrefix: 'tabularDataTypes'
  }
}

const allowedParentFileTypes = [
  { value: 'documents', text: 'Documents' },
  { value: 'images', text: 'Images' },
  { value: 'tabular-data', text: 'Tabular data' }
]
export const allowedDocumentTypes = [
  { value: 'pdf', text: 'PDF' },
  { value: 'doc', text: 'DOC' },
  { value: 'docx', text: 'DOCX' },
  { value: 'odt', text: 'ODT' },
  { value: 'txt', text: 'TXT' }
]
export const allowedImageTypes = [
  { value: 'jpg', text: 'JPG' },
  { value: 'jpeg', text: 'JPEG' },
  { value: 'png', text: 'PNG' }
]
export const allowedTabularDataTypes = [
  { value: 'xls', text: 'XLS' },
  { value: 'xlsx', text: 'XLSX' },
  { value: 'csv', text: 'CSV' },
  { value: 'ods', text: 'ODS' }
]

/**
 * @param {ComponentDef | undefined} question
 */
export function getSelectedFileTypes(question) {
  const isFileUpload = question?.type === ComponentType.FileUploadField

  if (!isFileUpload) {
    return {}
  }

  const selectedTypes = question.options.accept?.split(',')
  const allowedDocumentExtensions = /** @type {string[]} */ (
    allowedDocumentTypes.map((x) => x.value)
  )
  const documentTypes =
    /** @type {string[]} */
    (selectedTypes?.filter((x) => allowedDocumentExtensions.includes(x)) ?? [])

  const allowedImageExtensions = /** @type {string[]} */ (
    allowedImageTypes.map((x) => x.value)
  )
  const imageTypes =
    /** @type {string[]} */
    (selectedTypes?.filter((x) => allowedImageExtensions.includes(x)) ?? [])

  const allowedTabularDataExtensions = /** @type {string[]} */ (
    allowedTabularDataTypes.map((x) => x.value)
  )

  const tabularDataTypes =
    selectedTypes?.filter((x) => allowedTabularDataExtensions.includes(x)) ?? []

  const fileTypes = /** @type {string[]} */ ([])
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

/**
 *
 * @param { keyof Omit<FormEditorGovukField, 'errorMessage'> } fieldName
 * @param { InputFieldsComponentsDef | undefined } questionFields
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @returns {GovukField['value']}
 */
export function getFieldValue(fieldName, questionFields, validation) {
  const validationResult = validation?.formValues[fieldName]

  if (validationResult) {
    return validationResult
  }

  switch (fieldName) {
    case 'questionOptional':
      return `${questionFields?.options.required === false}`
    case 'question':
      return questionFields?.title
    case 'hintText':
      return questionFields?.hint
    case 'shortDescription':
      return questionFields?.shortDescription
  }
}

/**
 * Higher order function to
 * @param { Record<string, string[]|undefined> } fileTypes
 */
export function getFileFieldValue(fileTypes) {
  /**
   * @param { keyof Omit<FormEditorGovukField, 'errorMessage'> } fieldName
   * @param { InputFieldsComponentsDef | undefined } questionFields
   * @param { ValidationFailure<FormEditor> | undefined } validation
   * @returns {GovukField['value']}
   */
  return function (fieldName, questionFields, validation) {
    const validationResult = validation?.formValues[fieldName]

    if (validationResult) {
      return validationResult
    }

    if (
      ['fileTypes', 'documentTypes', 'imageTypes', 'tabularDataTypes'].includes(
        fieldName
      )
    ) {
      return fileTypes[fieldName]
    }

    return getFieldValue(fieldName, questionFields, validation)
  }
}

/**
 * @param { ComponentType | undefined } questionType
 * @param { InputFieldsComponentsDef | undefined } questionFields
 */
export function composeValueGetter(questionType, questionFields) {
  if (questionType === ComponentType.FileUploadField) {
    const fileTypes = getSelectedFileTypes(questionFields)

    return getFileFieldValue(fileTypes)
  }
  return getFieldValue
}

export const baseQuestionFields =
  /** @type {(keyof Omit<FormEditorGovukField, 'errorMessage'>)[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.ShortDescription
  ])

export const fileUploadFields =
  /** @type {(keyof Omit<FormEditorGovukField, 'errorMessage'>)[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.FileTypes,
    QuestionBaseSettings.ShortDescription
  ])

/**
 * @param { ComponentType | undefined } questionType
 * @returns {(keyof Omit<FormEditorGovukField, 'errorMessage'>)[]}
 */
export function getQuestionFieldList(questionType) {
  if (questionType === ComponentType.FileUploadField) {
    return fileUploadFields
  }
  return baseQuestionFields
}

/**
 * @param { InputFieldsComponentsDef | undefined } questionFields
 * @param { ComponentType | undefined } questionType
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @returns {GovukField[]}
 */
export function getFieldList(questionFields, questionType, validation) {
  const questionFieldList = getQuestionFieldList(questionType)
  const getFieldValue = composeValueGetter(questionType, questionFields)

  return questionFieldList.map((fieldName) => {
    const value = getFieldValue(fieldName, questionFields, validation)
    return {
      ...allBaseSettingsFields[fieldName],
      value,
      ...insertValidationErrors(validation?.formErrors[fieldName])
    }
  })
}

/**
 * @param { ComponentDef | undefined } questionFields
 * @param { ValidationFailure<FormEditor> | undefined } validation
 */
export function getFileUploadFields(questionFields, validation) {
  const formValues =
    /** @type { Record<keyof FormEditorGovukField, string[]>} */
    (validation?.formValues ?? getSelectedFileTypes(questionFields))

  return {
    fileTypes: {
      ...allBaseSettingsFields.fileTypes,
      items: tickBoxes(allowedParentFileTypes, formValues.fileTypes),
      ...insertValidationErrors(validation?.formErrors.fileTypes)
    },
    documentTypes: {
      ...allBaseSettingsFields.documentTypes,
      items: tickBoxes(allowedDocumentTypes, formValues.documentTypes),
      ...insertValidationErrors(validation?.formErrors.documentTypes)
    },
    imageTypes: {
      ...allBaseSettingsFields.imageTypes,
      items: tickBoxes(allowedImageTypes, formValues.imageTypes),
      ...insertValidationErrors(validation?.formErrors.imageTypes)
    },
    tabularDataTypes: {
      ...allBaseSettingsFields.tabularDataTypes,
      items: tickBoxes(allowedTabularDataTypes, formValues.tabularDataTypes),
      ...insertValidationErrors(validation?.formErrors.tabularDataTypes)
    }
  }
}

/**
 * @import { ComponentDef, FormMetadata, FormDefinition, FormEditor, FormEditorGovukField, GovukField, InputFieldsComponentsDef, TextFieldComponent } from '@defra/forms-model'
 * @import { ErrorDetails, ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
