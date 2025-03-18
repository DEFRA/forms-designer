import { ComponentType } from '@defra/forms-model'

import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { insertValidationErrors } from '~/src/lib/utils.js'
import { allAdvancedSettingsFields } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'

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
 * @param {TextFieldComponent | MultilineTextFieldComponent} question
 */
function mapToQuestionOptions(question) {
  return {
    classes: question.options.classes,
    minLength: question.schema.min,
    maxLength: question.schema.max,
    regex: question.schema.regex,
    rows:
      question.type === ComponentType.MultilineTextField
        ? question.options.rows
        : undefined
  }
}

/**
 * @param {string[]} options
 * @param {TextFieldComponent} question
 * @param {ValidationFailure<FormEditor>} [validation]
 * @returns {GovukField[]}
 */
export function advancedSettingsFields(options, question, validation) {
  const formValues =
    /** @type { Record<string, string | boolean | number | undefined> } */ (
      validation?.formValues ?? mapToQuestionOptions(question)
    )
  const formErrors = validation?.formErrors

  return options.map((fieldName) => {
    const fieldSettings = allAdvancedSettingsFields[fieldName]
    return {
      ...fieldSettings,
      ...insertValidationErrors(formErrors ? formErrors[fieldName] : undefined),
      value: formValues[fieldName]
    }
  })
}

/**
 * @import { FormEditor, GovukField, MultilineTextFieldComponent, TextFieldComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
