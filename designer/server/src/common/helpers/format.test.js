import { formatList } from '~/src/common/helpers/format.js'

describe('format helpers', () => {
  describe('formatList', () => {
    it('should return empty string for empty array', () => {
      expect(formatList([])).toBe('')
    })

    it('should return single item without formatting', () => {
      expect(formatList(['apple'])).toBe('apple')
    })

    it('should join two items with "and"', () => {
      expect(formatList(['apple', 'banana'])).toBe('apple and banana')
    })

    it('should format three items with commas and "and"', () => {
      expect(formatList(['apple', 'banana', 'cherry'])).toBe(
        'apple, banana and cherry'
      )
    })

    it('should format multiple items correctly', () => {
      expect(formatList(['one', 'two', 'three', 'four'])).toBe(
        'one, two, three and four'
      )
      expect(formatList(['a', 'b', 'c', 'd', 'e'])).toBe('a, b, c, d and e')
    })
  })
})
