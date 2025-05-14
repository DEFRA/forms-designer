import { insertTags } from '~/src/lib/error-preview-helper.js'

describe('Error-preview-help functions', () => {
  describe('insertTags', () => {
    test('should handle simple label', () => {
      expect(insertTags('Select {{#label}}', 'required')).toBe(
        'Select <span class="error-preview-shortDescription">{{#label}}</span>'
      )
    })

    test('should handle simple title', () => {
      expect(insertTags('Select {{#title}}', 'required')).toBe(
        'Select <span class="error-preview-shortDescription">{{#title}}</span>'
      )
    })

    test('should handle label with function', () => {
      expect(insertTags('Enter {{lowerFirst(#label)}}', 'required')).toBe(
        'Enter <span class="error-preview-shortDescription" data-templatefunc="lowerFirst">{{lowerFirst(#label)}}</span>'
      )
    })

    test('should handle label and limit', () => {
      expect(
        insertTags(
          '{{#label}} must have less than {{#limit}} characters',
          'min'
        )
      ).toBe(
        '<span class="error-preview-shortDescription">{{#label}}</span> must have less than <span class="error-preview-min">{{#limit}}</span> characters'
      )
    })
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 * @import { Yar, ValidationSessionKey } from '@hapi/yar'
 */
