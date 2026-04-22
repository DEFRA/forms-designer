import {
  buildAriaLabel,
  buildChangePhrase
} from '~/src/models/admin/metrics.js'

describe('metrics model', () => {
  describe('buildAriaLabel', () => {
    it('should build label when no change from previous period', () => {
      const label = buildAriaLabel('', 0, '0.0', 'last 7 days')
      expect(label).toBe('There has been no change compared to the last 7 days')
    })

    it('should build label when positive change from previous period', () => {
      const label = buildAriaLabel('+', 10, '5.1', 'last 7 days')
      expect(label).toBe(
        'There has been an increase of 10 (+5.1%) compared to the last 7 days'
      )
    })

    it('should build label when negative change from previous period', () => {
      const label = buildAriaLabel('-', 7, '-3.1', 'last 7 days')
      expect(label).toBe(
        'There has been a decrease of 7 (-3.1%) compared to the last 7 days'
      )
    })
  })

  describe('buildChangePhrase', () => {
    it('should build label when no change from previous period', () => {
      const phrase = buildChangePhrase({ changeSymbol: '', changeValue: 0 })
      expect(phrase).toBe('No difference in')
    })

    it('should build label when positive change from previous period', () => {
      const phrase = buildChangePhrase({ changeSymbol: '+', changeValue: 12 })
      expect(phrase).toBe('12 more')
    })

    it('should build label when negative change from previous period', () => {
      const phrase = buildChangePhrase({ changeSymbol: '-', changeValue: 3 })
      expect(phrase).toBe('3 fewer')
    })
  })
})
