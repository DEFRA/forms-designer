import config from '~/src/config.js'
import {
  createMockResponse,
  mockedGetJson
} from '~/src/lib/__stubs__/editor.js'
import { getMetrics } from '~/src/lib/metrics.js'

jest.mock('~/src/lib/fetch.js')

const auditEndpoint = new URL(config.auditUrl)

describe('metrics.js', () => {
  describe('getMetrics', () => {
    it('should call endpoint', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: { overview: [] }
      })
      const expectedUrl = new URL('/report', auditEndpoint)
      const result = await getMetrics()
      expect(result.overview).toEqual([])

      expect(mockedGetJson).toHaveBeenCalledWith(expectedUrl)
    })
  })
})
