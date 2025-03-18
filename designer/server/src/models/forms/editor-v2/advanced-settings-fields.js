import {
  ComponentType,
  classesSchema,
  hintTextSchema,
  maxFutureSchema,
  maxLengthSchema,
  maxPastSchema,
  maxSchema,
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
  suffixSchema
} from '@defra/forms-model'
import Joi from 'joi'

import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

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
    FileUploadField: []
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
      classes: 'govuk-input--width-3'
    },
    [QuestionAdvancedSettings.Max]: {
      name: 'max',
      id: 'max',
      label: {
        text: 'Highest number users can enter (optional)',
        classes: GOVUK_LABEL__M
      },
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
      classes: 'govuk-input--width-3'
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
  })
})

export const allSpecificSchemas = Joi.object().keys({
  maxFuture: maxFutureSchema.messages({
    '*': 'Max days in the future must be a number greater than zero'
  }),
  maxPast: maxPastSchema.messages({
    '*': 'Max days in the past must be a number greater than zero'
  }),
  min: minSchema.messages({
    '*': 'Lowest number must be a number'
  }),
  max: maxSchema.messages({
    '*': 'Highest number must be a number greater than zero'
  }),
  minLength: minLengthSchema.messages({
    '*': 'Minimum length must be a number greater than zero'
  }),
  maxLength: maxLengthSchema.messages({
    '*': 'Maximum length must be a number greater than zero'
  }),
  precision: precisionSchema.messages({
    '*': 'Precision must be a number greater than zero'
  }),
  prefix: prefixSchema,
  suffix: suffixSchema,
  regex: regexSchema,
  rows: rowsSchema.messages({
    '*': 'Rows must be a number greater than zero'
  }),
  classes: classesSchema
})

/**
 * @param {GovukField} field
 */
export function getFieldComponentType(field) {
  switch (field.name) {
    case QuestionAdvancedSettings.Min:
    case QuestionAdvancedSettings.Max:
    case QuestionAdvancedSettings.MinLength:
    case QuestionAdvancedSettings.MaxLength:
    case QuestionAdvancedSettings.MaxFuture:
    case QuestionAdvancedSettings.MaxPast:
    case QuestionAdvancedSettings.Precision:
    case QuestionAdvancedSettings.Prefix:
    case QuestionAdvancedSettings.Rows:
    case QuestionAdvancedSettings.Suffix:
      return ComponentType.TextField
    case QuestionAdvancedSettings.Regex:
    case QuestionAdvancedSettings.Classes:
      return ComponentType.MultilineTextField
    default:
      throw new Error(
        `Invalid or not implemented advanced setting field name (${field.name})`
      )
  }
}

/**
 * @import { ComponentDef, GovukField } from '@defra/forms-model'
 */
