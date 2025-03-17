import { ComponentType } from '@defra/forms-model'

import { getFieldComponentType } from '~/src/models/forms/editor-v2/question-details-advanced-settings.js'

describe('editor-v2 - question details advanced settings model', () => {
  describe('getFieldComponentType', () => {
    test('should throw if invalid or not implemented field type', () => {
      expect(() => getFieldComponentType({ name: ComponentType.Html })).toThrow(
        'Invalid or not implemented advanced setting field name (Html)'
      )
    })

    test('should return TextField for MinLength', () => {
      expect(getFieldComponentType({ name: 'minLength' })).toBe(
        ComponentType.TextField
      )
    })

    test('should return TextField for MaxLength', () => {
      expect(getFieldComponentType({ name: 'maxLength' })).toBe(
        ComponentType.TextField
      )
    })

    test('should return TextField for Regex', () => {
      expect(getFieldComponentType({ name: 'regex' })).toBe(
        ComponentType.MultilineTextField
      )
    })

    test('should return TextField for Classes', () => {
      expect(getFieldComponentType({ name: 'classes' })).toBe(
        ComponentType.MultilineTextField
      )
    })
  })
})

/**
 * @import { ComponentDef, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
