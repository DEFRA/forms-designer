import {
  ComponentType,
  classesSchema,
  documentTypesSchema,
  fileTypesSchema,
  hintTextSchema,
  imageTypesSchema,
  maxFilesSchema,
  maxFutureSchema,
  maxLengthSchema,
  maxPastSchema,
  maxSchema,
  minFilesSchema,
  minLengthSchema,
  minSchema,
  nameSchema,
  precisionSchema,
  prefixSchema,
  questionOptionalSchema,
  questionSchema,
  questionTypeFullSchema,
  regexSchema,
  rowsSchema,
  shortDescriptionSchema,
  suffixSchema,
  tabularDataTypesSchema
} from '@defra/forms-model'
import Joi from 'joi'

import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { isCheckboxSelected } from '~/src/lib/utils.js'
import {
  GOVUK_INPUT_WIDTH_3,
  GOVUK_LABEL__M
} from '~/src/models/forms/editor-v2/common.js'

export const advancedSettingsPerComponentType =
  /** @type {Record<string, string[]> } */ ({
    TextField: [
      QuestionAdvancedSettings.MinLength,
      QuestionAdvancedSettings.MaxLength,
      QuestionAdvancedSettings.Regex,
      QuestionAdvancedSettings.Classes
    ],
    MultilineTextField: [
      QuestionAdvancedSettings.MinLength,
      QuestionAdvancedSettings.MaxLength,
      QuestionAdvancedSettings.Rows,
      QuestionAdvancedSettings.Regex,
      QuestionAdvancedSettings.Classes
    ],
    YesNoField: [],
    DatePartsField: [
      QuestionAdvancedSettings.MaxPast,
      QuestionAdvancedSettings.MaxFuture,
      QuestionAdvancedSettings.Classes
    ],
    MonthYearField: [
      QuestionAdvancedSettings.MaxPast,
      QuestionAdvancedSettings.MaxFuture,
      QuestionAdvancedSettings.Classes
    ],
    SelectField: [],
    AutocompleteField: [],
    RadiosField: [],
    CheckboxesField: [],
    NumberField: [
      QuestionAdvancedSettings.Min,
      QuestionAdvancedSettings.Max,
      QuestionAdvancedSettings.Precision,
      QuestionAdvancedSettings.Prefix,
      QuestionAdvancedSettings.Suffix
    ],
    UkAddressField: [],
    TelephoneNumberField: [QuestionAdvancedSettings.Classes],
    EmailAddressField: [QuestionAdvancedSettings.Classes],
    Html: [],
    InsetText: [],
    Details: [],
    List: [],
    Markdown: [],
    FileUploadField: [
      QuestionAdvancedSettings.MinFiles,
      QuestionAdvancedSettings.MaxFiles
    ]
  })

/**
 * @type { Record<string, GovukField> }
 */
