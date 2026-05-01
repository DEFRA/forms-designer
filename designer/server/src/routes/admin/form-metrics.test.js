import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { getMetrics } from '~/src/lib/metrics.js'
import { authSuperAdmin as auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/metrics.js')

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
    test('should render report form', async () => {
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
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { FormTotalsMetric } from '@defra/forms-model'
 */
