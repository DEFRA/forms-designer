import {
  ComponentType,
  autoCompleteOptionsSchema,
  questionDetailsFullSchema
} from '@defra/forms-model'
import Joi from 'joi'

import { QuestionBaseSettings } from '~/src/common/constants/editor.js'
import {
  getListFromComponent,
  insertValidationErrors,
  mapListToAutoCompleteStr
} from '~/src/lib/utils.js'
import {
  GOVUK_LABEL__M,
  tickBoxes
} from '~/src/models/forms/editor-v2/common.js'

const TABULAR_DATA = 'tabular-data'
const DOCUMENTS = 'documents'
const IMAGES = 'images'

export const baseSchema = Joi.object().keys({
  name: questionDetailsFullSchema.nameSchema,
  question: questionDetailsFullSchema.questionSchema.when('enhancedAction', {
    is: Joi.exist(),
    then: Joi.string().optional().allow(''),
    otherwise: Joi.string().trim().required().messages({
      '*': 'Enter a question'
    })
  }),
  hintText: questionDetailsFullSchema.hintTextSchema,
  questionOptional: questionDetailsFullSchema.questionOptionalSchema,
  shortDescription: questionDetailsFullSchema.shortDescriptionSchema.when(
    'enhancedAction',
    {
      is: Joi.exist(),
      then: Joi.string().optional().allow(''),
      otherwise: Joi.string().trim().required().messages({
        '*': 'Enter a short description'
      })
    }
  ),
  questionType: questionDetailsFullSchema.questionTypeFullSchema.messages({
    '*': 'The question type is missing'
  }),
  list: questionDetailsFullSchema.listForQuestionSchema,
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
        is: Joi.array().has(DOCUMENTS),
        then: Joi.required().messages({
          '*': 'Choose the document file types you accept'
        })
      })
    }
  ),
  imageTypes: questionDetailsFullSchema.imageTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.array().when('fileTypes', {
      is: Joi.array().has(IMAGES),
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
        is: Joi.array().has(TABULAR_DATA),
        then: Joi.required().messages({
          '*': 'Choose the tabular data file types you accept'
        })
      })
    }
  ),
  enhancedAction: questionDetailsFullSchema.enhancedActionSchema,
  radioId: questionDetailsFullSchema.radioIdSchema,
  radioText: questionDetailsFullSchema.radioTextSchema.when('enhancedAction', {
    is: Joi.exist(),
    then: Joi.string().when('enhancedAction', {
      is: Joi.string().valid('add-item', 're-order'),
      then: Joi.string().optional().allow(''),
      otherwise: Joi.string().trim().required().messages({
        '*': 'Enter item text'
      })
    }),
    otherwise: Joi.string().optional().allow('')
  }),
  radioHint: questionDetailsFullSchema.radioHintSchema,
  radioValue: questionDetailsFullSchema.radioValueSchema,
  autoCompleteOptions: questionDetailsFullSchema.autoCompleteOptionsSchema.when(
    'questionType',
    {
      is: 'AutocompleteField',
      then: autoCompleteOptionsSchema.messages({
        'array.min': 'Enter at least one option for users to choose from',
        'array.includes': 'Enter options separated by a colon',
        'dsv.invalid': 'Enter options separated by a colon',
        'string.min': 'Enter at least one character',
        'string.empty': 'Enter at least one character',
        'array.unique': 'Duplicate option found'
      }),
      otherwise: Joi.forbidden()
    }
  )
})

/**
 * @type {FormEditorGovukFieldBase}
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
    },
    customTemplate: 'file-types'
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
  },
  radiosOrCheckboxes: {
    id: 'radiosOrCheckboxes',
    name: 'radiosOrCheckboxes',
    customTemplate: 'radios-or-checkboxes'
  },
  autoCompleteOptions: {
    id: 'autoCompleteOptions',
    name: 'autoCompleteOptions',
    idPrefix: 'autoCompleteOptions',
    label: {
      text: 'Add each option on a new line',
      classes: 'govuk-label--s',
      isPageHeading: false
    },
    hint: {
      text: 'To optionally set an input value for each item, separate the option text and value with a colon (e.g English:en-gb)'
    },
    customTemplate: 'auto-complete-options'
  }
}

const allowedParentFileTypes = [
  { value: DOCUMENTS, text: 'Documents' },
  { value: IMAGES, text: 'Images' },
  { value: TABULAR_DATA, text: 'Tabular data' }
]

export const allowedDocumentTypes = [
  { value: 'pdf', text: 'PDF', mimeType: 'application/pdf' },
  { value: 'doc', text: 'DOC', mimeType: 'application/msword' },
  {
    value: 'docx',
    text: 'DOCX',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  {
    value: 'odt',
    text: 'ODT',
    mimeType: 'application/vnd.oasis.opendocument.text'
  },
  { value: 'txt', text: 'TXT', mimeType: 'text/plain' }
]
export const allowedImageTypes = [
  { value: 'jpg', text: 'JPG', mimeType: 'image/jpeg' },
  { value: 'png', text: 'PNG', mimeType: 'image/png' }
]
export const allowedTabularDataTypes = [
  { value: 'xls', text: 'XLS', mimeType: 'application/vnd.ms-excel' },
  {
    value: 'xlsx',
    text: 'XLSX',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  { value: 'csv', text: 'CSV', mimeType: 'text/csv' },
  {
    value: 'ods',
    text: 'ODS',
    mimeType: 'application/vnd.oasis.opendocument.spreadsheet'
  }
]

/**
 * Map file extensions to mime types
 * @param {string[]} fileExtensions
 */
