import {
  ComponentType,
  classesSchema,
  maxFilesSchema,
  maxFutureSchema,
  maxLengthSchema,
  maxPastSchema,
  maxSchema,
  minFilesSchema,
  minLengthSchema,
  minSchema,
  precisionSchema,
  prefixSchema,
  regexSchema,
  rowsSchema,
  suffixSchema
} from '@defra/forms-model'
import Joi from 'joi'

import {
  QuestionAdvancedSettings,
  QuestionBaseSettings
} from '~/src/common/constants/editor.js'

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
  QuestionBaseSettings.Question,
  QuestionBaseSettings.Name,
  QuestionBaseSettings.ShortDescription,
  QuestionAdvancedSettings.ExactFiles,
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
  QuestionBaseSettings.HintText,
  QuestionBaseSettings.AutoCompleteOptions,
  QuestionAdvancedSettings.Regex,
  QuestionAdvancedSettings.Classes
]

const checkBoxFieldQuestions = [
  QuestionBaseSettings.QuestionOptional,
  QuestionBaseSettings.DocumentTypes,
  QuestionBaseSettings.ImageTypes,
  QuestionBaseSettings.TabularDataTypes
]

const fileUploadFields = [QuestionBaseSettings.FileTypes]
/**
 * @param {GovukField} field
 */
export function getFieldComponentType(field) {
  if (field.name === undefined) {
    throw new Error(`Field name missing`)
  }
  const fieldName = /** @type {keyof FormEditorGovukField} */ (field.name)

  if (textFieldQuestions.includes(fieldName)) {
    return ComponentType.TextField
  }

  if (multiLineTextFieldQuestions.includes(fieldName)) {
    return ComponentType.MultilineTextField
  }

  if (checkBoxFieldQuestions.includes(fieldName)) {
    return ComponentType.CheckboxesField
  }

  if (fileUploadFields.includes(fieldName)) {
    return ComponentType.FileUploadField
  }

  throw new Error(
    `Invalid or not implemented field name setting (${field.name})`
  )
}
/**
 * @import { GovukField, FormEditorGovukField } from '@defra/forms-model'
 */
