import { ValidationError } from 'joi'

import {
  autoCompleteOptionsSchema,
  autoCompleteValidator,
  mapAutoCompleteRow,
  parseAutoCompleteString
} from '~/src/models/forms/editor-v2/mappers.js'

const defaultAutoCompleteArray = [
  { text: 'English', value: 'en-gb' },
  { text: 'French', value: 'fr-FR' },
  { text: 'German', value: 'de-DE' },
  { text: 'Spanish', value: 'es-ES' },
  { text: 'Polish', value: 'pl-PL' },
  { text: 'Ukrainian', value: 'uk-UA' },
  { text: 'Portuguese', value: 'Portuguese' }
]

describe('mappers', () => {
  const addLineBreaks = (lineBreak = '\r\n') => {
    return (
      `English:en-gb${lineBreak}` +
      `French:fr-FR${lineBreak}` +
      `German:de-DE${lineBreak}` +
      `Spanish:es-ES${lineBreak}    ` +
      `Polish:pl-PL${lineBreak}` +
      `Ukrainian:uk-UA${lineBreak}` +
      `Portuguese`
    )
  }

  describe('mapAutoCompleteRow', () => {
    it('should map a row split by semi-colon', () => {
      expect(mapAutoCompleteRow('English:en-gb')).toEqual({
        text: 'English',
        value: 'en-gb'
      })
    })
    it('should map a row not split', () => {
      expect(mapAutoCompleteRow('English Language')).toEqual({
        text: 'English Language',
        value: 'English Language'
      })
    })

    it('should handle leading and trailing whitespace', () => {
      expect(mapAutoCompleteRow(' Pol ish : pl- PL ')).toEqual({
        text: 'Pol ish',
        value: 'pl- PL'
      })
    })
  })

  describe('parseAutoCompleteString', () => {
    it('should handle windows line breaks', () => {
      const optionStr = addLineBreaks()
      expect(parseAutoCompleteString(optionStr)).toEqual(
        defaultAutoCompleteArray
      )
    })

    it('should handle \\n line break', () => {
      const optionStr = addLineBreaks('\n')
      expect(parseAutoCompleteString(optionStr)).toEqual([
        { text: 'English', value: 'en-gb' },
        { text: 'French', value: 'fr-FR' },
        { text: 'German', value: 'de-DE' },
        { text: 'Spanish', value: 'es-ES' },
        { text: 'Polish', value: 'pl-PL' },
        { text: 'Ukrainian', value: 'uk-UA' },
        { text: 'Portuguese', value: 'Portuguese' }
      ])
    })
  })

  describe('autoCompleteOptionsSchema', () => {
    it('should validate if valid list', () => {
      const { value, error } =
        autoCompleteOptionsSchema.validate(addLineBreaks())
      expect(value).toEqual(defaultAutoCompleteArray)
      expect(error).toBeUndefined()
    })

    it('should fail if value is empty', () => {
      const { error } = autoCompleteOptionsSchema.validate('')
      expect(error).toEqual(
        new ValidationError('"value" is not allowed to be empty', [], '')
      )
    })
  })

  describe('autoCompleteValidator', () => {
    it('should fail if an error occurred during a parse', () => {
      const mockErrorHelper = jest
        .fn()
        .mockImplementation(
          /** @type {(errorValue: string) => string} */ (
            (errorValue) => errorValue
          )
        )

      // @ts-expect-error -- Invalid field
      expect(autoCompleteValidator(undefined, { error: mockErrorHelper })).toBe(
        'parse.error'
      )
    })
  })
})
