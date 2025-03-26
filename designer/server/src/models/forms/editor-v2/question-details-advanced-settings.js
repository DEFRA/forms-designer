import { ComponentType } from '@defra/forms-model'

import { insertValidationErrors } from '~/src/lib/utils.js'
import { allAdvancedSettingsFields } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'

/**
 * @param {NumberFieldComponent} question
 */
export function addNumberFieldProperties(question) {
  return {
    min: question.schema.min,
    max: question.schema.max,
    precision: question.schema.precision,
    prefix: question.options.prefix,
    suffix: question.options.suffix
  }
}

/**
 * @param { DatePartsFieldComponent | MonthYearFieldComponent } question
 */
export function addDateFieldProperties(question) {
  return {
    maxFuture: question.options.maxDaysInFuture,
    maxPast: question.options.maxDaysInPast
  }
}

/**
 * @param { TextFieldComponent | MultilineTextFieldComponent | NumberFieldComponent | FileUploadFieldComponent } question
 */
export function addMinMaxFieldProperties(question) {
  if (question.type === ComponentType.FileUploadField) {
    return {
      exactFiles: question.schema.length,
      minFiles: question.schema.min,
      maxFiles: question.schema.max
    }
  }
  return {
    minLength: question.schema.min,
    maxLength: question.schema.max
  }
}

/**
 * @param {MultilineTextFieldComponent} question
 */
export function addMultiLineFieldProperties(question) {
  return {
    rows: question.options.rows
  }
}

/**
 * @param { TextFieldComponent | MultilineTextFieldComponent } question
 */
export function addRegexFieldProperties(question) {
  return {
    regex: question.schema.regex
  }
}

/**
 * @param {ComponentType} questionType
 * @param {ComponentType[]} allowableFieldTypes
 */
function isTypeOfField(questionType, allowableFieldTypes) {
  return allowableFieldTypes.includes(questionType)
}

/**
 * @param { TextFieldComponent | MultilineTextFieldComponent | NumberFieldComponent | DatePartsFieldComponent | MonthYearFieldComponent } question
 */
export function mapToQuestionOptions(question) {
  const isNumberField = isTypeOfField(question.type, [
    ComponentType.NumberField
  ])
  const isDateField = isTypeOfField(question.type, [
    ComponentType.DatePartsField,
    ComponentType.MonthYearField
  ])
  const hasMinMax = isTypeOfField(question.type, [
    ComponentType.TextField,
    ComponentType.MultilineTextField,
    ComponentType.NumberField,
    ComponentType.FileUploadField
  ])

  const numberExtras = isNumberField
    ? addNumberFieldProperties(/** @type {NumberFieldComponent} */ (question))
    : {}
  const dateExtras = isDateField
    ? addDateFieldProperties(
        /** @type { DatePartsFieldComponent | MonthYearFieldComponent } */ (
          question
        )
      )
    : {}
  const minMaxExtras = hasMinMax
    ? addMinMaxFieldProperties(
        /** @type { TextFieldComponent | MultilineTextFieldComponent | NumberFieldComponent } */ (
          question
        )
      )
    : {}
  const multilineExtras = isTypeOfField(question.type, [
    ComponentType.MultilineTextField
  ])
    ? addMultiLineFieldProperties(
        /** @type {MultilineTextFieldComponent} */ (question)
      )
    : {}
  const regexExtras = isTypeOfField(question.type, [
    ComponentType.TextField,
    ComponentType.MultilineTextField
  ])
    ? addRegexFieldProperties(
        /** @type {TextFieldComponent | MultilineTextFieldComponent} */ (
          question
        )
      )
    : {}

  return {
    classes: question.options.classes,
    ...numberExtras,
    ...dateExtras,
    ...minMaxExtras,
    ...multilineExtras,
    ...regexExtras
  }
}

/**
 * @param {ComponentType[]} options
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
 * @import { DatePartsFieldComponent, FileUploadFieldComponent, FormEditor, GovukField, MonthYearFieldComponent,  MultilineTextFieldComponent, NumberFieldComponent, TextFieldComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
