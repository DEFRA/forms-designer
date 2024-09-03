import {
  tryParseInt,
  isInt
} from '~/src/conditions/inline-condition-helpers.js'

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

describe('isInt', () => {
  it('returns true for a valid integer', () => {
    const result = isInt(2020)
    expect(result).toBe(true)
  })

  it('returns true for a valid integer as string', () => {
    // @ts-expect-error - Allow invalid param for test
    const result = isInt('2020')
    expect(result).toBe(true)
  })

  it('returns false for empty strings', () => {
    // @ts-expect-error - Allow invalid param for test
    const result = isInt('')
    expect(result).toBe(false)
  })
})
