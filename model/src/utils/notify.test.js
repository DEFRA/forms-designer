import {
  escapeHyphens,
  stripWhitespaceBeforePunctuation
} from '~/src/utils/notify.js'

describe('Notify', () => {
  describe('escapeHyphens', () => {
    it.each([
      {
        inStr: 'This is a normal sentence without hyphens',
        outStr: 'This is a normal sentence without hyphens'
      },
      {
        inStr: 'This has one hyphen - in the middle',
        outStr: 'This has one hyphen &hyphen; in the middle'
      },
      {
        inStr: '-This has multiple hyphens - here - here - and here-',
        outStr:
          '&hyphen;This has multiple hyphens &hyphen; here &hyphen; here &hyphen; and here&hyphen;'
      }
    ])("formats '$inStr' to '$outStr'", ({ inStr, outStr }) => {
      expect(escapeHyphens(inStr)).toBe(outStr)
    })
  })

  describe('stripWhitespaceBeforePunctuation', () => {
    it.each([
      {
        inStr: 'This is a normal sentence without whitespace or punctuation',
        outStr: 'This is a normal sentence without whitespace or punctuation'
      },
      {
        inStr:
          'This has various whitespace - plus punctuations     ,     .     :     ;     !  ',
        outStr: 'This has various whitespace - plus punctuations,.:;!  '
      }
    ])("formats '$inStr' to '$outStr'", ({ inStr, outStr }) => {
      expect(stripWhitespaceBeforePunctuation(inStr)).toBe(outStr)
    })
  })
})
