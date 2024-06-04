import { describe, expect, test } from '@jest/globals'

import { formatCurrency } from '~/src/common/nunjucks/filters/index.js'

describe('#formatCurrency', () => {
  describe('With defaults', () => {
    test('Currency should be in expected format', () => {
      expect(formatCurrency('20000000')).toBe('£20,000,000.00')
    })
  })

  describe('With Currency attributes', () => {
    test('Currency should be in provided format', () => {
      expect(formatCurrency('5500000', 'en-US', 'USD')).toBe('$5,500,000.00')
    })
  })
})
