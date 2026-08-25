import { FormMetricName } from '@defra/forms-model'

import config from '~/src/config.js'
import {
  createMockResponse,
  mockedGetJson,
  mockedPostJson
} from '~/src/lib/__stubs__/editor.js'
import {
  getDrilldownMetrics,
  getMetrics,
  getMetricsForForm,
  getSubmissionsPerMonth,
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
        '/report/?searchText=some+search+text&status=draft&status=live&org=Org1&org=Org2&language=cy',
        auditEndpoint
      )
      const result = await getMetrics({
        searchText: 'some search text',
        status: ['draft', 'live'],
        org: ['Org1', 'Org2'],
        language: 'cy'
      })
      expect(result.overview).toEqual([])

      const calledUrl = mockedGetJson.mock.calls[0][0]
      expect(calledUrl.href).toBe(expectedUrl.href)
    })
  })

  describe('getDrilldownMetrics', () => {
    it('should call endpoint', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: { drilldownRows: [] }
      })
      const expectedUrl = new URL(
        '/report/last7Days/NewFormsCreated',
        auditEndpoint
      )
      const result = await getDrilldownMetrics(
        'last7Days',
        FormMetricName.NewFormsCreated,
        undefined
      )
      expect(result).toEqual([])

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
      const calledUrl = mockedPostJson.mock.calls[0][0]
      expect(calledUrl.href).toBe(expectedUrl.href)
      const calledParams = mockedPostJson.mock.calls[0][1]
      expect(calledParams).toEqual({
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
      const calledUrl = mockedGetJson.mock.calls[0][0]
      expect(calledUrl.href).toBe(expectedUrl.href)
    })
  })

  describe('getSubmissionsPerMonth', () => {
    it('should call endpoint', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: {}
      })
      const expectedUrl = new URL('/report-submissions', auditEndpoint)
      expectedUrl.searchParams.append(
        'earliestDate',
        '2026-01-01T00:00:00.000Z'
      )

      await getSubmissionsPerMonth(new Date(2026, 0, 1))
      const calledUrl = mockedGetJson.mock.calls[0][0]
      expect(calledUrl.href).toBe(expectedUrl.href)
    })
  })
})
