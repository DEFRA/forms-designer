import { ComponentType } from '@defra/forms-model'

import { isLocationFieldType } from '~/src/common/constants/component-types.js'
import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import { insertValidationErrors, isCheckboxSelected } from '~/src/lib/utils.js'
import { allAdvancedSettingsFields } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import { allEnhancedFields } from '~/src/models/forms/editor-v2/enhanced-fields.js'
import { getDefaultLocationInstructions } from '~/src/models/forms/editor-v2/location-instruction-defaults.js'

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
 * @param {ComponentDef} question
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
  const isLocationField = isLocationFieldType(question.type)

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
  const locationExtras = isLocationField
    ? {
        giveInstructions: /** @type {LocationFieldComponent} */ (question)
          .options.instructionText
          ? 'true'
          : undefined,
        instructionText: /** @type {LocationFieldComponent} */ (question)
          .options.instructionText
      }
    : {}

  return {
    classes: /** @type {FormComponentsDef} */ (question).options.classes,
    ...numberExtras,
    ...dateExtras,
    ...minMaxExtras,
    ...multilineExtras,
    ...regexExtras,
    ...locationExtras
  }
}

/**
 * @param {string[]} options
 * @param {ComponentDef} question
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
    const fieldSettings =
      allAdvancedSettingsFields[
        /** @type {keyof typeof allAdvancedSettingsFields} */ (fieldName)
      ]
    let value = formValues[fieldName]

    if (
      fieldName === QuestionAdvancedSettings.InstructionText &&
      !value &&
      isLocationFieldType(question.type)
    ) {
      const defaultInstruction = getDefaultLocationInstructions(question.type)
      if (defaultInstruction) {
        value = defaultInstruction
      }
    }

    if (fieldName === QuestionAdvancedSettings.GiveInstructions) {
      return {
        ...fieldSettings,
        ...insertValidationErrors(
          formErrors ? formErrors[fieldName] : undefined
        ),
        items: fieldSettings.items?.map((item) => ({
          ...item,
          checked: isCheckboxSelected(
            /** @type {string | undefined} */ (formValues[fieldName])
          )
        }))
      }
    }

    return {
      ...fieldSettings,
      ...insertValidationErrors(formErrors ? formErrors[fieldName] : undefined),
      value
    }
  })
}

/**
 * @param {string[]} options
 * @param {ComponentDef} question
 * @param {ValidationFailure<FormEditor>} [validation]
 * @returns {GovukField[]}
 */
export function enhancedFields(options, question, validation) {
  const formValues =
    /** @type { Record<string, string | boolean | number | undefined> } */ (
      validation?.formValues ?? mapToQuestionOptions(question)
    )
  const formErrors = validation?.formErrors

  return options.map((fieldName) => {
    const fieldSettings =
      allEnhancedFields[
        /** @type {keyof typeof allEnhancedFields} */ (fieldName)
      ]
    return {
      ...fieldSettings,
      ...insertValidationErrors(formErrors ? formErrors[fieldName] : undefined),
      value: formValues[fieldName]
    }
  })
}

/**
 * @typedef {EastingNorthingFieldComponent | OsGridRefFieldComponent | NationalGridFieldNumberFieldComponent | LatLongFieldComponent} LocationFieldComponent
 */

/**
 * @import { ComponentDef, DatePartsFieldComponent, EastingNorthingFieldComponent, FileUploadFieldComponent, FormComponentsDef, FormEditor, GovukField, LatLongFieldComponent, MonthYearFieldComponent, MultilineTextFieldComponent, NationalGridFieldNumberFieldComponent, NumberFieldComponent, OsGridRefFieldComponent, TextFieldComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