export const allAdvancedSettingsFields =
  /** @type { Record<string, GovukField> } */ ({
    [QuestionAdvancedSettings.Classes]: {
      name: 'classes',
      id: 'classes',
      label: {
        text: 'Classes (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Apply CSS classes to this field. For example, ‘govuk-input govuk-!-width-full’'
      },
      rows: 1
    },
    [QuestionAdvancedSettings.Min]: {
      name: 'min',
      id: 'min',
      label: {
        text: 'Lowest number users can enter (optional)',
        classes: GOVUK_LABEL__M
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Max]: {
      name: 'max',
      id: 'max',
      label: {
        text: 'Highest number users can enter (optional)',
        classes: GOVUK_LABEL__M
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MinFiles]: {
      name: 'minFiles',
      id: 'minFiles',
      label: {
        text: 'Minimum file count (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The minimum number of files users can upload'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxFiles]: {
      name: 'maxFiles',
      id: 'maxFiles',
      label: {
        text: 'Maximum file count (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The maximum number of files users can upload'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MinLength]: {
      name: 'minLength',
      id: 'minLength',
      label: {
        text: 'Minimum character length (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The minimum number of characters users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxLength]: {
      name: 'maxLength',
      id: 'maxLength',
      label: {
        text: 'Maximum character length (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The maximum number of characters users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxFuture]: {
      name: 'maxFuture',
      id: 'maxFuture',
      label: {
        text: 'Max days in the future (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Determines the latest date users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.MaxPast]: {
      name: 'maxPast',
      id: 'maxPast',
      label: {
        text: 'Max days in the past (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Determines the earliest date users can enter'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Precision]: {
      name: 'precision',
      id: 'precision',
      label: {
        text: 'Precision (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Specifies the number of decimal places users can enter. For example, to allow users to enter numbers with up to two decimal places, set this to 2'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Prefix]: {
      name: 'prefix',
      id: 'prefix',
      label: {
        text: 'Prefix (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "For example, a symbol or abbreviation for the type of information you’re asking for, like, '£'"
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Regex]: {
      name: 'regex',
      id: 'regex',
      label: {
        text: 'Regex (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Specifies a regular expression to validate users’ inputs. Use JavaScript syntax'
      },
      rows: 3
    },
    [QuestionAdvancedSettings.Rows]: {
      name: 'rows',
      id: 'rows',
      label: {
        text: 'Rows (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'Specifices the number of textarea rows (default is 5 rows)'
      },
      classes: GOVUK_INPUT_WIDTH_3
    },
    [QuestionAdvancedSettings.Suffix]: {
      name: 'suffix',
      id: 'suffix',
      label: {
        text: 'Suffix (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: "For example, a symbol or abbreviation for the type of information you’re asking for, like,'per item' or 'Kg'"
      },
      classes: GOVUK_INPUT_WIDTH_3
    }
  })

export const baseSchema = Joi.object().keys({
  name: nameSchema,
  question: questionSchema.messages({
    '*': 'Enter a question'
  }),
  hintText: hintTextSchema,
  questionOptional: questionOptionalSchema,
  shortDescription: shortDescriptionSchema.messages({
    '*': 'Enter a short description'
  }),
  questionType: questionTypeFullSchema.messages({
    '*': 'The question type is missing'
  }),
  fileTypes: fileTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.required().messages({
      '*': 'Select the type of file you want to upload'
    })
  }),
  documentTypes: documentTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.array().when('fileTypes', {
      is: Joi.array().has('documents'),
      then: Joi.required().messages({
        '*': 'Choose the document file types you accept'
      })
    })
  }),
  imageTypes: imageTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.array().when('fileTypes', {
      is: Joi.array().has('images'),
      then: Joi.required().messages({
        '*': 'Choose the image file types you accept'
      })
    })
  }),
  tabularDataTypes: tabularDataTypesSchema.when('questionType', {
    is: 'FileUploadField',
    then: Joi.array().when('fileTypes', {
      is: Joi.array().has('tabular-data'),
      then: Joi.required().messages({
        '*': 'Choose the tabular data file types you accept'
      })
    })
  })
})

export const allSpecificSchemas = Joi.object().keys({
  maxFuture: maxFutureSchema.messages({
    '*': 'Max days in the future must be a positive whole number'
  }),
  maxPast: maxPastSchema.messages({
    '*': 'Max days in the past must be a positive whole number'
  }),
  min: minSchema
    .when('max', {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref('max')),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': 'Lowest number must be a whole number',
      'number.integer': 'Lowest number must be a whole number',
      '*': 'Lowest number must be less than or equal to highest number'
    }),
  max: maxSchema.messages({
    '*': 'Highest number must be a positive whole number'
  }),
  minFiles: minFilesSchema
    .when('maxFiles', {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref('maxFiles')),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': 'Minimum file count must be a whole number',
      'number.integer': 'Minimum file count must be a whole number',
      '*': 'Minimum file count must be less than or equal to maximum file count'
    }),
  maxFiles: maxFilesSchema.messages({
    '*': 'Maximum file count must be a positive whole number'
  }),
  minLength: minLengthSchema
    .when('maxLength', {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref('maxLength')),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': 'Minimum length must be a positive whole number',
      'number.integer': 'Minimum length must be a positive whole number',
      '*': 'Minimum length must be less than or equal to maximum length'
    }),
  maxLength: maxLengthSchema.messages({
    '*': 'Maximum length must be a positive whole number'
  }),
  precision: precisionSchema.messages({
    '*': 'Precision must be a positive whole number'
  }),
  prefix: prefixSchema,
  suffix: suffixSchema,
  regex: regexSchema,
  rows: rowsSchema.messages({
    '*': 'Rows must be a positive whole number'
  }),
  classes: classesSchema
})

const textFieldQuestions = [
  QuestionAdvancedSettings.Min,
  QuestionAdvancedSettings.Max,
  QuestionAdvancedSettings.MinFiles,
  QuestionAdvancedSettings.MaxFiles,
  QuestionAdvancedSettings.MinLength,
  QuestionAdvancedSettings.MaxLength,
  QuestionAdvancedSettings.MaxFuture,
  QuestionAdvancedSettings.MaxPast,
  QuestionAdvancedSettings.Precision,
  QuestionAdvancedSettings.Prefix,
  QuestionAdvancedSettings.Rows,
  QuestionAdvancedSettings.Suffix
]

const multiLineTextFieldQuestions = [
  QuestionAdvancedSettings.Regex,
  QuestionAdvancedSettings.Classes
]
/**
 * @param {GovukField} field
 */
export function getFieldComponentType(field) {
  const fieldName = field.name ?? 'unknown'

  if (textFieldQuestions.includes(fieldName)) {
    return ComponentType.TextField
  }

  if (multiLineTextFieldQuestions.includes(fieldName)) {
    return ComponentType.MultilineTextField
  }

  throw new Error(
    `Invalid or not implemented advanced setting field name (${field.name})`
  )
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
function getAdditionalOptions(payload) {
  const additionalOptions = {}
  if (payload.classes) {
    additionalOptions.classes = payload.classes
  }
  if (payload.rows) {
    additionalOptions.rows = payload.rows
  }
  if (payload.prefix) {
    additionalOptions.prefix = payload.prefix
  }
  if (payload.suffix) {
    additionalOptions.suffix = payload.suffix
  }
  if (payload.maxFuture) {
    additionalOptions.maxDaysInFuture = payload.maxFuture
  }
  if (payload.maxPast) {
    additionalOptions.maxDaysInPast = payload.maxPast
  }
  return additionalOptions
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function getAdditionalSchema(payload) {
  const additionalSchema = {}
  if (payload.minLength ?? payload.min ?? payload.minFiles) {
    additionalSchema.min = payload.minLength ?? payload.min ?? payload.minFiles
  }
  if (payload.maxLength ?? payload.max ?? payload.maxFiles) {
    additionalSchema.max = payload.maxLength ?? payload.max ?? payload.maxFiles
  }
  if (payload.regex) {
    additionalSchema.regex = payload.regex
  }
  if (payload.precision) {
    additionalSchema.precision = payload.precision
  }
  return additionalSchema
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function mapFileTypes(payload) {
  const documentParentSelected = payload.fileTypes?.includes('documents')
  const imagesParentSelected = payload.fileTypes?.includes('images')
  const tabularDataParentSelected = payload.fileTypes?.includes('tabular-data')

  const combinedTypes = (
    documentParentSelected ? (payload.documentTypes ?? []) : []
  )
    .concat(imagesParentSelected ? (payload.imageTypes ?? []) : [])
    .concat(tabularDataParentSelected ? (payload.tabularDataTypes ?? []) : [])
  return combinedTypes.length ? { accept: combinedTypes.join(',') } : {}
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function mapQuestionDetails(payload) {
  const additionalOptions = getAdditionalOptions(payload)
  const additionalSchema = getAdditionalSchema(payload)
  const fileTypes = mapFileTypes(payload)

  return /** @type {Partial<ComponentDef>} */ ({
    type: payload.questionType,
    title: payload.question,
    name: payload.name,
    shortDescription: payload.shortDescription,
    hint: payload.hintText,
    options: {
      required: !isCheckboxSelected(payload.questionOptional),
      ...additionalOptions,
      ...fileTypes
    },
    schema: { ...additionalSchema }
  })
}

/**
 * @import { ComponentDef, FormEditorInputQuestion, GovukField } from '@defra/forms-model'
 */
