import { ComponentType } from '@defra/forms-model'

import {
  getAdditionalSchema,
  getFieldComponentType,
  mapFileTypes,
  mapQuestionDetails
} from '~/src/models/forms/editor-v2/advanced-settings-fields.js'

describe('editor-v2 - advanced settings fields model', () => {
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

    test('should return TextField for Min', () => {
      expect(getFieldComponentType({ name: 'min' })).toBe(
        ComponentType.TextField
      )
    })

    test('should return TextField for Max', () => {
      expect(getFieldComponentType({ name: 'max' })).toBe(
        ComponentType.TextField
      )
    })
  })

  describe('mapQuestionDetails', () => {
    test('should return minimal model', () => {
      const res = mapQuestionDetails({})
      expect(res).toEqual({
        type: undefined,
        title: undefined,
        name: undefined,
        shortDescription: undefined,
        hint: undefined,
        options: {
          required: true
        },
        schema: {}
      })
    })

    test('should return minimal model with fields populated', () => {
      const res = mapQuestionDetails({
        questionType: 'type',
        question: 'title',
        name: 'name',
        shortDescription: 'shortDescription',
        hintText: 'hint',
        questionOptional: 'Y'
      })
      expect(res).toEqual({
        type: 'type',
        title: 'title',
        name: 'name',
        shortDescription: 'shortDescription',
        hint: 'hint',
        options: {
          required: false
        },
        schema: {}
      })
    })

    test('should return model with options and schema properties populated', () => {
      const res = mapQuestionDetails({
        questionType: 'type',
        question: 'title',
        name: 'name',
        shortDescription: 'shortDescription',
        hintText: 'hint',
        questionOptional: 'Y',
        classes: 'classes',
        rows: '10',
        prefix: 'prefix',
        suffix: 'suffix',
        maxFuture: '50',
        maxPast: '100',
        minLength: '5',
        maxLength: '15',
        regex: 'regex',
        precision: '2'
      })
      expect(res).toEqual({
        type: 'type',
        title: 'title',
        name: 'name',
        shortDescription: 'shortDescription',
        hint: 'hint',
        options: {
          classes: 'classes',
          required: false,
          rows: '10',
          prefix: 'prefix',
          suffix: 'suffix',
          maxDaysInFuture: '50',
          maxDaysInPast: '100'
        },
        schema: {
          min: '5',
          max: '15',
          regex: 'regex',
          precision: '2'
        }
      })
    })
  })

  describe('mapFileTypes', () => {
    test('should combine all types into one list', () => {
      expect(
        mapFileTypes({
          fileTypes: ['documents', 'images', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: ['jpg', 'png'],
          tabularDataTypes: ['csv']
        }).accept
      ).toBe('doc,docx,jpg,png,csv')
    })

    test('should remove sub-types if parent type not selected', () => {
      expect(
        mapFileTypes({
          fileTypes: ['documents', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: ['jpg', 'png'],
          tabularDataTypes: ['csv']
        }).accept
      ).toBe('doc,docx,csv')
    })

    test('should remove sub-types even if no sub-types, if parent type not selected', () => {
      expect(
        mapFileTypes({
          fileTypes: ['documents', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: undefined,
          tabularDataTypes: ['csv']
        }).accept
      ).toBe('doc,docx,csv')
    })

    test('should handle undefined lists', () => {
      expect(
        mapFileTypes({
          fileTypes: [],
          documentTypes: undefined,
          imageTypes: undefined,
          tabularDataTypes: undefined
        })
      ).toEqual({})
    })
  })

  describe('getAdditionalSchema', () => {
    test('should handle minLength/maxLength', () => {
      expect(
        getAdditionalSchema({
          minLength: '1',
          maxLength: '2'
        })
      ).toEqual({ min: '1', max: '2' })
    })

    test('should handle min/max', () => {
      expect(
        getAdditionalSchema({
          min: '1',
          max: '2'
        })
      ).toEqual({ min: '1', max: '2' })
    })

    test('should handle minFiles/maxFiles', () => {
      expect(
        getAdditionalSchema({
          minFiles: '1',
          maxFiles: '2'
        })
      ).toEqual({ min: '1', max: '2' })
    })
  })
})
