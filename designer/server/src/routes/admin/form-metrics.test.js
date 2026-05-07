import { FormStatus } from '@defra/forms-model'
import { format } from 'date-fns'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { getMetrics } from '~/src/lib/metrics.js'
import { publishPlatformMetricsDownloadRequestedEvent } from '~/src/messaging/publish.js'
import { authSuperAdmin as auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/metrics.js')
jest.mock('~/src/messaging/publish.js')

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

      expect($mastheadHeading).toHaveTextContent('Defra Form Designer metrics')
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

      expect($mastheadHeading).toHaveTextContent('Defra Form Designer metrics')
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

    test('should render regenerate form', async () => {
      const options = {
        method: 'get',
        url: '/admin/form-metrics-regenerate',
        auth
      }

      const { response, container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })

      expect($mastheadHeading).toHaveTextContent('Defra Form Designer metrics')
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

      const options = {
        method: 'get',
        url: '/admin/form-metrics-download',
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toEqual(StatusCodes.OK)

      const today = format(new Date(), 'yyyy-MM-dd')

      // Verify headers
      expect(response.headers['content-type']).toBe('text/csv; charset=utf-8')
      expect(response.headers['content-disposition']).toBe(
        `attachment; filename="live-metrics-${today}.csv"`
      )

      // Verify only headers rows (since supplied data did not include any live rows)
      const csvContent = response.payload
      expect(csvContent).toBe('"Form name","Form URL","Live submissions"')
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

/**
 * @import { Server } from '@hapi/hapi'
 * @import { FormTotalsMetric } from '@defra/forms-model'
 */
