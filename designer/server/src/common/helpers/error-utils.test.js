import { getErrorMessage } from '~/src/common/helpers/error-utils.js'

describe('error-utils', () => {
  describe('getErrorMessage', () => {
    it('should return error message for Error instances', () => {
      const error = new Error('Test error message')
      expect(getErrorMessage(error)).toBe('Test error message')
    })

    it('should return string representation for non-Error values', () => {
      expect(getErrorMessage('string error')).toBe('string error')
      expect(getErrorMessage(123)).toBe('123')
      expect(getErrorMessage(null)).toBe('null')
      expect(getErrorMessage(undefined)).toBe('undefined')
      expect(getErrorMessage({ message: 'object error' })).toBe(
        '[object Object]'
      )
    })
  })
})
