import { questionDetailsFullSchema } from '@defra/forms-model'
import Joi from 'joi'

import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { isCheckboxSelected } from '~/src/lib/utils.js'
import { mapPayloadToFileMimeTypes } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  GOVUK_INPUT_WIDTH_3,
  GOVUK_LABEL__M
} from '~/src/models/forms/editor-v2/common.js'

const MIN_FILES_ERROR_MESSAGE =
  'Minimum file count must be a whole number between 0 and 25'
const MAX_FILES_ERROR_MESSAGE =
  'Maximum file count must be a whole number between 1 and 25'
const EXACT_FILES_ERROR_MESSAGE =
  'Exact file count must be a whole number between 1 and 25'

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
    '*': 'Max days in the future must be a positive whole number or zero'
  }),
  maxPast: questionDetailsFullSchema.maxPastSchema.messages({
    '*': 'Max days in the past must be a positive whole number or zero'
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
      '*': 'Lowest number must be less than or equal to highest number'
    }),
  max: questionDetailsFullSchema.maxSchema.messages({
    '*': 'Highest number must be a positive whole number'
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
      '*': 'Exact file count cannot be used with Minimum or Maximum file count'
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
      '*': 'Exact file count cannot be used with Minimum or Maximum file count'
    }),
  minFiles: questionDetailsFullSchema.minFilesSchema
    .when('maxFiles', {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref('maxFiles')),
      otherwise: Joi.number().empty('').integer()
    })
    .messages({
      'number.base': MIN_FILES_ERROR_MESSAGE,
      'number.integer': MIN_FILES_ERROR_MESSAGE,
      'number.min': MIN_FILES_ERROR_MESSAGE,
      'number.max': MIN_FILES_ERROR_MESSAGE,
      '*': 'Minimum file count must be less than or equal to maximum file count'
    }),
  maxFiles: questionDetailsFullSchema.maxFilesSchema.messages({
    '*': MAX_FILES_ERROR_MESSAGE
  }),
  minLength: questionDetailsFullSchema.minLengthSchema
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
  maxLength: questionDetailsFullSchema.maxLengthSchema.messages({
    '*': 'Maximum length must be a positive whole number'
  }),
  precision: questionDetailsFullSchema.precisionSchema.messages({
    '*': 'Precision must be a whole number between 0 and 5'
  }),
  prefix: questionDetailsFullSchema.prefixSchema,
  suffix: questionDetailsFullSchema.suffixSchema,
  regex: questionDetailsFullSchema.regexSchema,
  rows: questionDetailsFullSchema.rowsSchema.messages({
    '*': 'Rows must be a positive whole number'
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
  return additionalOptions
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function getAdditionalSchema(payload) {
  // Note - any properties that should allow a 'zero' need to have a !== undefined check as opposed
  // to just a value check e.g. 'minFiles' and 'precision'
  const additionalSchema = {}
  if (payload.minLength ?? payload.min ?? payload.minFiles !== undefined) {
    additionalSchema.min = payload.minLength ?? payload.min ?? payload.minFiles
  }
  if (payload.maxLength ?? payload.max ?? payload.maxFiles) {
    additionalSchema.max = payload.maxLength ?? payload.max ?? payload.maxFiles
  }
  if (payload.exactFiles) {
    additionalSchema.length = payload.exactFiles
  }
  if (payload.regex) {
    additionalSchema.regex = payload.regex
  }
  if (payload.precision !== undefined) {
    additionalSchema.precision = payload.precision
  }
  return additionalSchema
}

/**
 * @param {Partial<FormEditorInputQuestion>} payload
 */
export function mapQuestionDetails(payload) {
  const additionalOptions = getAdditionalOptions(payload)
  const additionalSchema = getAdditionalSchema(payload)
  const fileTypes = mapPayloadToFileMimeTypes(payload)

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
 * @import { ComponentDef, ComponentType, FormEditorInputQuestion, GovukField } from '@defra/forms-model'
 */
