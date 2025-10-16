import { ValidationError } from 'joi'

import {
  autoCompleteOptionsSchema,
  customValidator,
  govukFieldIsChecked,
  govukFieldValueIsString
} from '~/src/form/form-editor/index.js'
import { type GovukField } from '~/src/form/form-editor/types.js'

describe('index', () => {
  describe('customValidator', () => {
    it('should use default', () => {
      const { value, error } = customValidator
        .dsv<{ key: string; value: string }>()
        .validate(
          'English,en-gb\r\n' +
            'French,fr-FR\r\n' +
            'German,de-DE\r\n' +
            'Spanish,es-ES\r\n' +
            'Polish,pl-PL\r\n' +
            'Ukrainian,uk-UA'
        )
      expect(error).toBeUndefined()
      expect(value).toEqual([
        { key: 'English', value: 'en-gb' },
        { key: 'French', value: 'fr-FR' },
        { key: 'German', value: 'de-DE' },
        { key: 'Spanish', value: 'es-ES' },
        { key: 'Polish', value: 'pl-PL' },
        { key: 'Ukrainian', value: 'uk-UA' }
      ])
    })

    it('should use standard validation', () => {
      const { value, error } = customValidator
        .dsv<{ key: string; value: string }>()
        .min(1)
        .required()
        .validate('')
      expect(value).toEqual([])
      expect(error).toEqual(
        new ValidationError('"value" must contain at least 1 items', [], '')
      )
    })

    it('should fail if undefined', () => {
      const { error } = customValidator
        .dsv<{ key: string; value: string }>()
        .required()
        .validate(undefined)
      expect(error).toEqual(new ValidationError('"value" is required', [], ''))
    })

    it('should trim and filter white spaces', () => {
      const { value } = customValidator
        .dsv<{ key: string; value: string }>()
        .validate(' \r\n \r\n \r\n')
      expect(value).toEqual([])
    })
  })

  describe('autoCompleteOptionsSchema', () => {
    it('should succeed if valid', () => {
      const { value, error } = autoCompleteOptionsSchema.validate(
        'English:en-gb\r\n' +
          ' French : fr-FR \r\n' +
          'German:de-DE\r\n' +
          'Spanish:es-ES\r\n' +
          'Polish:pl-PL\r\n' +
          'Ukrainian:uk-UA'
      )
      expect(value).toEqual([
        { text: 'English', value: 'en-gb' },
        { text: 'French', value: 'fr-FR' },
        { text: 'German', value: 'de-DE' },
        { text: 'Spanish', value: 'es-ES' },
        { text: 'Polish', value: 'pl-PL' },
        { text: 'Ukrainian', value: 'uk-UA' }
      ])
      expect(error).toBeUndefined()
    })

    it('should fill in empty values', () => {
      const { value, error } = autoCompleteOptionsSchema.validate(
        'English\r\n' +
          'French\r\n' +
          'German\r\n' +
          'Spanish\r\n' +
          'Polish\r\n' +
          'Ukrainian'
      )
      expect(error).toBeUndefined()
      expect(value).toEqual([
        { text: 'English', value: 'English' },
        { text: 'French', value: 'French' },
        { text: 'German', value: 'German' },
        { text: 'Spanish', value: 'Spanish' },
        { text: 'Polish', value: 'Polish' },
        { text: 'Ukrainian', value: 'Ukrainian' }
      ])
    })
  })

  describe('govukFields', () => {
    const questionOptionalField: GovukField = {
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
    }

    const questionField: GovukField = {
      name: 'question',
      id: 'question',
      label: {
        text: 'Question',
        classes: 'govuk-label--m'
      },
      value: 'Short answer'
    }

    const hintTextField: GovukField = {
      name: 'hintText',
      id: 'hintText',
      label: {
        text: 'Hint text (optional)',
        classes: 'govuk-label--m'
      },
      rows: 3,
      value: ''
    }

    const shortDescriptionField: GovukField = {
      id: 'shortDescription',
      name: 'shortDescription',
      idPrefix: 'shortDescription',
      label: {
        text: 'Short description',
        classes: 'govuk-label--m'
      },
      hint: {
        text: "Enter a short description for this question like 'Licence period'. Short descriptions are used in error messages and on the check your answers page."
      },
      value: 'Short answer'
    }

    describe('govukFieldValueIsString', () => {
      it('should return true given question field', () => {
        expect(govukFieldValueIsString(questionField)).toBe(true)
      })

      it('should return true given hintText field', () => {
        expect(govukFieldValueIsString(hintTextField)).toBe(true)
      })

      it('should return true given shortDescription field', () => {
        expect(govukFieldValueIsString(shortDescriptionField)).toBe(true)
      })

      it('should return false given non-text field', () => {
        expect(govukFieldValueIsString(questionOptionalField)).toBe(false)
      })
    })

    describe('govukFieldIsChecked', () => {
      it('should return true if it is a questionOptional field', () => {
        expect(govukFieldIsChecked(questionOptionalField)).toBe(true)
      })

      it('should return false if it is not a questionOptional field', () => {
        expect(govukFieldIsChecked(hintTextField)).toBe(false)
      })

      it('should return false if it is not a valid questionOptional field', () => {
        expect(
          govukFieldIsChecked({
            ...questionOptionalField,
            items: undefined
          })
        ).toBe(false)
      })
    })
  })
})
