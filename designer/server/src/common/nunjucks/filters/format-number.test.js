import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'

describe('#formatNumber', () => {
  describe('With defaults', () => {
    test('Number should be in expected format', () => {
      expect(formatNumber('20000000')).toBe('20,000,000')
    })
  })

  describe('With locale', () => {
    test('Number should be in provided format', () => {
      expect(formatNumber('5500000', 'de-DE')).toBe('5.500.000')
    })
  })
})
