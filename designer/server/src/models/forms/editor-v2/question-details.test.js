import { ComponentType } from '@defra/forms-model'

import {
  getOptionalFields,
  hasDataOrErrorForDisplay,
  mapToQuestionDetails
} from '~/src/models/forms/editor-v2/question-details.js'

const fieldNames = ['minLength', 'maxLength', 'regex', 'classes']

const fieldsWithNoValues = /** @type {{ fields: FormEditorGovukField }} */ ({
  fields: {
    minLength: {
      value: undefined
    }
  }
})

const fieldsWithSomeValues = /** @type {{ fields: FormEditorGovukField }} */ ({
  fields: {
    minLength: {
      value: '3'
    }
  }
})

describe('editor-v2 - question details model', () => {
  describe('hasDataOrErrorForDisplay', () => {
    test('should return false if no errors and no field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([])
      expect(
        hasDataOrErrorForDisplay(fieldNames, errorList, fieldsWithNoValues)
      ).toBeFalsy()
    })

    test('should return true if no errors but some field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([])
      expect(
        hasDataOrErrorForDisplay(fieldNames, errorList, fieldsWithSomeValues)
      ).toBeTruthy()
    })

    test('should return true if errors and no field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([
        { href: '#minLength' }
      ])
      expect(
        hasDataOrErrorForDisplay(fieldNames, errorList, fieldsWithNoValues)
      ).toBeTruthy()
    })

    test('should return true if errors and also some field values', () => {
      const errorList = /** @type {ErrorDetailsItem[]} */ ([
        { href: '#minLength' }
      ])
      expect(
        hasDataOrErrorForDisplay(fieldNames, errorList, fieldsWithSomeValues)
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
      const res = getOptionalFields(question, undefined)
      expect(res.optionalFieldsPartial).toBe('question-details-textfield.njk')
      expect(res.fields.minLength?.id).toBe('minLength')
    })

    test('should return no extra options if type not yet implemented', () => {
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.FileUploadField,
        schema: {},
        options: {}
      })
      const res = getOptionalFields(question, undefined)
      expect(res.optionalFieldsPartial).toBeNull()
      expect(res.fields).toEqual({})
    })
  })

  describe('mapToQuestionDetails', () => {
    test('should map if question undefined', () => {
      const res = mapToQuestionDetails(undefined)
      expect(res).toEqual({
        name: expect.anything(),
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
  })
})

/**
 * @import { ComponentDef, FormEditorGovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
