import { ComponentType, questionDetailsFullSchema } from '@defra/forms-model'
import Joi from 'joi'

import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { isCheckboxSelected, isListComponentType } from '~/src/lib/utils.js'
import { mapPayloadToFileMimeTypes } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  GOVUK_INPUT_WIDTH_3,
  GOVUK_LABEL__M
} from '~/src/models/forms/editor-v2/common.js'

const MIN_FILES_ERROR_MESSAGE =
  'Minimum file count must be a whole number between 1 and 25'
const MAX_FILES_ERROR_MESSAGE =
  'Maximum file count must be a whole number between 1 and 25'
const EXACT_FILES_ERROR_MESSAGE =
  'Exact file count must be a whole number between 1 and 25'
const MIN_LENGTH_ERROR_MESSAGE =
  'Minimum length must be a positive whole number'
const MAX_LENGTH_ERROR_MESSAGE =
  'Maximum length must be a positive whole number'
const MAX_PRECISION = 5

export const advancedSettingsPerComponentType =
  /** @type {Record<ComponentType, QuestionAdvancedSettings[]> } */ ({
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
    MonthYearField: [],
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
      QuestionAdvancedSettings.MaxFiles,
      QuestionAdvancedSettings.ExactFiles
    ]
  })

/**
 * @type { Record<ComponentType, GovukField> }
 */
