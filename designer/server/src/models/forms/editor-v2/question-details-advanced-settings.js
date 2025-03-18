import { ComponentType } from '@defra/forms-model'

import { insertValidationErrors } from '~/src/lib/utils.js'
import { allAdvancedSettingsFields } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'

/**
 * @param {TextFieldComponent | MultilineTextFieldComponent | NumberFieldComponent | DatePartsFieldComponent | MonthYearFieldComponent} question
 */
export function mapToQuestionOptions(question) {
  const isNumberField = question.type === ComponentType.NumberField
  const isDateField =
    question.type === ComponentType.DatePartsField ||
    question.type === ComponentType.MonthYearField

  return {
    classes: question.options.classes,
    min: isNumberField ? question.schema.min : undefined,
    max: isNumberField ? question.schema.max : undefined,
    maxFuture: isDateField ? question.options.maxDaysInFuture : undefined,
    minLength: !isNumberField && !isDateField ? question.schema.min : undefined,
    maxLength: !isNumberField && !isDateField ? question.schema.max : undefined,
    maxPast: isDateField ? question.options.maxDaysInPast : undefined,
    precision: isNumberField ? question.schema.precision : undefined,
    prefix: isNumberField ? question.options.prefix : undefined,
    suffix: isNumberField ? question.options.suffix : undefined,
    regex: !isNumberField && !isDateField ? question.schema.regex : undefined,
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
 * @import { DatePartsFieldComponent, FormEditor, GovukField, MonthYearFieldComponent,  MultilineTextFieldComponent, NumberFieldComponent, TextFieldComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
