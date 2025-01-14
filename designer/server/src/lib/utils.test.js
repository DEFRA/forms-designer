import { getTraceId } from '@defra/hapi-tracing'

import config from '~/src/config.js'
import { getHeaders } from '~/src/lib/utils.js'

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