export const allAdvancedSettingsFields =
  /** @type { Record<QuestionAdvancedSettings, GovukField> } */ ({
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
    [QuestionAdvancedSettings.ExactFiles]: {
      name: 'exactFiles',
      id: 'exactFiles',
      label: {
        text: 'Exact file count (optional)',
        classes: GOVUK_LABEL__M
      },
      hint: {
        text: 'The exact number of files users can upload. Using this setting negates any values you set for Min or Max file count'
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

export const allSpecificSchemas = Joi.object().keys({
  maxFuture: questionDetailsFullSchema.maxFutureSchema.messages({
    '*': 'Maximum days in the future must be a positive whole number'
  }),
  maxPast: questionDetailsFullSchema.maxPastSchema.messages({
    '*': 'Maximum days in the past must be a positive whole number'
  }),
  min: questionDetailsFullSchema.minSchema
    .when('max', {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref('max')),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': 'Lowest number must be a whole number',
      'number.integer': 'Lowest number must be a whole number',
      '*': 'Lowest number cannot be more than the highest number'
    }),
  max: questionDetailsFullSchema.maxSchema.messages({
    '*': 'Highest number must be a whole number'
  }),
  exactFiles: questionDetailsFullSchema.exactFilesSchema
    .when('minFiles', {
      is: Joi.exist(),
      then: Joi.number().forbidden(),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': EXACT_FILES_ERROR_MESSAGE,
      'number.integer': EXACT_FILES_ERROR_MESSAGE,
      'number.min': EXACT_FILES_ERROR_MESSAGE,
      'number.max': EXACT_FILES_ERROR_MESSAGE,
      '*': 'Enter an exact amount or choose the minimum and maximum range allowed'
    })
    .when('maxFiles', {
      is: Joi.exist(),
      then: Joi.number().forbidden(),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': EXACT_FILES_ERROR_MESSAGE,
      'number.integer': EXACT_FILES_ERROR_MESSAGE,
      'number.min': EXACT_FILES_ERROR_MESSAGE,
      'number.max': EXACT_FILES_ERROR_MESSAGE,
      '*': 'Enter an exact amount or choose the minimum and maximum range allowed'
    }),
  minFiles: questionDetailsFullSchema.minFilesSchema.when('maxFiles', {
    is: Joi.exist(),
    then: Joi.number().max(Joi.ref('maxFiles')).messages({
      'number.max':
        'The minimum number of files you accept cannot be greater than the maximum',
      '*': MIN_FILES_ERROR_MESSAGE
    }),
    otherwise: Joi.number().empty('').integer().messages({
      '*': MIN_FILES_ERROR_MESSAGE
    })
  }),
  maxFiles: questionDetailsFullSchema.maxFilesSchema.messages({
    '*': MAX_FILES_ERROR_MESSAGE
  }),
  minLength: questionDetailsFullSchema.minLengthSchema.when('maxLength', {
    is: Joi.exist(),
    then: Joi.number().max(Joi.ref('maxLength')).messages({
      'number.max':
        'Minimum length must be less than or equal to maximum length',
      '*': MIN_LENGTH_ERROR_MESSAGE
    }),
    otherwise: Joi.number().empty('').integer().messages({
      '*': MIN_LENGTH_ERROR_MESSAGE
    })
  }),
  maxLength: questionDetailsFullSchema.maxLengthSchema.messages({
    '*': MAX_LENGTH_ERROR_MESSAGE
  }),
  precision: questionDetailsFullSchema.precisionSchema
    .max(MAX_PRECISION)
    .messages({
      '*': `Enter a whole number between 0 and ${MAX_PRECISION}`
    }),
  prefix: questionDetailsFullSchema.prefixSchema,
  suffix: questionDetailsFullSchema.suffixSchema,
  regex: questionDetailsFullSchema.regexSchema,
  rows: questionDetailsFullSchema.rowsSchema.messages({
    '*': 'Enter a positive whole number'
  }),
  classes: questionDetailsFullSchema.classesSchema
})

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
  if (payload.maxFuture !== undefined) {
    additionalOptions.maxDaysInFuture = payload.maxFuture
  }
  if (payload.maxPast !== undefined) {
    additionalOptions.maxDaysInPast = payload.maxPast
  }
  if (payload.usePostcodeLookup !== undefined) {
    additionalOptions.usePostcodeLookup = payload.usePostcodeLookup === 'true'
  }
  return additionalOptions
}

/**
 * Determine if val contains a value (including zero as a valid number)
 * @param { string | undefined } val
 * @returns { string | undefined }
 */
export function isValueOrZero(val) {
  return val !== undefined ? 'has-value' : undefined
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function getAdditionalSchema(payload) {
  // Note - any properties that should allow a 'zero' need to have their check wrapped in isValueOrZero() as opposed
  // to just a value check e.g. 'minFiles' and 'precision'
  const additionalSchema = {}
  if (
    payload.minLength ??
    isValueOrZero(payload.min) ??
    isValueOrZero(payload.minFiles)
  ) {
    additionalSchema.min = payload.minLength ?? payload.min ?? payload.minFiles
  }
  if (payload.maxLength ?? isValueOrZero(payload.max) ?? payload.maxFiles) {
    additionalSchema.max = payload.maxLength ?? payload.max ?? payload.maxFiles
  }
  if (payload.exactFiles) {
    additionalSchema.length = payload.exactFiles
  }
  if (payload.regex) {
    additionalSchema.regex = payload.regex
  }
  if (isValueOrZero(payload.precision)) {
    additionalSchema.precision = payload.precision
  }
  return additionalSchema
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function mapExtraRootFields(payload) {
  const rootFields = {}
  if (payload.list) {
    rootFields.list = payload.list
  }
  return rootFields
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<FileUploadFieldComponent>}
 */
export function mapFileUploadQuestionDetails(payload) {
  const baseQuestionDetails = mapBaseQuestionDetails(payload)
  const fileTypes = mapPayloadToFileMimeTypes(payload)

  return {
    ...baseQuestionDetails,
    type: ComponentType.FileUploadField,
    options: {
      ...baseQuestionDetails.options,
      ...fileTypes
    }
  }
}

/**
 * Maps FormEditorInputQuestion payload to List Component
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<ComponentDef>}
 */
export function mapListComponentFromPayload(payload) {
  const baseComponentDetails = mapBaseQuestionDetails(payload)
  return {
    ...baseComponentDetails,
    list: 'list' in baseComponentDetails ? baseComponentDetails.list : ''
  }
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<ComponentDef>}
 */
export function mapBaseQuestionDetails(payload) {
  const additionalOptions = getAdditionalOptions(payload)
  const additionalSchema = getAdditionalSchema(payload)
  const extraRootFields = mapExtraRootFields(payload)

  return /** @type {Partial<ComponentDef>} */ ({
    type: payload.questionType,
    title: payload.question,
    name: payload.name,
    shortDescription: payload.shortDescription,
    hint: payload.hintText,
    ...extraRootFields,
    options: {
      required: !isCheckboxSelected(payload.questionOptional),
      ...additionalOptions
    },
    schema: { ...additionalSchema }
  })
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {Partial<ComponentDef>}
 */
export function mapQuestionDetails(payload) {
  if (payload.questionType === ComponentType.FileUploadField) {
    return mapFileUploadQuestionDetails(payload)
  }
  if (
    isListComponentType(
      /** @type { ComponentType | undefined } */ (payload.questionType)
    )
  ) {
    return mapListComponentFromPayload(payload)
  }
  return mapBaseQuestionDetails(payload)
}

/**
 * @import { ComponentDef, FormEditorInputQuestion, GovukField, FileUploadFieldComponent } from '@defra/forms-model'
 */
