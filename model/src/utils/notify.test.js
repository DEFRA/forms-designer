import { escapeNotifyContent } from '~/src/utils/notify.js'

describe('Notify', () => {
  describe('escapeNotifyContent', () => {
    it.each([
      {
        inStr: 'This is a normal sentence without hyphens',
        outStr:
          'This&nbsp;is&nbsp;a&nbsp;normal&nbsp;sentence&nbsp;without&nbsp;hyphens'
      },
      {
        inStr: 'This has one hyphen - in the middle',
        outStr:
          'This&nbsp;has&nbsp;one&nbsp;hyphen&nbsp;&hyphen;&nbsp;in&nbsp;the&nbsp;middle'
      },
      {
        inStr: '-This has multiple hyphens - here - here - and here-',
        outStr:
          '&hyphen;This&nbsp;has&nbsp;multiple&nbsp;hyphens&nbsp;&hyphen;&nbsp;here&nbsp;&hyphen;&nbsp;here&nbsp;&hyphen;&nbsp;and&nbsp;here&hyphen;'
      },
      {
        inStr:
          'This has various whitespace - plus punctuations     ,     .     :     ;     !  ',
        outStr:
          'This&nbsp;has&nbsp;various&nbsp;whitespace&nbsp;&hyphen;&nbsp;plus&nbsp;punctuations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!&nbsp;&nbsp;'
      },
      {
        inStr:
          'This has multiples and tabs   ,   .   .      ,   \t  \t      . ',
        outStr:
          'This&nbsp;has&nbsp;multiples&nbsp;and&nbsp;tabs&nbsp;&nbsp;&nbsp;,&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;'
      }
    ])("formats '$inStr' to '$outStr'", ({ inStr, outStr }) => {
      expect(escapeNotifyContent(inStr)).toBe(outStr)
    })
  })
})
