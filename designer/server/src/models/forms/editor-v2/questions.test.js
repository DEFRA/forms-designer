import { hasUnderlyingHeadingData } from '~/src/models/forms/editor-v2/questions.js'

describe('editor-v2 - questions model', () => {
  describe('hasUnderlyingData', () => {
    test('should return true if value 1 supplied', () => {
      expect(hasUnderlyingHeadingData('value', undefined)).toBeTruthy()
      expect(hasUnderlyingHeadingData('value', '')).toBeTruthy()
    })
    test('should return true if value 2 supplied', () => {
      expect(hasUnderlyingHeadingData(undefined, 'value')).toBeTruthy()
      expect(hasUnderlyingHeadingData('', 'value')).toBeTruthy()
    })
    test('should return true if both values supplied', () => {
      expect(hasUnderlyingHeadingData('val1', 'val2')).toBeTruthy()
    })
    test('should return false if neither value supplied', () => {
      expect(hasUnderlyingHeadingData(undefined, undefined)).toBeFalsy()
      expect(hasUnderlyingHeadingData(undefined, '')).toBeFalsy()
      expect(hasUnderlyingHeadingData('', undefined)).toBeFalsy()
      expect(hasUnderlyingHeadingData('', '')).toBeFalsy()
    })
  })
})
