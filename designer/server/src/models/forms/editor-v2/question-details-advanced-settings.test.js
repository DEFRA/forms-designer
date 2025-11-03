import { ComponentType } from '@defra/forms-model'

import {
  addDateFieldProperties,
  addMinMaxFieldProperties,
  addMultiLineFieldProperties,
  addNumberFieldProperties,
  addRegexFieldProperties,
  advancedSettingsFields,
  enhancedFields,
  mapToQuestionOptions
} from '~/src/models/forms/editor-v2/question-details-advanced-settings.js'

describe('editor-v2 - question details advanced settings model', () => {
  describe('addNumberFieldProperties', () => {
    test('should return the correct construct', () => {
      const res = addNumberFieldProperties({
        type: ComponentType.NumberField,
        name: 'number',
        title: 'number',
        schema: {
          min: 1,
          max: 100,
          precision: 2
        },
        options: {
          prefix: 'pr',
          suffix: 'su'
        }
      })
      expect(res).toEqual({
        min: 1,
        max: 100,
        precision: 2,
        prefix: 'pr',
        suffix: 'su'
      })
    })
  })

  describe('addDateFieldProperties', () => {
    test('should return the correct construct', () => {
      const res = addDateFieldProperties({
        type: ComponentType.DatePartsField,
        name: 'date',
        title: 'date',
        options: {
          maxDaysInFuture: 100,
          maxDaysInPast: 50
        }
      })
      expect(res).toEqual({
        maxFuture: 100,
        maxPast: 50
      })
    })
  })

  describe('addMultiLineFieldProperties', () => {
    test('should return the correct construct', () => {
      const res = addMultiLineFieldProperties({
        type: ComponentType.MultilineTextField,
        name: 'multi',
        title: 'multi',
        options: {
          rows: 4
        },
        schema: {}
      })
      expect(res).toEqual({
        rows: 4
      })
    })
  })

  describe('mapToQuestionOptions', () => {
    test('should map a date field correcltly', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.DatePartsField,
        name: 'date',
        title: 'date title',
        options: {
          maxDaysInFuture: 100,
          maxDaysInPast: 50,
          classes: 'classes'
        }
      })
      expect(res).toEqual({
        maxFuture: 100,
        maxPast: 50,
        classes: 'classes',
        regex: undefined,
        rows: undefined
      })
    })

    test('should map a number field correcltly', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.NumberField,
        name: 'number',
        title: 'number title',
        options: {
          prefix: 'pr',
          suffix: 'su',
          classes: 'classes'
        },
        schema: {
          precision: 2,
          min: 3,
          max: 9
        }
      })
      expect(res).toEqual({
        max: 9,
        maxLength: 9,
        min: 3,
        minLength: 3,
        precision: 2,
        classes: 'classes',
        prefix: 'pr',
        suffix: 'su'
      })
    })
  })

  describe('addMinMaxFieldProperties', () => {
    test('should add minLength/maxLength if not file upload', () => {
      const res = addMinMaxFieldProperties({
        type: ComponentType.TextField,
        name: '',
        title: '',
        options: {},
        schema: {
          min: 1,
          max: 10
        }
      })
      expect(res).toEqual({
        minLength: 1,
        maxLength: 10
      })
    })

    test('should add minFiles/maxFiles if file upload', () => {
      const res = addMinMaxFieldProperties({
        type: ComponentType.FileUploadField,
        name: '',
        title: '',
        options: {},
        schema: {
          min: 1,
          max: 10
        }
      })
      expect(res).toEqual({
        minFiles: 1,
        maxFiles: 10
      })
    })

    test('should add exactFiles if file upload', () => {
      const res = addMinMaxFieldProperties({
        type: ComponentType.FileUploadField,
        name: '',
        title: '',
        options: {},
        schema: {
          length: 3
        }
      })
      expect(res).toEqual({
        exactFiles: 3
      })
    })
  })

  describe('addRegexFieldProperties', () => {
    test('should return regex property', () => {
      const res = addRegexFieldProperties({
        type: ComponentType.TextField,
        name: 'text',
        title: 'text',
        options: {},
        schema: {
          regex: '^[A-Z]+'
        }
      })
      expect(res).toEqual({
        regex: '^[A-Z]+'
      })
    })
  })

  describe('mapToQuestionOptions - additional tests', () => {
    test('should map a multiline field correctly', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.MultilineTextField,
        name: 'multi',
        title: 'multi title',
        options: {
          rows: 5,
          classes: 'custom'
        },
        schema: {
          min: 10,
          max: 500,
          regex: '^test'
        }
      })
      expect(res).toEqual({
        classes: 'custom',
        minLength: 10,
        maxLength: 500,
        rows: 5,
        regex: '^test'
      })
    })

    test('should map a text field with regex correctly', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.TextField,
        name: 'text',
        title: 'text title',
        options: {
          classes: 'text-class'
        },
        schema: {
          min: 1,
          max: 50,
          regex: '^[A-Z]+'
        }
      })
      expect(res).toEqual({
        classes: 'text-class',
        minLength: 1,
        maxLength: 50,
        regex: '^[A-Z]+'
      })
    })

    test('should map a file upload field correctly', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.FileUploadField,
        name: 'upload',
        title: 'upload title',
        options: {
          classes: 'upload-class'
        },
        schema: {
          min: 1,
          max: 3
        }
      })
      expect(res).toEqual({
        classes: 'upload-class',
        minFiles: 1,
        maxFiles: 3
      })
    })

    test('should map a location field correctly', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.EastingNorthingField,
        name: 'location',
        title: 'location title',
        options: {
          classes: 'location-class',
          instructionText: 'Follow these instructions'
        }
      })
      expect(res).toEqual({
        classes: 'location-class',
        giveInstructions: 'true',
        instructionText: 'Follow these instructions'
      })
    })

    test('should map a location field without instructions', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.OsGridRefField,
        name: 'location',
        title: 'location title',
        options: {
          classes: 'location-class'
        }
      })
      expect(res).toEqual({
        classes: 'location-class',
        giveInstructions: undefined,
        instructionText: undefined
      })
    })

    test('should map a MonthYearField correctly', () => {
      const res = mapToQuestionOptions({
        type: ComponentType.MonthYearField,
        name: 'month',
        title: 'month title',
        options: {
          maxDaysInFuture: 365,
          maxDaysInPast: 730,
          classes: 'month-class'
        }
      })
      expect(res).toEqual({
        maxFuture: 365,
        maxPast: 730,
        classes: 'month-class'
      })
    })
  })

  describe('advancedSettingsFields', () => {
    test('should return fields without validation', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.NumberField,
        name: 'number',
        title: 'number title',
        options: {
          prefix: '£',
          suffix: '/hour'
        },
        schema: {
          min: 1,
          max: 100
        }
      })
      const result = advancedSettingsFields(['prefix', 'suffix'], question)
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('value', '£')
      expect(result[1]).toHaveProperty('value', '/hour')
    })

    test('should return fields with validation errors', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.TextField,
        name: 'text',
        title: 'text title',
        options: {},
        schema: {}
      })
      const validation = /** @type {unknown} */ ({
        formValues: {
          minLength: '5',
          maxLength: '10'
        },
        formErrors: {
          minLength: { text: 'Error on min' }
        }
      })
      const result = advancedSettingsFields(
        ['minLength', 'maxLength'],
        question,
        /** @type {any} */ (validation)
      )
      expect(result).toHaveLength(2)
      expect(/** @type {any} */ (result[0])).toHaveProperty('errorMessage')
      expect(/** @type {any} */ (result[0]).errorMessage).toEqual({
        text: 'Error on min'
      })
      expect(result[0]).toHaveProperty('value', '5')
      expect(result[1]).toHaveProperty('value', '10')
    })

    test('should populate default instruction text for location fields', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.EastingNorthingField,
        name: 'location',
        title: 'location title',
        options: {}
      })
      const result = advancedSettingsFields(['instructionText'], question)
      expect(result).toHaveLength(1)
      expect(result[0].value).toContain('MAGIC map tool')
      expect(result[0].value).toContain('Easting and Northing')
    })

    test('should use validation value over default for location instruction', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.OsGridRefField,
        name: 'location',
        title: 'location title',
        options: {}
      })
      const validation = /** @type {unknown} */ ({
        formValues: {
          instructionText: 'Custom instruction'
        },
        formErrors: {}
      })
      const result = advancedSettingsFields(
        ['instructionText'],
        question,
        /** @type {any} */ (validation)
      )
      expect(result).toHaveLength(1)
      expect(result[0].value).toBe('Custom instruction')
    })

    test('should handle checkbox fields', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.NumberField,
        name: 'number',
        title: 'number title',
        options: {},
        schema: {}
      })
      const validation = /** @type {unknown} */ ({
        formValues: {
          giveInstructions: 'true'
        },
        formErrors: {}
      })
      const result = advancedSettingsFields(
        ['giveInstructions'],
        question,
        /** @type {any} */ (validation)
      )
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('items')
      expect(result[0].items?.[0]).toHaveProperty('checked', true)
    })
  })

  describe('enhancedFields', () => {
    test('should return enhanced fields without validation', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.TextField,
        name: 'text',
        title: 'text title',
        options: {
          classes: 'custom-class'
        },
        schema: {}
      })
      const result = enhancedFields(['classes'], question)
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('value', 'custom-class')
    })

    test('should return enhanced fields with validation', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.TextField,
        name: 'text',
        title: 'text title',
        options: {},
        schema: {}
      })
      const validation = /** @type {unknown} */ ({
        formValues: {
          classes: 'validated-class'
        },
        formErrors: {
          classes: { text: 'Error on classes' }
        }
      })
      const result = enhancedFields(
        ['classes'],
        question,
        /** @type {any} */ (validation)
      )
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('value', 'validated-class')
      expect(/** @type {any} */ (result[0])).toHaveProperty('errorMessage')
      expect(/** @type {any} */ (result[0]).errorMessage).toEqual({
        text: 'Error on classes'
      })
    })
  })

  describe('mapToQuestionOptions - null and undefined handling', () => {
    test('should handle undefined question gracefully', () => {
      const result = mapToQuestionOptions(
        /** @type {ComponentDef} */ (/** @type {unknown} */ (undefined))
      )
      expect(result).toEqual({ classes: undefined })
    })

    test('should handle null question gracefully', () => {
      const result = mapToQuestionOptions(
        /** @type {ComponentDef} */ (/** @type {unknown} */ (null))
      )
      expect(result).toEqual({ classes: undefined })
    })

    test('should handle question without type', () => {
      const result = mapToQuestionOptions(
        /** @type {ComponentDef} */ ({
          name: 'test',
          title: 'test',
          options: {}
        })
      )
      expect(result).toEqual({ classes: undefined })
    })
  })

  describe('advancedSettingsFields - null and undefined handling', () => {
    test('should handle undefined question gracefully', () => {
      const question = /** @type {ComponentDef} */ (
        /** @type {unknown} */ (undefined)
      )
      const result = advancedSettingsFields(['classes'], question)
      expect(result).toHaveLength(1)
    })

    test('should not populate defaults for non-location fields', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.TextField,
        name: 'text',
        title: 'text title',
        options: {},
        schema: {}
      })
      const result = advancedSettingsFields(['instructionText'], question)
      expect(result).toHaveLength(1)
      expect(result[0].value).toBeUndefined()
    })

    test('should not populate instruction defaults if value already exists', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.EastingNorthingField,
        name: 'location',
        title: 'location title',
        options: {
          instructionText: 'Custom instructions'
        }
      })
      const validation = /** @type {unknown} */ ({
        formValues: {
          instructionText: 'Custom instructions'
        },
        formErrors: {}
      })
      const result = advancedSettingsFields(
        ['instructionText'],
        question,
        /** @type {any} */ (validation)
      )
      expect(result).toHaveLength(1)
      expect(result[0].value).toBe('Custom instructions')
    })

    test('should handle location field with undefined type gracefully', () => {
      const question = /** @type {ComponentDef} */ ({
        name: 'location',
        title: 'location title',
        options: {}
      })
      const result = advancedSettingsFields(['instructionText'], question)
      expect(result).toHaveLength(1)
      expect(result[0].value).toBeUndefined()
    })
  })
})

/**
 * @import { ComponentDef } from '@defra/forms-model'
 */
