import { FormStatus } from '@defra/forms-model'
import { format } from 'date-fns'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { getMetrics } from '~/src/lib/metrics.js'
import { publishPlatformMetricsDownloadRequestedEvent } from '~/src/messaging/publish.js'
import { getMetricsAsExcel } from '~/src/models/admin/metrics-excel.js'
import { buildQueryFromPayload } from '~/src/routes/admin/form-metrics.js'
import { authSuperAdmin as auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/metrics.js')
jest.mock('~/src/messaging/publish.js')
jest.mock('~/src/models/admin/metrics-excel.js')

describe('Form metrics routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('form-metrics', () => {
    describe('display and filter form metrics', () => {
      test('should render report form with form activity', async () => {
        const mockMetrics = {
          overview: [],
          totals: /** @type {FormTotalsMetric} */ ({
            last7Days: {},
            prev7Days: {},
            last30Days: {},
            prev30Days: {},
            lastYear: {},
            prevYear: {},
            allTime: {},
            draftSubmissions: {},
            liveSubmissions: {},
            updatedAt: new Date('2026-01-01T00:00:00.000Z')
          })
        }
        jest.mocked(getMetrics).mockResolvedValueOnce(mockMetrics)

        const options = {
          method: 'get',
          url: '/admin/form-metrics',
          auth
        }

        const { response, container } = await renderResponse(server, options)

        const $mastheadHeading = container.getByRole('heading', { level: 1 })
        const $links = container.getAllByRole('link')

        expect($mastheadHeading).toHaveTextContent(
          'Defra Form Designer metrics'
        )
        expect($mastheadHeading).toHaveClass('govuk-heading-xl')

        // Check tab headings and active tab
        expect($links[5]).toHaveTextContent('My account')
        expect($links[6]).toHaveTextContent('Manage users')
        expect($links[7]).toHaveTextContent('Admin tools')
        expect($links[8]).toHaveTextContent('Support')
        expect($links[9]).toHaveTextContent('Back to admin tools')

        expect(response.statusCode).toEqual(StatusCodes.OK)
        expect(response.headers['content-type']).toContain('text/html')
        expect(response.result).toMatchSnapshot()
      })

      test('should render report form with component usage', async () => {
        const mockMetrics = {
          overview: [],
          totals: /** @type {FormTotalsMetric} */ ({
            last7Days: {},
            prev7Days: {},
            last30Days: {},
            prev30Days: {},
            lastYear: {},
            prevYear: {},
            allTime: {},
            draftSubmissions: {},
            liveSubmissions: {},
            updatedAt: new Date('2026-01-01T00:00:00.000Z')
          })
        }
        jest.mocked(getMetrics).mockResolvedValueOnce(mockMetrics)

        const options = {
          method: 'get',
          url: '/admin/form-metrics/component-usage',
          auth
        }

        const { response, container } = await renderResponse(server, options)

        const $mastheadHeading = container.getByRole('heading', { level: 1 })
        const $links = container.getAllByRole('link')

        expect($mastheadHeading).toHaveTextContent(
          'Defra Form Designer metrics'
        )
        expect($mastheadHeading).toHaveClass('govuk-heading-xl')

        // Check tab headings and active tab
        expect($links[5]).toHaveTextContent('My account')
        expect($links[6]).toHaveTextContent('Manage users')
        expect($links[7]).toHaveTextContent('Admin tools')
        expect($links[8]).toHaveTextContent('Support')
        expect($links[9]).toHaveTextContent('Back to admin tools')

        expect(response.statusCode).toEqual(StatusCodes.OK)
        expect(response.headers['content-type']).toContain('text/html')
        expect(response.result).toMatchSnapshot()
      })

      test('should render report for drilldown', async () => {
        const mockMetrics = {
          overview: [],
          totals: {
            last7Days: {
              Submissions: {
                count: 0,
                details: []
              }
            },
            prev7Days: {},
            last30Days: {},
            prev30Days: {},
            lastYear: {},
            prevYear: {},
            allTime: {},
            draftSubmissions: {},
            liveSubmissions: {},
            updatedAt: new Date('2026-01-01T00:00:00.000Z'),
            earliestDate: new Date('2025-12-01')
          }
        }
        // @ts-expect-error - partial mock of data
        jest.mocked(getMetrics).mockResolvedValueOnce(mockMetrics)

        const options = {
          method: 'get',
          url: '/admin/form-metrics/drilldown/last-7-days/Submissions',
          auth
        }

        const { response, container } = await renderResponse(server, options)

        const $mastheadHeading = container.getByRole('heading', { level: 1 })
        const $links = container.getAllByRole('link')

        expect($mastheadHeading).toHaveTextContent(
          'Defra Form Designer metrics'
        )
        expect($mastheadHeading).toHaveClass('govuk-heading-xl')

        // Check tab headings and active tab
        expect($links[5]).toHaveTextContent('My account')
        expect($links[6]).toHaveTextContent('Manage users')
        expect($links[7]).toHaveTextContent('Admin tools')
        expect($links[8]).toHaveTextContent('Support')
        expect($links[9]).toHaveTextContent('Back to overview metrics')

        expect(response.statusCode).toEqual(StatusCodes.OK)
        expect(response.headers['content-type']).toContain('text/html')
        expect(response.result).toMatchSnapshot()
      })

      test('should filter and redirect with query', async () => {
        const options = {
          method: 'post',
          url: '/admin/form-metrics',
          auth,
          payload: {
            searchText: 'test search'
          }
        }

        const {
          response: { statusCode, headers }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
        expect(headers.location).toBe(
          '/admin/form-metrics?searchText=test+search&showFilter=Y'
        )
      })
    })

    describe('regenerate', () => {
      test('should render regenerate form', async () => {
        const options = {
          method: 'get',
          url: '/admin/form-metrics-regenerate',
          auth
        }

        const { response, container } = await renderResponse(server, options)

        const $mastheadHeading = container.getByRole('heading', { level: 1 })

        expect($mastheadHeading).toHaveTextContent(
          'Defra Form Designer metrics'
        )
        expect($mastheadHeading).toHaveClass('govuk-heading-xl')

        const $headings2 = container.getAllByRole('heading', { level: 2 })

        expect($headings2[0]).toHaveTextContent('Regenerating metrics')
        expect($headings2[0]).toHaveClass('govuk-heading-l')

        expect(response.statusCode).toEqual(StatusCodes.OK)
        expect(response.headers['content-type']).toContain('text/html')
        expect(response.result).toMatchSnapshot()
      })

      test('should post and redirect', async () => {
        const options = {
          method: 'post',
          url: '/admin/form-metrics-regenerate',
          auth
        }

        const {
          response: { statusCode, headers }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(headers.location).toBe('/admin/index')
      })
    })

    describe('download', () => {
      test('should download metrics file', async () => {
        const mockMetrics = {
          overview: [
            {
              formStatus: FormStatus.Draft,
              summaryMetrics: { name: 'Form 2', slug: 'form-2' },
              submissionsCount: 2
            }
          ],
          totals: {}
        }
        // @ts-expect-error - partial mock of data
        jest.mocked(getMetrics).mockResolvedValueOnce(mockMetrics)
        jest
          .mocked(getMetricsAsExcel)
          .mockResolvedValueOnce(Buffer.from('Dummy xlsx content'))

        const options = {
          method: 'get',
          url: '/admin/form-metrics-download',
          auth
        }

        const { response } = await renderResponse(server, options)

        expect(response.statusCode).toEqual(StatusCodes.OK)

        const today = format(new Date(), 'yyyy-MM-dd')

        // Verify headers
        expect(response.headers['content-type']).toBe(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        expect(response.headers['content-disposition']).toBe(
          `attachment; filename="form-metrics-${today}.xlsx"`
        )
        const content = response.payload
        expect(content).toBe('Dummy xlsx content')
      })

      test('should throw if error during download', async () => {
        const mockMetrics = {
          overview: [
            {
              formStatus: FormStatus.Draft,
              summaryMetrics: { name: 'Form 2', slug: 'form-2' },
              submissionsCount: 2
            }
          ],
          totals: {}
        }
        // @ts-expect-error - partial mock of data
        jest.mocked(getMetrics).mockResolvedValueOnce(mockMetrics)

        jest
          .mocked(publishPlatformMetricsDownloadRequestedEvent)
          .mockImplementationOnce(() => {
            throw new Error('unable to send audit message')
          })

        const options = {
          method: 'get',
          url: '/admin/form-metrics-download',
          auth
        }

        const { response } = await renderResponse(server, options)

        expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      })
    })
  })

  describe('buildQueryFromPayload', () => {
    it('should build query string', () => {
      const payload = {
        showFilter: 'N',
        searchText: 'some text',
        status: ['draft', 'live'],
        org: ['Org 1', 'Org 2']
      }
      expect(buildQueryFromPayload(payload)).toBe(
        '?searchText=some+text&showFilter=N&status=draft&status=live&org=Org+1&org=Org+2'
      )
    })

    it('should return empty string when no payload', () => {
      const payload = {}
      expect(buildQueryFromPayload(payload)).toBe('')
    })

    it('should return empty string when action is clear', () => {
      const payload = {
        action: 'clear',
        searchText: 'some text'
      }
      expect(buildQueryFromPayload(payload)).toBe('')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { FormTotalsMetric } from '@defra/forms-model'
 */
