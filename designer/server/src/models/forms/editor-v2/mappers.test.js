import {
  mapAutoCompleteRow,
  parseAutoCompleteString
} from '~/src/models/forms/editor-v2/mappers.js'

describe('mappers', () => {
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

    it('should handle windows line breaks', () => {
      const optionStr = addLineBreaks()
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
})
