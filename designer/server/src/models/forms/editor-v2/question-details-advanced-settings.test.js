import { ComponentType } from '@defra/forms-model'

import {
  addDateFieldProperties,
  addMinMaxFieldProperties,
  addMultiLineFieldProperties,
  addNumberFieldProperties,
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
})
