import { ComponentType } from '@defra/forms-model'

import {
  getFieldList,
  getQuestionFieldList,
  mapPayloadToFileMimeTypes
} from '~/src/models/forms/editor-v2/base-settings-fields.js'
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

    test('should return FileUploadField for FileTypes', () => {
      expect(getFieldComponentType({ name: 'fileTypes' })).toBe(
        ComponentType.FileUploadField
      )
    })
  })

  describe('mapPayloadToFileMimeTypes', () => {
    test('should combine all types into one list', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'images', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: ['jpg', 'png'],
          tabularDataTypes: ['csv']
        }).accept
      ).toBe(
        'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,text/csv'
      )
    })

    test('should remove sub-types if parent type not selected', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: ['jpg', 'png'],
          tabularDataTypes: ['csv']
        }).accept
      ).toBe(
        'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv'
      )
    })

    test('should remove sub-types even if no sub-types, if parent type not selected', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'tabular-data'],
          documentTypes: ['doc', 'docx'],
          imageTypes: undefined,
          tabularDataTypes: ['csv']
        }).accept
      ).toBe(
        'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv'
      )
    })

    test('should handle undefined lists', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: [],
          documentTypes: undefined,
          imageTypes: undefined,
          tabularDataTypes: undefined
        })
      ).toEqual({})
    })

    test('should handle undefined lists even when parent selected', () => {
      expect(
        mapPayloadToFileMimeTypes({
          fileTypes: ['documents', 'images', 'tabular-data'],
          documentTypes: undefined,
          imageTypes: undefined,
          tabularDataTypes: undefined
        })
      ).toEqual({})
    })
  })

  describe('getQuestionFieldList', () => {
    test('should return TextField for MinLength', () => {
      const fileUploadFields = getQuestionFieldList(
        ComponentType.FileUploadField
      )
      expect(fileUploadFields).toHaveLength(5)
      expect(fileUploadFields[0]).toBe('question')
      expect(fileUploadFields[3]).toBe('fileTypes')
    })

    test('should return Radios or Checkboxes for Radios', () => {
      const res = getQuestionFieldList(ComponentType.RadiosField)
      expect(res).toHaveLength(5)
      expect(res[0]).toBe('question')
      expect(res[4]).toBe('radiosOrCheckboxes')
    })

    test('should return Radios or Checkboxes for Checkboxes', () => {
      const res = getQuestionFieldList(ComponentType.CheckboxesField)
      expect(res).toHaveLength(5)
      expect(res[0]).toBe('question')
      expect(res[4]).toBe('radiosOrCheckboxes')
    })
  })
})
