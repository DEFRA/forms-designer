import { ComponentType, Engine } from '@defra/forms-model'

import {
  buildDefinition,
  buildFileUploadComponent,
  buildQuestionPage
} from '~/src/__stubs__/form-definition.js'
import { getSelectedFileTypesFromCSVMimeTypes } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  getDetails,
  getEnhancedFields,
  getExtraFields,
  getListDetails,
  hasDataOrErrorForDisplay,
  mapToQuestionDetails,
  overrideFormValuesForEnhancedAction
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

  describe('getSelectedFileTypesFromCSVMimeTypes', () => {
    test('should ignore when not file upload Field', () => {
      const res = getSelectedFileTypesFromCSVMimeTypes(undefined)
      expect(res).toEqual({
        fileTypes: undefined,
        documentTypes: undefined,
        imageTypes: undefined,
        tabularDataTypes: undefined
      })
    })

    test('should handle no types selected', () => {
      const res = getSelectedFileTypesFromCSVMimeTypes({
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
      const res = getSelectedFileTypesFromCSVMimeTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept:
            'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
      const res = getSelectedFileTypesFromCSVMimeTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: 'image/jpeg'
        }
      })
      expect(res).toEqual({
        fileTypes: ['images'],
        documentTypes: [],
        imageTypes: ['jpg'],
        tabularDataTypes: []
      })
    })

    test('should handle tabular data types selected', () => {
      const res = getSelectedFileTypesFromCSVMimeTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: 'text/csv'
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
      const res = getSelectedFileTypesFromCSVMimeTypes({
        name: '',
        title: '',
        schema: {},
        type: ComponentType.FileUploadField,
        options: {
          accept: 'text/csv,image/jpeg,application/msword'
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

  describe('overrideFormValuesForEnhancedAction', () => {
    test('should ignore if validation undefined', () => {
      expect(
        overrideFormValuesForEnhancedAction(undefined, undefined)
      ).toBeUndefined()
    })

    test('should ignore if radioId not set', () => {
      expect(
        overrideFormValuesForEnhancedAction(
          /** @type {ValidationFailure<FormEditor>} */ ({ formValues: {} }),
          /** @type {QuestionSessionState} */ ({})
        )
      ).toEqual({ formValues: {} })
    })

    test('should override if radioId is set', () => {
      expect(
        overrideFormValuesForEnhancedAction(
          undefined,
          /** @type {QuestionSessionState} */ ({
            editRow: { radioId: '12345' }
          })
        )
      ).toEqual({ formValues: { radioId: '12345' }, formErrors: {} })
    })
  })

  describe('getEnhancedFields', () => {
    test('should return radio fields', () => {
      expect(
        getEnhancedFields(
          /** @type {ComponentDef} */ ({
            type: ComponentType.RadiosField,
            options: {}
          }),
          undefined
        )
      ).toEqual([
        {
          id: 'radioId',
          name: 'radioId',
          value: undefined
        },
        {
          name: 'radioText',
          id: 'radioText',
          label: {
            text: 'Item',
            classes: 'govuk-label--m'
          }
        },
        {
          name: 'radioHint',
          id: 'radioHint',
          label: {
            text: 'Hint text (optional)',
            classes: 'govuk-label--m'
          }
        },
        {
          name: 'radioValue',
          id: 'radioValue',
          label: {
            text: 'Unique identifier (optional)',
            classes: 'govuk-label--m'
          },
          hint: {
            text: 'Used in databases to identify the item'
          }
        }
      ])
    })
  })

  describe('getListDetails', () => {
    test('should return correct details if no rows', () => {
      expect(
        getListDetails(undefined, /** @type {ComponentDef} */ ({}))
      ).toEqual({
        list: '',
        rowNumBeingEdited: 1,
        listItemCount: 0
      })
    })

    test('should return max if no matching id', () => {
      expect(
        getListDetails(
          {
            editRow: {},
            questionDetails: {},
            listItems: [
              { id: '1', text: '1', value: '1' },
              { id: '2', text: '2', value: '2' },
              { id: '3', text: '3', value: '3' }
            ]
          },
          /** @type {ComponentDef} */ ({ list: 'listname' })
        )
      ).toEqual({
        list: 'listname',
        listItemCount: 3,
        rowNumBeingEdited: 4
      })
    })

    test('should return 2 if editing row 2', () => {
      expect(
        getListDetails(
          {
            editRow: { radioId: '2' },
            questionDetails: {},
            listItems: [
              { id: '1', text: '1', value: '1' },
              { id: '2', text: '2', value: '2' },
              { id: '3', text: '3', value: '3' },
              { id: '4', text: '4', value: '4' }
            ]
          },
          /** @type {ComponentDef} */ ({ list: 'listname' })
        )
      ).toEqual({
        list: 'listname',
        listItemCount: 4,
        rowNumBeingEdited: 2
      })
    })
  })
})

/**
 * @import { ComponentDef, QuestionSessionState, FormEditor, GovukField, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
