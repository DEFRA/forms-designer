import config from '~/src/config.js'
import {
  createMockResponse,
  mockedGetJson,
  mockedPostJson
} from '~/src/lib/__stubs__/editor.js'
import {
  getMetrics,
  getMetricsForForm,
  regenerateMetrics
} from '~/src/lib/metrics.js'

jest.mock('~/src/lib/fetch.js')

const auditEndpoint = new URL(config.auditUrl)

describe('metrics.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getMetrics', () => {
    it('should call endpoint', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: { overview: [] }
      })
      const expectedUrl = new URL('/report/', auditEndpoint)
      const result = await getMetrics()
      expect(result.overview).toEqual([])

      const calledUrl = mockedGetJson.mock.calls[0][0]
      expect(calledUrl.href).toBe(expectedUrl.href)
    })

    it('should call endpoint with filtering params', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: { overview: [] }
      })
      const expectedUrl = new URL(
        '/report/?searchText=some+search+text&status=draft&status=live&org=Org1&org=Org2',
        auditEndpoint
      )
      const result = await getMetrics({
        searchText: 'some search text',
        status: ['draft', 'live'],
        org: ['Org1', 'Org2']
      })
      expect(result.overview).toEqual([])

      const calledUrl = mockedGetJson.mock.calls[0][0]
      expect(calledUrl.href).toBe(expectedUrl.href)
    })
  })

  describe('regenerateMetrics', () => {
    it('should call endpoint', async () => {
      mockedPostJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })
      const expectedUrl = new URL('/report/regenerate', auditEndpoint)
      await regenerateMetrics('token')
      expect(mockedPostJson).toHaveBeenCalledWith(expectedUrl, {
        headers: { Authorization: 'Bearer token' }
      })
    })
  })

  describe('getMetricsForForm', () => {
    it('should call endpoint', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })
      const expectedUrl = new URL('/report/form-id-1', auditEndpoint)
      await getMetricsForForm('form-id-1')
      expect(mockedGetJson).toHaveBeenCalledWith(expectedUrl)
    })
  })
})
