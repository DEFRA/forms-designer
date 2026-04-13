import { preventUnicodeInEmail } from '~/src/form/utils/prevent-unicode.js'

describe('preventUnicodeInEmail', () => {
  const mockHelpers = {
    error: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle undefined', () => {
    // @ts-expect-error - partial helper mock
    preventUnicodeInEmail(undefined, mockHelpers)
    expect(mockHelpers.error).toHaveBeenCalledWith('string.empty')
  })

  it('should handle not a string', () => {
    // @ts-expect-error - partial helper mock
    preventUnicodeInEmail({ abc: 123 }, mockHelpers)
    expect(mockHelpers.error).toHaveBeenCalledWith('string.empty')
  })

  it.each([
    'first.last@domain.co.uk',
    'first-last@domain.uk',
    'only@domain.uk'
  ])('handles a valid emails', (/** @type {string} */ email) => {
    // @ts-expect-error - partial helper mock
    expect(preventUnicodeInEmail(email, mockHelpers)).toBe(email)
    expect(mockHelpers.error).not.toHaveBeenCalled()
  })

  const enDash = '\u2013'
  const emDash = '\u2014'
  it.each([`first${enDash}last@domain.co.uk`, `first${emDash}}last@domain.uk`])(
    'handles an invalid email',
    (/** @type {string} */ email) => {
      // @ts-expect-error - partial helper mock
      preventUnicodeInEmail(email, mockHelpers)
      expect(mockHelpers.error).toHaveBeenCalledWith('string.unicode')
    }
  )
})
