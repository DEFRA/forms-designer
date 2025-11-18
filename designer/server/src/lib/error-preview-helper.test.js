import { ComponentType } from '@defra/forms-model'

import * as helperModule from '~/src/lib/error-preview-helper.js'
import {
  determineLimit,
  findFileTypeMappings,
  getDateLimits,
  getFieldProperty,
  getFunctionAttribute,
  getNumberLimits,
  insertTags,
  isTypeForMinMax,
  lookupFileTypes,
  spanTag
} from '~/src/lib/error-preview-helper.js'

// Mock the module-level functions that are called by lookupFileTypes
jest.mock('~/src/lib/error-preview-helper.js', () => {
  const originalModule = jest.requireActual('~/src/lib/error-preview-helper.js')
  return {
    ...originalModule,
    findFileTypeMappings: jest.fn()
  }
})

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

  describe('lookupFileTypes', () => {
    test('should return formatted list of file types', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      findFileTypeMappings
        // @ts-expect-error - mockReturnValueOnce is not a function
        .mockReturnValueOnce(['PDF'])
        .mockReturnValueOnce(['JPG'])
        .mockReturnValueOnce(['CSV'])

      const result = lookupFileTypes('image/jpeg,application/pdf,text/csv')

      expect(result).toBe('PDF, JPG or CSV')
    })

    test('should handle single type', () => {
      findFileTypeMappings
        // @ts-expect-error - mockReturnValueOnce is not a function
        .mockReturnValueOnce([])
        .mockReturnValueOnce(['JPG'])
        .mockReturnValueOnce([])

      const result = lookupFileTypes('image/jpeg')

      expect(result).toBe('JPG')
    })

    test('should handle empty types', () => {
      // @ts-expect-error - mockReturnValueOnce is not a function
      findFileTypeMappings.mockReturnValue([])

      const result = lookupFileTypes('')

      expect(result).toBe('[files types you accept]')
    })
  })

  describe('getNumberLimits', () => {
    const fields = [
      { name: 'min', value: '5' },
      { name: 'max', value: '10' },
      { name: 'precision', value: '2' }
    ]

    test('should return min value', () => {
      const result = getNumberLimits(
        fields,
        ComponentType.NumberField,
        'numberMin'
      )
      expect(result).toBe('5')
    })

    test('should return max value', () => {
      const result = getNumberLimits(
        fields,
        ComponentType.NumberField,
        'numberMax'
      )
      expect(result).toBe('10')
    })

    test('should return precision value', () => {
      const result = getNumberLimits(
        fields,
        ComponentType.NumberField,
        'numberPrecision'
      )
      expect(result).toBe('2')
    })

    test('should return unknown for invalid property', () => {
      const result = getNumberLimits(
        fields,
        ComponentType.NumberField,
        'invalidProp'
      )
      expect(result).toBe('[unknown]')
    })
  })

  describe('getDateLimits', () => {
    const fields = [
      { name: 'maxPast', value: '30' },
      { name: 'maxFuture', value: '60' }
    ]

    test('should return dateMin value', () => {
      const result = getDateLimits(
        fields,
        ComponentType.DatePartsField,
        'dateMin'
      )
      expect(result).toBe('[max days in the past]')
    })

    test('should return dateMax value', () => {
      const result = getDateLimits(
        fields,
        ComponentType.DatePartsField,
        'dateMax'
      )
      expect(result).toBe('[max days in the future]')
    })

    test('should return unknown for invalid property', () => {
      const result = getDateLimits(
        fields,
        ComponentType.DatePartsField,
        'invalidProp'
      )
      expect(result).toBe('[unknown]')
    })
  })

  describe('determineLimit', () => {
    test('should determine limit for text field min', () => {
      const fields = [{ name: 'minLength', value: '5' }]
      const result = determineLimit('min', fields, ComponentType.TextField)
      expect(result).toBe('5')
    })

    test('should determine limit for file upload min', () => {
      const fields = [{ name: 'minFiles', value: '2' }]
      const result = determineLimit(
        'min',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('2')
    })

    test('should determine file type limits', () => {
      const fields = [{ name: 'accept', value: 'image/jpeg,image/png' }]

      // had issues with the mockReturnValueOnce so using spyOn
      const originalLookupFn = jest.spyOn(helperModule, 'lookupFileTypes')
      originalLookupFn.mockReturnValue('JPG or PNG')

      const result = determineLimit(
        'filesMimes',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('JPG or PNG')

      originalLookupFn.mockRestore()
    })

    test('should determine number limits', () => {
      const fields = [{ name: 'min', value: '5' }]
      const result = determineLimit(
        'numberMin',
        fields,
        ComponentType.NumberField
      )
      expect(result).toBe('5')
    })

    test('should determine date limits', () => {
      const fields = [{ name: 'maxPast', value: '30' }]
      const result = determineLimit(
        'dateMin',
        fields,
        ComponentType.DatePartsField
      )
      expect(result).toBe('[max days in the past]')
    })

    test('should handle filesMin limit type', () => {
      const fields = [{ name: 'minFiles', value: '3' }]
      const result = determineLimit(
        'filesMin',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('3')
    })

    test('should handle filesMax limit type', () => {
      const fields = [{ name: 'maxFiles', value: '10' }]
      const result = determineLimit(
        'filesMax',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('10')
    })

    test('should handle filesExact limit type', () => {
      const fields = [{ name: 'exactFiles', value: '5' }]
      const result = determineLimit(
        'filesExact',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('5')
    })

    test('should handle array.min limit type', () => {
      const fields = [{ name: 'minFiles', value: '2' }]
      const result = determineLimit(
        'array.min',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('2')
    })
  })

  describe('getFunctionAttribute', () => {
    test('should return data attribute for lowerFirst function', () => {
      const result = getFunctionAttribute('lowerFirst(#label)')
      expect(result).toBe(' data-templatefunc="lowerFirst"')
    })

    test('should return empty string for no function', () => {
      const result = getFunctionAttribute('#label')
      expect(result).toBe('')
    })
  })

  describe('spanTag', () => {
    test('should generate span tag with function attribute', () => {
      const result = spanTag('min', 'lowerFirst(#limit)')
      expect(result).toBe(
        '<span class="error-preview-min" data-templatefunc="lowerFirst">{{lowerFirst(#limit)}}</span>'
      )
    })

    test('should generate span tag without function attribute', () => {
      const result = spanTag('max', '#limit')
      expect(result).toBe('<span class="error-preview-max">{{#limit}}</span>')
    })
  })

  describe('isTypeForMinMax', () => {
    test('should return true for TextField', () => {
      expect(isTypeForMinMax(ComponentType.TextField)).toBe(true)
    })

    test('should return true for MultilineTextField', () => {
      expect(isTypeForMinMax(ComponentType.MultilineTextField)).toBe(true)
    })

    test('should return true for EmailAddressField', () => {
      expect(isTypeForMinMax(ComponentType.EmailAddressField)).toBe(true)
    })

    test('should return false for NumberField', () => {
      expect(isTypeForMinMax(ComponentType.NumberField)).toBe(false)
    })
  })

  describe('getFieldProperty', () => {
    test('should get property using mapping', () => {
      const fields = [{ name: 'minLength', value: '5' }]
      const result = getFieldProperty(
        fields,
        ComponentType.TextField,
        'min',
        'fallback'
      )
      expect(result).toBe('5')
    })

    test('should return fallback when property not found', () => {
      /** @type {Array<{name: string, value?: string | number | boolean | string[] | any[]}>} */
      const fields = []
      const result = getFieldProperty(
        fields,
        ComponentType.TextField,
        'min',
        'fallback'
      )
      expect(result).toBe('fallback')
    })
  })

  describe('file type limits', () => {
    test('should return image files when images field is true', () => {
      const fields = [{ name: 'images', value: true }]
      const result = determineLimit(
        'filesMimes',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('image files')
    })

    test('should return document files when documents field is true', () => {
      const fields = [{ name: 'documents', value: true }]
      const result = determineLimit(
        'filesMimes',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('document files')
    })
  })

  describe('insertTags edge cases', () => {
    test('should handle template with no delimiters', () => {
      const result = insertTags('This has no delimiters', 'required')
      expect(result).toBe('This has no delimiters')
    })

    test('should handle template with non-label/title content', () => {
      const result = insertTags('This has {{something}} else', 'required')
      expect(result).toBe('This has {{something}} else')
    })
  })

  describe('insertTags with shouldMarkFixed parameter', () => {
    test('should add data-fixed attribute when shouldMarkFixed is true', () => {
      const result = insertTags('Enter {{#label}}', 'string.empty', true)
      expect(result).toBe(
        'Enter <span class="error-preview-shortDescription" data-fixed="true">{{#label}}</span>'
      )
    })

    test('should NOT add data-fixed attribute when shouldMarkFixed is false', () => {
      const result = insertTags('Enter {{#label}}', 'string.empty', false)
      expect(result).toBe(
        'Enter <span class="error-preview-shortDescription">{{#label}}</span>'
      )
    })

    test('should NOT add data-fixed attribute when shouldMarkFixed is not provided', () => {
      const result = insertTags(
        '{{#label}} must be between {{#limit}}',
        'eastingMin'
      )
      expect(result).toBe(
        '<span class="error-preview-shortDescription">{{#label}}</span> must be between <span class="error-preview-eastingMin">{{#limit}}</span>'
      )
    })

    test('should handle fixed attribute with template function', () => {
      const result = insertTags(
        'Enter {{lowerFirst(#label)}}',
        'string.empty',
        true
      )
      expect(result).toBe(
        'Enter <span class="error-preview-shortDescription" data-templatefunc="lowerFirst" data-fixed="true">{{lowerFirst(#label)}}</span>'
      )
    })
  })

  describe('file upload limit types', () => {
    test('should handle array.max limit type', () => {
      const fields = [{ name: 'maxFiles', value: '8' }]
      const result = determineLimit(
        'array.max',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('8')
    })

    test('should handle array.length limit type', () => {
      const fields = [{ name: 'exactFiles', value: '4' }]
      const result = determineLimit(
        'array.length',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('4')
    })

    test('should handle max limit type', () => {
      const fields = [{ name: 'maxFiles', value: '15' }]
      const result = determineLimit(
        'max',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('15')
    })

    test('should handle length limit type', () => {
      const fields = [{ name: 'exactFiles', value: '7' }]
      const result = determineLimit(
        'length',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('7')
    })

    test('should handle type that includes mime', () => {
      const fields = [{ name: 'accept', value: 'image/jpeg' }]
      const originalLookupFn = jest.spyOn(helperModule, 'lookupFileTypes')
      originalLookupFn.mockReturnValue('JPG')

      const result = determineLimit(
        'file.mime',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('JPG')

      originalLookupFn.mockRestore()
    })

    test('should return fallback for unknown file upload type', () => {
      const fields = [{ name: 'accept', value: 'image/jpeg' }]
      const originalLookupFn = jest.spyOn(helperModule, 'lookupFileTypes')
      originalLookupFn.mockReturnValue('JPG')

      const result = determineLimit(
        'unknownType',
        fields,
        ComponentType.FileUploadField
      )
      expect(result).toBe('JPG')

      originalLookupFn.mockRestore()
    })
  })

  describe('location field limits', () => {
    test('should return easting min limit for EastingNorthingField', () => {
      const fields = [{ name: 'eastingMin', value: '100000' }]
      const result = determineLimit(
        'eastingMin',
        fields,
        ComponentType.EastingNorthingField
      )
      expect(result).toBe('100000')
    })

    test('should return easting max limit for EastingNorthingField', () => {
      const fields = [{ name: 'eastingMax', value: '700000' }]
      const result = determineLimit(
        'eastingMax',
        fields,
        ComponentType.EastingNorthingField
      )
      expect(result).toBe('700000')
    })

    test('should return northing min limit for EastingNorthingField', () => {
      const fields = [{ name: 'northingMin', value: '0' }]
      const result = determineLimit(
        'northingMin',
        fields,
        ComponentType.EastingNorthingField
      )
      expect(result).toBe('0')
    })

    test('should return northing max limit for EastingNorthingField', () => {
      const fields = [{ name: 'northingMax', value: '1300000' }]
      const result = determineLimit(
        'northingMax',
        fields,
        ComponentType.EastingNorthingField
      )
      expect(result).toBe('1300000')
    })

    test('should return latitude min limit for LatLongField', () => {
      const fields = [{ name: 'latitudeMin', value: '-90' }]
      const result = determineLimit(
        'latitudeMin',
        fields,
        ComponentType.LatLongField
      )
      expect(result).toBe('-90')
    })

    test('should return latitude max limit for LatLongField', () => {
      const fields = [{ name: 'latitudeMax', value: '90' }]
      const result = determineLimit(
        'latitudeMax',
        fields,
        ComponentType.LatLongField
      )
      expect(result).toBe('90')
    })

    test('should return longitude min limit for LatLongField', () => {
      const fields = [{ name: 'longitudeMin', value: '-180' }]
      const result = determineLimit(
        'longitudeMin',
        fields,
        ComponentType.LatLongField
      )
      expect(result).toBe('-180')
    })

    test('should return longitude max limit for LatLongField', () => {
      const fields = [{ name: 'longitudeMax', value: '180' }]
      const result = determineLimit(
        'longitudeMax',
        fields,
        ComponentType.LatLongField
      )
      expect(result).toBe('180')
    })
  })

  describe('multiline text field limits', () => {
    test('should determine limit for multiline text field max', () => {
      const fields = [{ name: 'maxLength', value: '500' }]
      const result = determineLimit(
        'max',
        fields,
        ComponentType.MultilineTextField
      )
      expect(result).toBe('500')
    })
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 * @import { Yar, ValidationSessionKey } from '@hapi/yar'
 */
