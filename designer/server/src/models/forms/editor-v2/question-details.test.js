import { ComponentType, Engine } from '@defra/forms-model'
import {
  buildDefinition,
  buildFileUploadComponent,
  buildList,
  buildListItem,
  buildQuestionPage
} from '@defra/forms-model/stubs'

import { getSelectedFileTypesFromCSVMimeTypes } from '~/src/models/forms/editor-v2/base-settings-fields.js'
import {
  getDetails,
  getEnhancedFields,
  getErrorTemplates,
  getExtraFields,
  getListDetails,
  handleAutocomplete,
  hasDataOrErrorForDisplay,
  mapToQuestionDetails,
  overrideFormValuesForEnhancedAction,
  questionDetailsViewModel
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
          buildList({
            title: 'What is your favourite programming language?',
            name: 'XddNUm',
            type: 'string',
            items: [
              buildListItem({ text: 'JavaScript', value: 'javascript' }),
              buildListItem({ text: 'TypeScript', value: 'typescript' }),
              buildListItem({ text: 'Java', value: 'java' }),
              buildListItem({ text: 'Python', value: 'python' }),
              buildListItem({ text: 'C#', value: 'csharp' }),
              buildListItem({ text: 'Erlang', value: 'erlang' }),
              buildListItem({ text: 'Haskell', value: 'haskell' }),
              buildListItem({ text: 'Elixir', value: 'elixir' })
            ],
            id: '63ba14e5-9a08-4d16-97d9-fbb35fd5e248'
          })
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
          },
          hint: {
            text: 'Use single short sentence without a full stop'
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
        rowNumBeingEdited: 1
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
        rowNumBeingEdited: 2
      })
    })
  })

  describe('getErrorTemplates', () => {
    test('should get error templates for YesNoField', () => {
      const result = getErrorTemplates(ComponentType.YesNoField)
      expect(result).toBeDefined()
      expect(result.baseErrors).toBeDefined()
    })

    test('should get error templates for TextField', () => {
      const result = getErrorTemplates(ComponentType.TextField)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('baseErrors')
      expect(result).toHaveProperty('advancedSettingsErrors')
    })

    test('should handle undefined questionType', () => {
      const result = getErrorTemplates(undefined)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('baseErrors')
    })
  })

  describe('questionDetailsViewModel', () => {
    test('should return view model for basic question', () => {
      const metadata = {
        id: '12345',
        slug: 'test-form',
        title: 'Test Form',
        organisation: 'Defra',
        teamName: 'Forms Team',
        teamEmail: 'test@example.com',
        draft: {
          createdAt: new Date(),
          createdBy: { id: '123', displayName: 'Test User' },
          updatedAt: new Date(),
          updatedBy: { id: '123', displayName: 'Test User' }
        },
        createdBy: { id: '123', displayName: 'Test User' },
        createdAt: new Date(),
        updatedBy: { id: '123', displayName: 'Test User' },
        updatedAt: new Date()
      }

      const pageId = 'page-id'
      const questionId = 'question-id'
      const stateId = 'state-id'

      const definition = buildDefinition({
        name: 'Test Form',
        pages: [
          buildQuestionPage({
            id: pageId,
            title: 'Test Page',
            path: '/test-page',
            components: [
              buildFileUploadComponent({
                id: questionId,
                name: 'upload',
                title: 'Upload a file',
                type: ComponentType.FileUploadField
              })
            ]
          })
        ]
      })

      const result = questionDetailsViewModel(
        metadata,
        definition,
        pageId,
        questionId,
        stateId
      )

      expect(result).toBeDefined()
      expect(result.cardTitle).toBe('Question 1')
      expect(result.cardCaption).toBe('Page 1')
      expect(result.navigation).toBeDefined()
      expect(result.previewPageUrl).toContain('/test-page')
      expect(result.questionType).toBe(ComponentType.FileUploadField)
      expect(result.model).toEqual({
        classes: '',
        hint: {
          classes: '',
          text: undefined
        },
        id: 'inputField',
        label: {
          classes: 'govuk-label--l',
          text: 'Upload a file'
        },
        name: 'inputField'
      })
    })

    test('should handle state with questionType override', () => {
      const metadata = {
        id: '12345',
        slug: 'test-form',
        title: 'Test Form',
        organisation: 'Defra',
        teamName: 'Forms Team',
        teamEmail: 'test@example.com',
        draft: {
          createdAt: new Date(),
          createdBy: { id: '123', displayName: 'Test User' },
          updatedAt: new Date(),
          updatedBy: { id: '123', displayName: 'Test User' }
        },
        createdBy: { id: '123', displayName: 'Test User' },
        createdAt: new Date(),
        updatedBy: { id: '123', displayName: 'Test User' },
        updatedAt: new Date()
      }

      const pageId = 'page-id'
      const questionId = 'question-id'
      const stateId = 'state-id'

      const definition = buildDefinition({
        name: 'Test Form',
        pages: [
          buildQuestionPage({
            id: pageId,
            title: 'Test Page',
            path: '/test-page',
            components: [
              buildFileUploadComponent({
                id: questionId,
                name: 'upload',
                title: 'Upload a file'
              })
            ]
          })
        ]
      })

      const state = {
        questionType: ComponentType.TextField
      }

      const result = questionDetailsViewModel(
        metadata,
        definition,
        pageId,
        questionId,
        stateId,
        undefined,
        state
      )

      expect(result).toBeDefined()
      expect(result.questionType).toBe(ComponentType.TextField)
    })
  })

  describe('handleAutocomplete', () => {
    test('should ignore if not autocomplete', () => {
      const lists = /** @type {List[]} */ ([])
      const state = {
        listItems: [{ text: 'item1', value: 'item1' }]
      }
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.TextField
      })
      expect(handleAutocomplete(question, state, lists)).toEqual(lists)
    })

    test('should ignore if no state', () => {
      const lists = /** @type {List[]} */ ([])
      const state = {}
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.AutocompleteField
      })
      expect(handleAutocomplete(question, state, lists)).toEqual(lists)
    })

    test('should process', () => {
      const lists = /** @type {List[]} */ ([
        {
          id: 'my-list-id',
          name: 'my-list-name',
          type: 'string',
          title: 'List for test question',
          items: [
            { id: 'id1', text: 'Item 1', value: 'item1' },
            { id: 'id2', text: 'Item 2', value: 'item2' }
          ]
        }
      ])
      const state = {
        listItems: [{ id: 'id3', text: 'Item 3', value: 'item3' }]
      }
      const question = /** @type {ComponentDef} */ ({
        type: ComponentType.AutocompleteField,
        list: 'my-list-id'
      })
      expect(handleAutocomplete(question, state, lists)).toEqual([
        {
          id: 'my-list-id',
          name: 'my-list-name',
          type: 'string',
          title: 'List for test question',
          items: [{ id: 'id3', text: 'Item 3', value: 'item3' }]
        }
      ])
    })
  })
})

/**
 * @import { ComponentDef, QuestionSessionState, FormEditor, GovukField, InputFieldsComponentsDef, List } from '@defra/forms-model'
 * @import { ErrorDetailsItem, ValidationFailure } from '~/src/common/helpers/types.js'
 */
