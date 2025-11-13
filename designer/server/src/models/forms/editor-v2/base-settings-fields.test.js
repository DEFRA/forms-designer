import { ComponentType } from '@defra/forms-model'
import { ValidationError } from 'joi'

import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import {
  baseSchema,
  getFieldList,
  getFieldValue,
  getFileUploadFields,
  getQuestionFieldList
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
          formGroup: {
            classes: 'app-settings-checkboxes'
          },
          items: [
            {
              value: 'true',
              text: 'Make this question optional',
              checked: false
            }
          ]
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
            text: "Enter a short description for this question like 'Licence period'. Short descriptions are used in error messages and on the check your answers page."
          },
          value: undefined
        }
      ]
      expect(
        getFieldList(
          undefined,
          ComponentType.TextField,
          undefined,
          buildDefinition()
        )
      ).toEqual(expectedArray)
    })

    test('should check the checkbox if optional has been set', () => {
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
          formGroup: {
            classes: 'app-settings-checkboxes'
          },
          items: [
            {
              value: 'true',
              text: 'Make this question optional',
              checked: true
            }
          ]
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
            text: "Enter a short description for this question like 'Licence period'. Short descriptions are used in error messages and on the check your answers page."
          },
          value: undefined
        }
      ]
      expect(
        getFieldList(
          /** @type {InputFieldsComponentsDef} */ ({
            options: { required: false }
          }),
          ComponentType.TextField,
          undefined,
          buildDefinition()
        )
      ).toEqual(expectedArray)
    })

    test('should handle reconstructing autocomplete textarea during error condition', () => {
      const expectedResult = {
        id: 'autoCompleteOptions',
        name: 'autoCompleteOptions',
        idPrefix: 'autoCompleteOptions',
        label: {
          text: 'Add each option on a new line',
          classes: 'govuk-label--s',
          isPageHeading: false
        },
        hint: {
          text: 'To optionally set an input value for each item, separate the option text and value with a colon (e.g English:en-gb)'
        },
        value: 'Red:red\r\nGreen:green\r\nBlue:blue',
        customTemplate: 'auto-complete-options'
      }
      const validationInError = {
        formValues: {
          question: 'My autocomplete question',
          hint: '',
          shortDescription: 'Autocomplete',
          autoCompleteOptions: [
            { text: 'Red', value: 'red' },
            { text: 'Green', value: 'green' },
            { text: 'Blue', value: 'blue' }
          ]
        },
        formErrors: {},
        questionType: 'Autocomplete'
      }
      const res = getFieldList(
        /** @type {InputFieldsComponentsDef} */ ({
          options: { required: true }
        }),
        ComponentType.AutocompleteField,
        // @ts-expect-error - types do not need to match for this test
        validationInError,
        buildDefinition()
      )

      const autoCompleteRes = res.find((x) => x.name === 'autoCompleteOptions')
      expect(autoCompleteRes).toEqual(expectedResult)
    })

    it('should get the postcode lookup field for a UKAddressComponent', () => {
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
          formGroup: {
            classes: 'app-settings-checkboxes'
          },
          items: [
            {
              value: 'true',
              text: 'Make this question optional',
              checked: false
            }
          ]
        },
        {
          name: 'usePostcodeLookup',
          id: 'usePostcodeLookup',
          classes: 'govuk-checkboxes--small',
          formGroup: {
            classes: 'app-settings-checkboxes'
          },
          items: [
            {
              value: 'true',
              text: 'Use postcode lookup',
              hint: {
                text: 'Allow users to search for an address using a postcode'
              },
              checked: false
            }
          ]
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
            text: "Enter a short description for this question like 'Licence period'. Short descriptions are used in error messages and on the check your answers page."
          },
          value: undefined
        }
      ]
      expect(
        getFieldList(
          undefined,
          ComponentType.UkAddressField,
          undefined,
          buildDefinition()
        )
      ).toEqual(expectedArray)
    })

    it('should get the declaration text field for a DeclarationComponent', () => {
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
          name: 'declarationText',
          id: 'declarationText',
          idPrefix: 'declarationText',
          label: {
            text: 'Declaration text',
            classes: 'govuk-label--m'
          },
          hint: {
            text: 'You can use Markdown if you want to format the content or add links'
          },
          value: undefined,
          preContent: {
            path: '../../../../views/forms/editor-v2/partials/help-writing-declaration.njk'
          },
          postContent: {
            path: '../../../../views/forms/editor-v2/partials/markdown-help.njk'
          }
        },
        {
          name: 'questionOptional',
          id: 'questionOptional',
          classes: 'govuk-checkboxes--small',
          formGroup: {
            classes: 'app-settings-checkboxes'
          },
          items: [
            {
              value: 'true',
              text: 'Make this question optional',
              checked: false
            }
          ]
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
            text: "Enter a short description for this question like 'Licence period'. Short descriptions are used in error messages and on the check your answers page."
          },
          value: undefined
        }
      ]
      expect(
        getFieldList(
          undefined,
          ComponentType.DeclarationField,
          undefined,
          buildDefinition()
        )
      ).toEqual(expectedArray)
    })
  })

  describe('getFieldComponentType', () => {
    test('should throw if invalid or not implemented field type', () => {
      expect(() => getFieldComponentType({ name: ComponentType.Html })).toThrow(
        'Invalid or not implemented field name setting (Html)'
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

    test('should return MultilineTextField for AutoComplete', () => {
      expect(getFieldComponentType({ name: 'autoCompleteOptions' })).toBe(
        ComponentType.MultilineTextField
      )
    })
  })

  describe('baseSchema', () => {
    it('should validate correctly when autocomplete is sent', () => {
      const payload = {
        question: 'What is your first language',
        hintText: '',
        autoCompleteOptions:
          'English:en-gb\r\n' +
          'French:fr-FR\r\n' +
          'German:de-DE\r\n' +
          'Spanish:es-ES\r\n' +
          'Polish:pl-PL\r\n' +
          'Ukrainian:uk-UA',
        shortDescription: 'first language',
        questionType: 'AutocompleteField',
        name: 'ZlUnKg'
      }

      const validated = baseSchema.validate(payload)
      expect(validated.error).toBeUndefined()
      expect(validated.value).toEqual({
        question: 'What is your first language',
        hintText: '',
        autoCompleteOptions: [
          { text: 'English', value: 'en-gb' },
          { text: 'French', value: 'fr-FR' },
          { text: 'German', value: 'de-DE' },
          { text: 'Spanish', value: 'es-ES' },
          { text: 'Polish', value: 'pl-PL' },
          { text: 'Ukrainian', value: 'uk-UA' }
        ],
        shortDescription: 'first language',
        questionType: 'AutocompleteField',
        name: 'ZlUnKg',
        documentTypes: [],
        imageTypes: [],
        tabularDataTypes: [],
        fileTypes: []
      })
    })

    it('should autofill value if not defined', () => {
      const payload = {
        question: 'What is your first language',
        hintText: '',
        autoCompleteOptions:
          'English\r\n' +
          'French\r\n' +
          'German\r\n' +
          'Spanish\r\n' +
          'Polish\r\n' +
          'Ukrainian',
        shortDescription: 'first language',
        questionType: 'AutocompleteField',
        name: 'ZlUnKg'
      }

      const validated = baseSchema.validate(payload)
      expect(validated.error).toBeUndefined()
      expect(validated.value).toEqual({
        question: 'What is your first language',
        hintText: '',
        autoCompleteOptions: [
          { text: 'English', value: 'English' },
          { text: 'French', value: 'French' },
          { text: 'German', value: 'German' },
          { text: 'Spanish', value: 'Spanish' },
          { text: 'Polish', value: 'Polish' },
          { text: 'Ukrainian', value: 'Ukrainian' }
        ],
        shortDescription: 'first language',
        questionType: 'AutocompleteField',
        name: 'ZlUnKg',
        documentTypes: [],
        imageTypes: [],
        tabularDataTypes: [],
        fileTypes: []
      })
    })

    it('should fail validation if autocomplete is empty', () => {
      const payload = {
        question: 'What is your first language',
        hintText: '',
        autoCompleteOptions: '',
        shortDescription: 'first language',
        questionType: 'AutocompleteField',
        name: 'ZlUnKg'
      }

      const validated = baseSchema.validate(payload)
      expect(validated.error).toEqual(
        new ValidationError(
          'Enter at least one option for users to choose from',
          [],
          []
        )
      )
      expect(validated.value).toEqual({
        ...payload,
        documentTypes: [],
        fileTypes: [],
        imageTypes: [],
        tabularDataTypes: []
      })
    })

    it('should fail validation if text is empty', () => {
      const payload = {
        question: 'What is your first language',
        hintText: '',
        autoCompleteOptions: ':',
        shortDescription: 'first language',
        questionType: 'AutocompleteField',
        name: 'ZlUnKg'
      }

      const validated = baseSchema.validate(payload)
      expect(validated.error).toEqual(
        new ValidationError('Enter options separated by a colon', [], [])
      )
      expect(validated.value).toEqual({
        ...payload,
        documentTypes: [],
        fileTypes: [],
        imageTypes: [],
        tabularDataTypes: []
      })
    })

    it('should fail validation if parsing fails', () => {
      const payload = {
        question: 'What is your first language',
        hintText: '',
        autoCompleteOptions: 'adf:::::::Adfdfadf::::\r\n',
        shortDescription: 'first language',
        questionType: 'AutocompleteField',
        name: 'ZlUnKg'
      }

      const validated = baseSchema.validate(payload)
      expect(validated.error).toEqual(
        new ValidationError('Enter options separated by a colon', [], [])
      )
    })
  })

  describe('getQuestionFieldList', () => {
    test('should return fileTypes for FileUploadField', () => {
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

    test('should return usePostcodeLookup for UkAddressField', () => {
      const ukAddressField = getQuestionFieldList(ComponentType.UkAddressField)
      expect(ukAddressField).toHaveLength(5)
      expect(ukAddressField[0]).toBe('question')
      expect(ukAddressField[3]).toBe('usePostcodeLookup')
    })

    test('should return autocomplete fields for AutocompleteField', () => {
      const autocompleteFields = getQuestionFieldList(
        ComponentType.AutocompleteField
      )
      expect(autocompleteFields).toHaveLength(5)
      expect(autocompleteFields[3]).toBe('autoCompleteOptions')
    })

    test('should return location fields for EastingNorthingField', () => {
      const locationFields = getQuestionFieldList(
        ComponentType.EastingNorthingField
      )
      expect(locationFields).toHaveLength(4)
      expect(locationFields[0]).toBe('question')
      expect(locationFields[1]).toBe('hintText')
    })

    test('should return location fields for OsGridRefField', () => {
      const locationFields = getQuestionFieldList(ComponentType.OsGridRefField)
      expect(locationFields).toHaveLength(4)
      expect(locationFields[0]).toBe('question')
    })

    test('should return location fields for NationalGridFieldNumberField', () => {
      const locationFields = getQuestionFieldList(
        ComponentType.NationalGridFieldNumberField
      )
      expect(locationFields).toHaveLength(4)
      expect(locationFields[0]).toBe('question')
    })

    test('should return location fields for LatLongField', () => {
      const locationFields = getQuestionFieldList(ComponentType.LatLongField)
      expect(locationFields).toHaveLength(4)
      expect(locationFields[0]).toBe('question')
    })

    test('should return base fields for SelectField', () => {
      const selectFields = getQuestionFieldList(ComponentType.SelectField)
      expect(selectFields).toHaveLength(5)
      expect(selectFields[4]).toBe('radiosOrCheckboxes')
    })

    test('should return base fields for undefined question type', () => {
      const fields = getQuestionFieldList(undefined)
      expect(fields).toHaveLength(4)
      expect(fields[0]).toBe('question')
    })

    test('should return base fields for unmapped question type', () => {
      const fields = getQuestionFieldList(ComponentType.TextField)
      expect(fields).toHaveLength(4)
      expect(fields[0]).toBe('question')
    })
  })

  describe('getFieldValue', () => {
    test('should return validation result when available', () => {
      const validation = /** @type {ValidationFailure<FormEditor>} */ ({
        formValues: {
          question: 'Validated question'
        },
        formErrors: {}
      })
      const result = getFieldValue(
        'question',
        undefined,
        validation,
        buildDefinition(),
        undefined
      )
      expect(result).toBe('Validated question')
    })

    test('should return question field from component', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        title: 'Test question',
        type: ComponentType.TextField,
        name: 'test',
        options: {},
        schema: {}
      })
      const result = getFieldValue(
        'question',
        questionFields,
        undefined,
        buildDefinition(),
        undefined
      )
      expect(result).toBe('Test question')
    })

    test('should return hint text from component', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        hint: 'Test hint',
        type: ComponentType.TextField,
        name: 'test',
        title: 'test',
        options: {},
        schema: {}
      })
      const result = getFieldValue(
        'hintText',
        questionFields,
        undefined,
        buildDefinition(),
        undefined
      )
      expect(result).toBe('Test hint')
    })

    test('should return short description from component', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        shortDescription: 'Short desc',
        type: ComponentType.TextField,
        name: 'test',
        title: 'test',
        options: {},
        schema: {}
      })
      const result = getFieldValue(
        'shortDescription',
        questionFields,
        undefined,
        buildDefinition(),
        undefined
      )
      expect(result).toBe('Short desc')
    })

    test('should return questionOptional as string', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        type: ComponentType.TextField,
        name: 'test',
        title: 'test',
        options: {
          required: false
        },
        schema: {}
      })
      const result = getFieldValue(
        'questionOptional',
        questionFields,
        undefined,
        buildDefinition(),
        undefined
      )
      expect(result).toBe('true')
    })

    test('should return default hint for location field without hint', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        type: ComponentType.EastingNorthingField,
        name: 'location',
        title: 'Location',
        options: {}
      })
      const result = getFieldValue(
        'hintText',
        questionFields,
        undefined,
        buildDefinition(),
        ComponentType.EastingNorthingField
      )
      expect(result).toBe('For example. Easting: 248741, Northing: 63688')
    })

    test('should replace location hint when switching field types', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        type: ComponentType.OsGridRefField,
        name: 'location',
        title: 'Location',
        hint: 'For example. Easting: 248741, Northing: 63688',
        options: {}
      })
      const result = getFieldValue(
        'hintText',
        questionFields,
        undefined,
        buildDefinition(),
        ComponentType.OsGridRefField
      )
      expect(result).toBe(
        'An OS grid reference number is made up of 2 letters followed by 10 numbers, for example, TQ123456'
      )
    })

    test('should keep custom hint for location field', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        type: ComponentType.EastingNorthingField,
        name: 'location',
        title: 'Location',
        hint: 'Custom hint text',
        options: {}
      })
      const result = getFieldValue(
        'hintText',
        questionFields,
        undefined,
        buildDefinition(),
        ComponentType.EastingNorthingField
      )
      expect(result).toBe('Custom hint text')
    })

    test('should return usePostcodeLookup as string', () => {
      const questionFields = /** @type {FormComponentsDef} */ ({
        type: ComponentType.UkAddressField,
        name: 'address',
        title: 'Address',
        options: {
          usePostcodeLookup: true
        }
      })
      const result = getFieldValue(
        'usePostcodeLookup',
        questionFields,
        undefined,
        buildDefinition(),
        undefined
      )
      expect(result).toBe('true')
    })

    test('should return undefined for unknown field', () => {
      const result = getFieldValue(
        /** @type {any} */ ('unknownField'),
        undefined,
        undefined,
        buildDefinition(),
        undefined
      )
      expect(result).toBeUndefined()
    })
  })

  describe('getFileUploadFields', () => {
    test('should return file upload fields without validation', () => {
      const questionFields = /** @type {ComponentDef} */ ({
        type: ComponentType.FileUploadField,
        name: 'upload',
        title: 'Upload',
        options: {
          accept: 'application/pdf'
        },
        schema: {}
      })
      const result = getFileUploadFields(questionFields, undefined)
      expect(result).toHaveProperty('fileTypes')
      expect(result).toHaveProperty('documentTypes')
      expect(result).toHaveProperty('imageTypes')
      expect(result).toHaveProperty('tabularDataTypes')
    })

    test('should return file upload fields with validation', () => {
      const validation = /** @type {unknown} */ ({
        formValues: {
          fileTypes: ['documents'],
          documentTypes: ['pdf']
        },
        formErrors: {
          fileTypes: { text: 'Error on file types' }
        }
      })
      const result = getFileUploadFields(
        undefined,
        /** @type {ValidationFailure<FormEditor>} */ (validation)
      )
      expect(result.fileTypes).toHaveProperty('errorMessage')
      expect(result.fileTypes.errorMessage).toEqual({
        text: 'Error on file types'
      })
    })
  })
})

/**
 * @import { ComponentDef, FormComponentsDef, FormEditor, InputFieldsComponentsDef } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
