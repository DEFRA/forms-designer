import { FormConfiguration } from '~/src/form/index.js'

describe('Form configuration', () => {
  test('should return provided items if provided', () => {
    const underTest = new FormConfiguration(
      'My Key',
      'Display name',
      'Last modified',
      true
    )
    expect(underTest.Key).toBe('My Key')
    expect(underTest.DisplayName).toBe('Display name')
    expect(underTest.LastModified).toBe('Last modified')
    expect(underTest.feedbackForm).toBe(true)
  })

  test('should default Display name to key', () => {
    const underTest = new FormConfiguration('My Key')
    expect(underTest.DisplayName).toBe('My Key')
  })

  test('should keep LastModified as undefined when not specified', () => {
    const underTest = new FormConfiguration('My Key')
    expect(underTest.LastModified).toBeUndefined()
  })

  test('should default feedback to false when not provided', () => {
    const underTest = new FormConfiguration('My Key')
    expect(underTest.feedbackForm).toBe(false)
  })

  test('should bork if no key provided', () => {
    expect(() => new FormConfiguration()).toThrow(Error)
  })
})
