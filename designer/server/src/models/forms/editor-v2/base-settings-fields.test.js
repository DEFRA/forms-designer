import { ComponentType } from '@defra/forms-model'

import { mapQuestionDetails } from '~/src/models/forms/editor-v2/advanced-settings-fields.js'
import { getFieldList } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'
import { getFieldComponentType } from '~/src/models/forms/editor-v2/page-fields.js'

describe('editor-v2 - advanced settings fields model', () => {
  describe('getFieldList', () => {
    it('should get the default list of fields', () => {
      const expectedArray = [
        {
          name: 'question',
          id: 'question',
          label: {
            text: 'Question',
            classes: GOVUK_LABEL__M
          },
          value: undefined
        },
        {
          name: 'hintText',
          id: 'hintText',
          label: {
            text: 'Hint text (optional)',
            classes: GOVUK_LABEL__M
          },
          rows: 3,
          value: undefined
        },
        {
          name: 'questionOptional',
          id: 'questionOptional',
          classes: 'govuk-checkboxes--small',
          items: [
            {
              value: 'true',
              text: 'Make this question optional',
              checked: false
            }
          ],
          value: 'false'
        },
        {
          id: 'shortDescription',
          name: 'shortDescription',
          idPrefix: 'shortDescription',
          label: {
            text: 'Short description',
            classes: GOVUK_LABEL__M
          },
          hint: {
            text: "Enter a short description for this question like 'licence period'. Short descriptions are used in error messages and on the check your answers page."
          },
          value: undefined
        }
      ]
      expect(
        getFieldList(undefined, ComponentType.TextField, undefined)
      ).toEqual(expectedArray)
    })
  })
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
})
