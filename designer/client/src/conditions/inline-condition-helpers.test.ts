import { tryParseInt } from '~/src/conditions/inline-condition-helpers.js'

describe('tryParseInt', () => {
  it('returns a valid integer if one can be parsed', () => {
    const result = tryParseInt('2020')
    expect(result).toBe(2020)
  })

  it('returns a valid integer for numbers', () => {
    const result = tryParseInt(2020)
    expect(result).toBe(2020)
  })

  it('returns a valid integer for decimals', () => {
    const result = tryParseInt(2020.2)
    expect(result).toBe(2020)
  })

  it('returns undefined for non-numbers', () => {
    const result = tryParseInt('ABC')
    expect(result).toBeUndefined()
  })

  it('returns undefined for empty strings', () => {
    const result = tryParseInt('')
    expect(result).toBeUndefined()
  })
})
