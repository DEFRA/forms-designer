import { ComponentType, Engine } from '@defra/forms-model'

import {
  buildDefinition,
  buildFileUploadComponent,
  buildQuestionPage
} from '~/src/__stubs__/form-definition.js'
import { getSelectedFileTypesFromCSV } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  getDetails,
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

  describe('getSelectedFileTypes', () => {
    test('should ignore when not file upload Field', () => {
      const res = getSelectedFileTypesFromCSV(undefined)
      expect(res).toEqual({
        fileTypes: undefined,
        documentTypes: undefined,
        imageTypes: undefined,
        tabularDataTypes: undefined
      })
    })

    test('should handle no types selected', () => {
      const res = getSelectedFileTypesFromCSV({
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
      const res = getSelectedFileTypesFromCSV({
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
      const res = getSelectedFileTypesFromCSV({
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
      const res = getSelectedFileTypesFromCSV({
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
      const res = getSelectedFileTypesFromCSV({
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

  describe('getDetails', () => {
    it('should handle edits', () => {
      const metadata = {
        id: '67dd518b1f5c8b6e357e39cb',
        slug: 'autocomplete',
        title: 'Autocomplete',
        organisation: 'Defra',
        teamName: 'Forms Team',
        teamEmail: 'name@example.gov.uk',
        draft: {
          createdAt: new Date(),
          createdBy: {
            id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
            displayName: 'Joe Bloggs (Acme)'
          },
          updatedAt: new Date(),
          updatedBy: {
            id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
            displayName: 'Joe Bloggs (Acme)'
          }
        },
        createdBy: {
          id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
          displayName: 'Joe Bloggs (Acme)'
        },
        createdAt: new Date(),
        updatedBy: {
          id: '84305e4e-1f52-43d0-a123-9c873b0abb35',
          displayName: 'Joe Bloggs (Acme)'
        },
        updatedAt: new Date()
      }
      const pageId = '54c46977-005f-4917-bcb5-9f502a4fb508'
      const questionId = 'a592818a-cc2d-459f-a567-3af95e3f1d0e'

      const definition = buildDefinition({
        name: 'Autocomplete',
        pages: [
          buildQuestionPage({
            id: pageId,
            title: 'Supporting Evidence',
            components: [
              buildFileUploadComponent({
                name: 'ridhiw',
                shortDescription: 'supporting evidence',
                hint: '',
                options: { required: true, accept: 'pdf' },
                schema: {},
                id: questionId
              })
            ]
          })
        ],
        lists: [
          {
            title: 'What is your favourite programming language?',
            name: 'XddNUm',
            type: 'string',
            items: [
              { text: 'JavaScript', value: 'javascript' },
              { text: 'TypeScript', value: 'typescript' },
              { text: 'Java', value: 'java' },
              { text: 'Python', value: 'python' },
              { text: 'C#', value: 'csharp' },
              { text: 'Erlang', value: 'erlang' },
              { text: 'Haskell', value: 'haskell' },
              { text: 'Elixir', value: 'elixir' }
            ],
            id: '63ba14e5-9a08-4d16-97d9-fbb35fd5e248'
          }
        ],
        engine: Engine.V2
      })

      const details = getDetails(
        metadata,
        definition,
        pageId,
        questionId,
        undefined
      )
      expect(details.question.type).toBe('FileUploadField')
    })
  })
})

/**
 * @import { ComponentDef, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem } from '~/src/common/helpers/types.js'
 */
