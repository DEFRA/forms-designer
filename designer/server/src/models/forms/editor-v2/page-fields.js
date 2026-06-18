import { ComponentType } from '@defra/forms-model'

import {
  QuestionAdvancedSettings,
  QuestionBaseSettings
} from '~/src/common/constants/editor.js'

const textFieldQuestions = [
  QuestionBaseSettings.Question,
  QuestionBaseSettings.Name,
  QuestionBaseSettings.ShortDescription,
  QuestionBaseSettings.ErrorDescription,
  QuestionBaseSettings.PaymentAmount,
  QuestionBaseSettings.PaymentDescription,
  QuestionBaseSettings.PaymentTestApiKey,
  QuestionBaseSettings.PaymentLiveApiKey,
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
  QuestionAdvancedSettings.Suffix,
  QuestionAdvancedSettings.MinChecks,
  QuestionAdvancedSettings.MaxChecks,
  QuestionAdvancedSettings.ExactChecks,
  QuestionAdvancedSettings.MinFeatures,
  QuestionAdvancedSettings.MaxFeatures,
  QuestionAdvancedSettings.ExactFeatures
]

const multiLineTextFieldQuestions = [
  QuestionBaseSettings.HintText,
  QuestionBaseSettings.AutoCompleteOptions,
  QuestionBaseSettings.DeclarationText,
  QuestionAdvancedSettings.Regex,
  QuestionAdvancedSettings.Classes,
  QuestionAdvancedSettings.InstructionText
]

const checkBoxFieldQuestions = [
  QuestionBaseSettings.QuestionOptional,
  QuestionBaseSettings.DocumentTypes,
  QuestionBaseSettings.ImageTypes,
  QuestionBaseSettings.TabularDataTypes,
  QuestionBaseSettings.UsePostcodeLookup,
  QuestionAdvancedSettings.GiveInstructions,
  QuestionAdvancedSettings.GeometryTypes
]

const fileUploadFields = [QuestionBaseSettings.FileTypes]

const radiosFieldQuestions = [
  QuestionAdvancedSettings.Countries,
  QuestionAdvancedSettings.TelephoneNumberFormat
]

const dateFieldQuestions = [
  QuestionAdvancedSettings.EarliestDate,
  QuestionAdvancedSettings.LatestDate
]

const monthYearFieldQuestions = [
  QuestionAdvancedSettings.EarliestMonthYear,
  QuestionAdvancedSettings.LatestMonthYear
]

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

  if (radiosFieldQuestions.includes(fieldName)) {
    return ComponentType.RadiosField
  }

  if (
    dateFieldQuestions.includes(fieldName) ||
    monthYearFieldQuestions.includes(fieldName)
  ) {
    return ComponentType.DatePartsField
  }

  throw new Error(
    `Invalid or not implemented field name setting (${field.name})`
  )
}
/**
 * @import { GovukField, FormEditorGovukField } from '@defra/forms-model'
 */
