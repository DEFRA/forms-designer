import { ComponentType } from '@defra/forms-model'
import { ValidationError } from 'joi'

import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import {
  baseSchema,
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
  })
})

/**
 * @import { InputFieldsComponentsDef } from '@defra/forms-model'
 */