export function mapExtensionsToMimeTypes(fileExtensions) {
  return fileExtensions.map((ext) => {
    const found =
      allowedDocumentTypes.find((x) => x.value === ext) ??
      allowedImageTypes.find((x) => x.value === ext) ??
      allowedTabularDataTypes.find((x) => x.value === ext)
    return found?.mimeType
  })
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function mapPayloadToFileMimeTypes(payload) {
  const documentParentSelected = payload.fileTypes?.includes('documents')
  const imagesParentSelected = payload.fileTypes?.includes('images')
  const tabularDataParentSelected = payload.fileTypes?.includes('tabular-data')

  const combinedTypes = (
    documentParentSelected ? (payload.documentTypes ?? []) : []
  )
    .concat(imagesParentSelected ? (payload.imageTypes ?? []) : [])
    .concat(tabularDataParentSelected ? (payload.tabularDataTypes ?? []) : [])
  return combinedTypes.length
    ? { accept: mapExtensionsToMimeTypes(combinedTypes).join(',') }
    : {}
}

/**
 * @param {ComponentDef | undefined} question
 */
export function getSelectedFileTypesFromCSVMimeTypes(question) {
  const isFileUpload = question?.type === ComponentType.FileUploadField

  if (!isFileUpload) {
    return {}
  }

  const selectedMimeTypesFromCSV = question.options.accept?.split(',') ?? []

  const documentTypes = selectedMimeTypesFromCSV
    .map((currMimeType) => {
      const found = allowedDocumentTypes.find(
        (dt) => dt.mimeType === currMimeType
      )
      return found ? found.value : null
    })
    .filter(Boolean)

  const imageTypes = selectedMimeTypesFromCSV
    .map((currMimeType) => {
      const found = allowedImageTypes.find((dt) => dt.mimeType === currMimeType)
      return found ? found.value : null
    })
    .filter(Boolean)

  const tabularDataTypes = selectedMimeTypesFromCSV
    .map((currMimeType) => {
      const found = allowedTabularDataTypes.find(
        (dt) => dt.mimeType === currMimeType
      )
      return found ? found.value : null
    })
    .filter(Boolean)

  const fileTypes = /** @type {string[]} */ ([])
  if (documentTypes.length) {
    fileTypes.push(DOCUMENTS)
  }
  if (imageTypes.length) {
    fileTypes.push(IMAGES)
  }
  if (tabularDataTypes.length) {
    fileTypes.push(TABULAR_DATA)
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
 * @param { FormComponentsDef | undefined } questionFields
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {FormDefinition} definition
 * @returns {GovukField['value']}
 */
export function getFieldValue(
  fieldName,
  questionFields,
  validation,
  definition
) {
  const validationResult = validation?.formValues[fieldName]

  if (validationResult || validationResult === '') {
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
    case 'autoCompleteOptions':
      return mapListToAutoCompleteStr(
        getListFromComponent(questionFields, definition)
      )
  }
  return undefined
}

export const baseQuestionFields =
  /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.ShortDescription
  ])

export const autocompleteFields =
  /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.AutoCompleteOptions,
    QuestionBaseSettings.ShortDescription
  ])

export const fileUploadFields = /** @type {FormEditorGovukFieldBaseKeys[]} */ ([
  QuestionBaseSettings.Question,
  QuestionBaseSettings.HintText,
  QuestionBaseSettings.QuestionOptional,
  QuestionBaseSettings.FileTypes,
  QuestionBaseSettings.ShortDescription
])

export const radiosOrCheckboxesFields =
  /** @type {(keyof Omit<FormEditorGovukField, 'errorMessage'>)[]} */ ([
    QuestionBaseSettings.Question,
    QuestionBaseSettings.HintText,
    QuestionBaseSettings.QuestionOptional,
    QuestionBaseSettings.ShortDescription,
    QuestionBaseSettings.RadiosOrCheckboxes
  ])

/**
 * @param { ComponentType | undefined } questionType
 * @returns {(keyof Omit<FormEditorGovukField, 'errorMessage'>)[]}
 */
export function getQuestionFieldList(questionType) {
  if (questionType === ComponentType.FileUploadField) {
    return fileUploadFields
  }
  if (questionType === ComponentType.AutocompleteField) {
    return autocompleteFields
  }
  if (
    questionType === ComponentType.RadiosField ||
    questionType === ComponentType.CheckboxesField
  ) {
    return radiosOrCheckboxesFields
  }
  return baseQuestionFields
}

/**
 * @param { InputFieldsComponentsDef | undefined } questionFields
 * @param { ComponentType | undefined } questionType
 * @param { ValidationFailure<FormEditor> | undefined } validation
 * @param {FormDefinition} definition
 * @returns {GovukField[]}
 */
export function getFieldList(
  questionFields,
  questionType,
  validation,
  definition
) {
  const questionFieldList = getQuestionFieldList(questionType)
  return questionFieldList.map((fieldName) => {
    const value = getFieldValue(
      fieldName,
      questionFields,
      validation,
      definition
    )

    const field = {
      ...allBaseSettingsFields[fieldName],
      ...insertValidationErrors(validation?.formErrors[fieldName])
    }

    if (field.items) {
      // Handle checkbox/radio selections
      const strValue = typeof value === 'string' ? value.toString() : ''
      return {
        ...field,
        items: field.items.map((cb) => ({
          ...cb,
          checked: cb.value === strValue
        }))
      }
    }
    return {
      ...field,
      value
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
    (
      validation?.formValues ??
        getSelectedFileTypesFromCSVMimeTypes(questionFields)
    )

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
 * @import { FormDefinition, ComponentDef, FormEditor, FormEditorGovukField, FormEditorInputQuestion, GovukField, InputFieldsComponentsDef, FormEditorGovukFieldBase, FormEditorGovukFieldBaseKeys, FormComponentsDef } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
