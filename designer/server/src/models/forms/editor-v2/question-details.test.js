import { ComponentType } from '@defra/forms-model'

import {
  getExtraFields,
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
})

/**
 * @import { ComponentDef, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
