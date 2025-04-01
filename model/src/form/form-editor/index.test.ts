import { ValidationError } from 'joi'

import { customValidator } from '~/src/index.js'

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

    it('should use custom', () => {
      const { value, error } = customValidator
        .dsv<{ text: string; value: string }>()
        .row(/\r?\n/)
        .col(':')
        .keys(['text', 'value'])
        .items(
          customValidator.object({
            text: customValidator.string(),
            value: customValidator.string()
          })
        )
        .validate(
          'English:en-gb\r\n' +
            ' French : fr-FR \r\n' +
            'German:de-DE\r\n' +
            'Spanish:es-ES\r\n' +
            'Polish:pl-PL\r\n' +
            'Ukrainian:uk-UA'
        )
      expect(error).toBeUndefined()
      expect(value).toEqual([
        { text: 'English', value: 'en-gb' },
        { text: 'French', value: 'fr-FR' },
        { text: 'German', value: 'de-DE' },
        { text: 'Spanish', value: 'es-ES' },
        { text: 'Polish', value: 'pl-PL' },
        { text: 'Ukrainian', value: 'uk-UA' }
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

    it('should trim and filter white spaces', () => {
      const { value } = customValidator
        .dsv<{ key: string; value: string }>()
        .validate(' \r\n \r\n \r\n')
      expect(value).toEqual([])
    })
  })
})
