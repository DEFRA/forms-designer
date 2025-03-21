import { ComponentType } from '@defra/forms-model'

import {
  getExtraFields,
  getSelectedFileTypes,
  hasDataOrErrorForDisplay,
  mapToQuestionDetails
} from '~/src/models/forms/editor-v2/question-details.js'

const fieldNames = ['minLength', 'maxLength', 'regex', 'classes']

const fieldArrayWithNoValues = /** @type {GovukField[]} */ ([
  {
    name: 'minLength',
    value: undefined
  },
  {
    name: 'maxLength',
    value: undefined
  },
  {
    name: 'regex',
    value: ''
  }
])

const fieldArrayWithSomeValues = /** @type {GovukField[]} */ ([
  {
    name: 'minLength',
    value: '5'
  },
  {
    name: 'maxLength',
    value: undefined
  }
])

describe('editor-v2 - question details model', () => {
  describe('hasDataOrErrorForDisplay', () => {
    test('should return false if no errors and no field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([])
      expect(
        hasDataOrErrorForDisplay(fieldNames, errorList, fieldArrayWithNoValues)
      ).toBeFalsy()
    })

    test('should return true if no errors but some field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([])
      expect(
        hasDataOrErrorForDisplay(
          fieldNames,
          errorList,
          fieldArrayWithSomeValues
        )
      ).toBeTruthy()
    })

    test('should return true if errors and no field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([
        { href: '#minLength' }
      ])
      expect(
        hasDataOrErrorForDisplay(fieldNames, errorList, fieldArrayWithNoValues)
      ).toBeTruthy()
    })

    test('should return true if errors and also some field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([
        { href: '#minLength' }
      ])
      expect(
        hasDataOrErrorForDisplay(
          fieldNames,
          errorList,
          fieldArrayWithSomeValues
        )
      ).toBeTruthy()
    })
  })

  describe('getOptionalFields', () => {
    test('should return textfield optional field', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.TextField,
        schema: {},
        options: {}
      })
      const res = getExtraFields(question, undefined)
      expect(res[0].id).toBe('minLength')
    })

    test('should return no extra options if type not yet implemented', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.YesNoField,
        schema: {},
        options: {},
        name: '',
        title: ''
      })
      const res = getExtraFields(question, undefined)
      expect(res[0]).toBeUndefined()
    })
  })

  describe('mapToQuestionDetails', () => {
    test('should map if question undefined', () => {
      const res = mapToQuestionDetails(undefined)
      expect(res).toEqual({
        name: expect.any(String),
        question: undefined,
        hintText: undefined,
        questionOptional: 'false',
        shortDescription: undefined
      })
      expect(res.name).toBeDefined()
    })

    test('should map if question has values', () => {
      const question = /** @type {InputFieldsComponentsDef} */ ({
        name: 'name',
        title: 'title',
        hint: 'hintText',
        options: { required: false },
        shortDescription: 'shortDescription'
      })
      const res = mapToQuestionDetails(question)
      expect(res).toEqual({
        name: 'name',
        question: 'title',
        hintText: 'hintText',
        questionOptional: 'true',
        shortDescription: 'shortDescription'
      })
    })

    test('should map extra fields if question is FileUploadComponent', () => {
      const question = /** @type {InputFieldsComponentsDef} */ ({
        name: 'name',
        title: 'title',
        hint: 'hintText',
        options: { required: false },
        shortDescription: 'shortDescription',
        type: ComponentType.FileUploadField
      })
      const res = mapToQuestionDetails(question)
      expect(res).toEqual({
        name: 'name',
        question: 'title',
        hintText: 'hintText',
        questionOptional: 'true',
        shortDescription: 'shortDescription',
        fileTypes: [],
        documentTypes: [],
        imageTypes: [],
        tabularDataTypes: []
      })
    })
  })

  describe('getSelectedFileTypes', () => {
    test('should ignore when not file upload Field', () => {
      const res = getSelectedFileTypes(undefined)
      expect(res).toEqual({
        fileTypes: undefined,
        documentTypes: undefined,
        imageTypes: undefined,
        tabularDataTypes: undefined
      })
    })

    test('should handle no types selected', () => {
      const res = getSelectedFileTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: undefined
        }
      })
      expect(res).toEqual({
        fileTypes: { fileTypes: [] },
        documentTypes: { documentTypes: [] },
        imageTypes: { imageTypes: [] },
        tabularDataTypes: { tabularDataTypes: [] }
      })
    })

    test('should handle doc types selected', () => {
      const res = getSelectedFileTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: 'doc,docx'
        }
      })
      expect(res).toEqual({
        fileTypes: { fileTypes: ['documents'] },
        documentTypes: { documentTypes: ['doc', 'docx'] },
        imageTypes: { imageTypes: [] },
        tabularDataTypes: { tabularDataTypes: [] }
      })
    })

    test('should handle image types selected', () => {
      const res = getSelectedFileTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: 'jpg,jpeg'
        }
      })
      expect(res).toEqual({
        fileTypes: { fileTypes: ['images'] },
        documentTypes: { documentTypes: [] },
        imageTypes: { imageTypes: ['jpg', 'jpeg'] },
        tabularDataTypes: { tabularDataTypes: [] }
      })
    })

    test('should handle tabular data types selected', () => {
      const res = getSelectedFileTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: 'csv'
        }
      })
      expect(res).toEqual({
        fileTypes: { fileTypes: ['tabular-data'] },
        documentTypes: { documentTypes: [] },
        imageTypes: { imageTypes: [] },
        tabularDataTypes: { tabularDataTypes: ['csv'] }
      })
    })

    test('should handle all types selected', () => {
      const res = getSelectedFileTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: 'csv,jpg,doc'
        }
      })
      expect(res).toEqual({
        fileTypes: { fileTypes: ['documents', 'images', 'tabular-data'] },
        documentTypes: { documentTypes: ['doc'] },
        imageTypes: { imageTypes: ['jpg'] },
        tabularDataTypes: { tabularDataTypes: ['csv'] }
      })
    })
  })
})

/**
 * @import { ComponentDef, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
