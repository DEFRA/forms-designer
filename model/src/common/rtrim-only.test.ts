import { type CustomHelpers } from 'joi'

import { rtrimOnly } from '~/src/common/rtrim-only.js'

describe('rtrim-only', () => {
  const mockHelpers = {
    error: (err: string) => err
  } as unknown as CustomHelpers<string>

  test('should trim or leave accordingly', () => {
    expect(rtrimOnly('', mockHelpers)).toBe('any.required')
    expect(rtrimOnly(' abc', mockHelpers)).toBe(' abc')
    expect(rtrimOnly('  abc', mockHelpers)).toBe(' abc')
    expect(rtrimOnly('  abc', mockHelpers)).toBe(' abc')
    expect(rtrimOnly(' abc ', mockHelpers)).toBe(' abc')
    expect(rtrimOnly(' abc  ', mockHelpers)).toBe(' abc')
    expect(rtrimOnly(' abc   ', mockHelpers)).toBe(' abc')
    expect(rtrimOnly('  abc   ', mockHelpers)).toBe(' abc')
    expect(rtrimOnly('   abc   ', mockHelpers)).toBe(' abc')
    expect(rtrimOnly('   abc def    ', mockHelpers)).toBe(' abc def')
  })
})
