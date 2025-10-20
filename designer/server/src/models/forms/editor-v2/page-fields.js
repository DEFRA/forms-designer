import { ComponentType } from '@defra/forms-model'

import {
  QuestionAdvancedSettings,
  QuestionBaseSettings
} from '~/src/common/constants/editor.js'

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
  QuestionBaseSettings.TabularDataTypes,
  QuestionBaseSettings.UsePostcodeLookup
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
