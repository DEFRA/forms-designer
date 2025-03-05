import { getTraceId } from '@defra/hapi-tracing'

import config from '~/src/config.js'
import { ellipsise, getHeaders, nlToBr } from '~/src/lib/utils.js'

jest.mock('@defra/hapi-tracing')

describe('Header helper functions', () => {
  it('should include the trace id in the headers if available', () => {
    jest.mocked(getTraceId).mockReturnValue('my-trace-id')

    const result = getHeaders('token')
    expect(result).toEqual({
      headers: {
        Authorization: 'Bearer token',
        [config.tracing.header]: 'my-trace-id'
      }
    })
  })

  it('should exclude the trace id in the headers if missing', () => {
    jest.mocked(getTraceId).mockReturnValue(null)

    const result = getHeaders('token')
    expect(result).toEqual({
      headers: {
        Authorization: 'Bearer token'
      }
    })
  })
})

describe('ellipsise', () => {
  it('should handle undeinfed', () => {
    expect(ellipsise(undefined)).toBeUndefined()
  })
  it('should return string unchanged if less than max', () => {
    expect(ellipsise('A small string to stay as is')).toBe(
      'A small string to stay as is'
    )
  })
  it('should handle override of max', () => {
    expect(ellipsise('A small string to stay as is', 10)).toBe('A small st...')
  })
  it('should handle adding an ellipsis', () => {
    expect(
      ellipsise(
        'A string of text that is longer than the default so it will get truncated'
      )
    ).toBe('A string of text that is longer than the default s...')
  })
})

describe('nlToBr', () => {
  it('should handle undefined', () => {
    expect(nlToBr(undefined)).toBe('')
  })
  it('should handle blank string', () => {
    expect(nlToBr('')).toBe('')
  })
  it('should handle single line', () => {
    expect(nlToBr('This is a single line')).toBe('This is a single line')
  })
  it('should handle two lines', () => {
    expect(nlToBr('This is line 1\nThis is line 2')).toBe(
      'This is line 1<br>This is line 2'
    )
  })
  it('should handle multiple lines', () => {
    expect(nlToBr('Line 1\nLine 2\nLine 3\nLine 4')).toBe(
      'Line 1<br>Line 2<br>Line 3<br>Line 4'
    )
  })
})
