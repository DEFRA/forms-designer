import {
  ComponentType,
  GeospatialFieldGeometryTypesEnum
} from '@defra/forms-model'

import { isLocationFieldType } from '~/src/common/constants/component-types.js'
import { QuestionAdvancedSettings } from '~/src/common/constants/editor.js'
import {
  hasCheckedValue,
  insertValidationErrors,
  isCheckboxSelected
} from '~/src/lib/utils.js'
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
    maxPast: question.options.maxDaysInPast,
    earliestDate: question.options.earliestDate,
    latestDate: question.options.latestDate
  }
}

/**
 * @param { LocationFieldComponent } question
 */
export function addLocationFieldProperties(question) {
  return {
    giveInstructions: question.options.instructionText ? 'true' : undefined,
    instructionText: question.options.instructionText
  }
}

/**
 * @param { GeospatialFieldComponent } question
 */
export function addGeospatialFieldProperties(question) {
  return {
    countries: question.options.countries ?? ['any'],
    geometryTypes:
      question.options.geometryTypes ??
      Object.values(GeospatialFieldGeometryTypesEnum)
  }
}

/**
 * @param { TextFieldComponent | MultilineTextFieldComponent | NumberFieldComponent | FileUploadFieldComponent | CheckboxesFieldComponent | GeospatialFieldComponent } question
 */
export function addMinMaxFieldProperties(question) {
  if (question.type === ComponentType.FileUploadField) {
    return {
      exactFiles: question.schema.length,
      minFiles: question.schema.min,
      maxFiles: question.schema.max
    }
  }
  if (question.type === ComponentType.CheckboxesField) {
    return {
      exactChecks: question.schema?.length,
      minChecks: question.schema?.min,
      maxChecks: question.schema?.max
    }
  }
  if (question.type === ComponentType.GeospatialField) {
    return {
      exactFeatures: question.schema?.length,
      minFeatures: question.schema?.min,
      maxFeatures: question.schema?.max
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
    ComponentType.FileUploadField,
    ComponentType.CheckboxesField,
    ComponentType.GeospatialField
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
    ? addLocationFieldProperties(
        /** @type {LocationFieldComponent} */ (question)
      )
    : {}
  const geospatialExtras =
    question.type === ComponentType.GeospatialField
      ? addGeospatialFieldProperties(question)
      : {}

  return {
    classes: /** @type {FormComponentsDef} */ (question).options.classes,
    ...numberExtras,
    ...dateExtras,
    ...minMaxExtras,
    ...multilineExtras,
    ...regexExtras,
    ...locationExtras,
    ...geospatialExtras
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
          ...(question.type === ComponentType.NationalGridFieldNumberField && {
            hint: undefined
          }),
          checked: isCheckboxSelected(
            /** @type {string | undefined} */ (formValues[fieldName])
          )
        }))
      }
    }

    if (fieldName === QuestionAdvancedSettings.GeometryTypes) {
      // Re-apply checkbox values
      return {
        ...fieldSettings,
        ...insertValidationErrors(
          formErrors ? formErrors[fieldName] : undefined
        ),
        items: fieldSettings.items?.map((item) => ({
          ...item,
          checked: hasCheckedValue(
            /** @type {string[] | undefined} */ (formValues[fieldName]),
            item.value
          )
        }))
      }
    }

    if (
      (fieldName === QuestionAdvancedSettings.EarliestDate ||
        fieldName === QuestionAdvancedSettings.LatestDate) &&
      fieldSettings.items?.length &&
      fieldSettings.items.length === 3
    ) {
      // Split date into component parts
      const dateParts = /** @type {string} */ (value ?? '').split('-')
      fieldSettings.items[0].value = dateParts[2]
      fieldSettings.items[1].value = dateParts[1]
      fieldSettings.items[2].value = dateParts[0]
      return {
        ...fieldSettings,
        ...insertValidationErrors(
          formErrors ? formErrors[fieldName] : undefined
        )
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
 * @import { ComponentDef, DatePartsFieldComponent, EastingNorthingFieldComponent, FileUploadFieldComponent, CheckboxesFieldComponent, FormComponentsDef, FormEditor, GovukField, LatLongFieldComponent, MonthYearFieldComponent, MultilineTextFieldComponent, NationalGridFieldNumberFieldComponent, NumberFieldComponent, OsGridRefFieldComponent, TextFieldComponent, GeospatialFieldComponent } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
