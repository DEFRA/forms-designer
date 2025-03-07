import { hasUnderlyingData } from '~/src/models/forms/editor-v2/questions.js'

describe('editor-v2 - questions model', () => {
  describe('hasUnderlyingData', () => {
    test('should return true if value 1 supplied', () => {
      expect(hasUnderlyingData('value', undefined)).toBeTruthy()
      expect(hasUnderlyingData('value', '')).toBeTruthy()
    })
    test('should return true if value 2 supplied', () => {
      expect(hasUnderlyingData(undefined, 'value')).toBeTruthy()
      expect(hasUnderlyingData('', 'value')).toBeTruthy()
    })
    test('should return true if both values supplied', () => {
      expect(hasUnderlyingData('val1', 'val2')).toBeTruthy()
    })
    test('should return false if neither value supplied', () => {
      expect(hasUnderlyingData(undefined, undefined)).toBeFalsy()
      expect(hasUnderlyingData(undefined, '')).toBeFalsy()
      expect(hasUnderlyingData('', undefined)).toBeFalsy()
      expect(hasUnderlyingData('', '')).toBeFalsy()
    })
  })
})
