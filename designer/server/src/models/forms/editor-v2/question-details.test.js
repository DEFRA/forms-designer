import { ComponentType } from '@defra/forms-model'

import {
  addFileUploadFields,
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

const fieldArrayWithSomeZeroValues = /** @type {GovukField[]} */ ([
  {
    name: 'maxFuture',
    value: 0
  }
])

const fieldArrayWithMissingName = /** @type {GovukField[]} */ ([
  {
    name: undefined,
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

    test('should return true if no errors but some field values even if zero for specific fields', () => {
      const errorList = undefined
      expect(
        hasDataOrErrorForDisplay(
          fieldNames.concat('maxFuture'),
          errorList,
          fieldArrayWithSomeZeroValues
        )
      ).toBeTruthy()
    })

    test('should return false if no errors and no name in field', () => {
      const errorList = undefined
      expect(
        hasDataOrErrorForDisplay(
          fieldNames.concat('maxFuture'),
          errorList,
          fieldArrayWithMissingName
        )
      ).toBeFalsy()
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
        fileTypes: [],
        documentTypes: [],
        imageTypes: [],
        tabularDataTypes: []
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
        fileTypes: ['documents'],
        documentTypes: ['doc', 'docx'],
        imageTypes: [],
        tabularDataTypes: []
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
        fileTypes: ['images'],
        documentTypes: [],
        imageTypes: ['jpg', 'jpeg'],
        tabularDataTypes: []
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
        fileTypes: ['tabular-data'],
        documentTypes: [],
        imageTypes: [],
        tabularDataTypes: ['csv']
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
        fileTypes: ['documents', 'images', 'tabular-data'],
        documentTypes: ['doc'],
        imageTypes: ['jpg'],
        tabularDataTypes: ['csv']
      })
    })
  })

  describe('addFileUploadFields', () => {
    const fields = /** @type {{ fields: FormEditorGovukField }} */ ({
      fields: {
        question: {
          name: 'question',
          id: 'question',
          label: {
            text: 'Question'
          },
          value: 'question vale'
        },
        hintText: {
          name: 'hintText',
          id: 'hintText',
          label: {
            text: 'Hint text (optional)'
          },
          rows: 3,
          value: 'hint value'
        },
        questionOptional: {
          name: 'questionOptional',
          id: 'questionOptional',
          classes: 'govuk-checkboxes--small',
          items: [
            {
              value: 'true',
              text: 'Make this question optional',
              checked: false
            }
          ]
        },
        shortDescription: {
          id: 'shortDescription',
          name: 'shortDescription',
          idPrefix: 'shortDescription',
          label: {
            text: 'Short description'
          },
          value: 'shortDescription value'
        }
      }
    })

    const formValues = {
      name: 'name',
      hintText: undefined,
      tabularDataTypes: [],
      imageTypes: [],
      documentTypes: [],
      question: undefined,
      questionOptional: 'false',
      shortDescription: undefined
    }

    test('should ignore when not file upload', () => {
      const fieldsCloneForTest = structuredClone(fields)
      const fieldsCloneForCompare = structuredClone(fields)
      const res = addFileUploadFields(
        fieldsCloneForTest,
        ComponentType.TextField,
        formValues,
        {}
      )
      expect(res).toEqual(fieldsCloneForCompare)
    })

    test('should add file upload fields when file upload', () => {
      const fieldsCloneForTest = structuredClone(fields)
      const fieldsExpected = {
        fields: {
          question: {
            name: 'question',
            id: 'question',
            label: {
              text: 'Question'
            },
            value: 'question vale'
          },
          hintText: {
            name: 'hintText',
            id: 'hintText',
            label: {
              text: 'Hint text (optional)'
            },
            rows: 3,
            value: 'hint value'
          },
          questionOptional: {
            name: 'questionOptional',
            id: 'questionOptional',
            classes: 'govuk-checkboxes--small',
            items: [
              {
                value: 'true',
                text: 'Make this question optional',
                checked: false
              }
            ]
          },
          shortDescription: {
            id: 'shortDescription',
            name: 'shortDescription',
            idPrefix: 'shortDescription',
            label: {
              text: 'Short description'
            },
            value: 'shortDescription value'
          },
          fileTypes: {
            id: 'fileTypes',
            name: 'fileTypes',
            idPrefix: 'fileTypes',
            fieldset: {
              legend: {
                text: 'Select the file types you accept',
                isPageHeading: false,
                classes: 'govuk-fieldset__legend--m'
              }
            },
            items: [
              { text: 'Documents', value: 'documents' },
              { text: 'Images', value: 'images' },
              { text: 'Tabular data', value: 'tabular-data' }
            ]
          },
          documentTypes: {
            id: 'documentTypes',
            name: 'documentTypes',
            idPrefix: 'documentTypes',
            items: [
              { text: 'PDF', value: 'pdf' },
              { text: 'DOC', value: 'doc' },
              { text: 'DOCX', value: 'docx' },
              { text: 'ODT', value: 'odt' },
              { text: 'TXT', value: 'txt' }
            ]
          },
          imageTypes: {
            id: 'imageTypes',
            name: 'imageTypes',
            idPrefix: 'imageTypes',
            items: [
              { text: 'JPG', value: 'jpg' },
              { text: 'JPEG', value: 'jpeg' },
              { text: 'PNG', value: 'png' }
            ]
          },
          tabularDataTypes: {
            id: 'tabularDataTypes',
            name: 'tabularDataTypes',
            idPrefix: 'tabularDataTypes',
            items: [
              { text: 'XLS', value: 'xls' },
              { text: 'XLSX', value: 'xlsx' },
              { text: 'CSV', value: 'csv' },
              { text: 'ODS', value: 'ods' }
            ]
          }
        }
      }
      const res = addFileUploadFields(
        fieldsCloneForTest,
        ComponentType.FileUploadField,
        formValues,
        {}
      )
      expect(res).toEqual(fieldsExpected)
    })
  })
})

/**
 * @import { ComponentDef, FormEditorGovukField, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
