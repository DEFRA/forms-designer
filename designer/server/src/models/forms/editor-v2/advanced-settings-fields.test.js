import { ComponentType } from '@defra/forms-model'

import {
  getFieldComponentType,
  mapQuestionDetails
} from '~/src/models/forms/editor-v2/advanced-settings-fields.js'

describe('editor-v2 - advanced settings fields model', () => {
  describe('getFieldComponentType', () => {
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
})
