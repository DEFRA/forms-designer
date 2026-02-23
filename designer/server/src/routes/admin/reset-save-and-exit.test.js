import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { resetSaveAndExitRecord } from '~/src/services/formSubmissionService.js'
import { authSuperAdmin as auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/services/formSubmissionService.js')

describe('Reset save and exit routes', () => {
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

  describe('GET', () => {
    test('should render form', async () => {
      const options = {
        method: 'get',
        url: '/admin/reset-save-and-exit',
        auth
      }

      const { response, container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $links = container.getAllByRole('link')

      expect($mastheadHeading).toHaveTextContent('Admin tools')
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      // Check tab headings and active tab
      expect($links[4]).toHaveTextContent('My account')
      expect($links[5]).toHaveTextContent('Manage users')
      expect($links[6]).toHaveTextContent('Admin tools')
      expect($links[7]).toHaveTextContent('Support')
      expect($links[8]).toHaveTextContent('Back to admin tools home')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.headers['content-type']).toContain('text/html')
      expect(response.result).toMatchSnapshot()
    })
  })

  describe('POST', () => {
    test('should error if invalid payload key', async () => {
      const options = {
        method: 'post',
        url: '/admin/reset-save-and-exit',
        auth,
        payload: { invalid: 'true' }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    })

    test('should error if invalid payload value', async () => {
      const options = {
        method: 'post',
        url: '/admin/reset-save-and-exit',
        auth,
        payload: { magicLinkId: 'invalid' }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    })

    test('should handle recordFound received from API call', async () => {
      const magicLinkId = '296701a7-1076-40df-8378-4b6468993fad'

      jest.mocked(resetSaveAndExitRecord).mockResolvedValue({
        recordFound: true,
        recordUpdated: true
      })

      const options = {
        method: 'post',
        url: '/admin/reset-save-and-exit',
        auth,
        payload: { magicLinkId }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(resetSaveAndExitRecord).toHaveBeenCalledTimes(1)
      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    })

    test('should handle no recordFound received from API call', async () => {
      const magicLinkId = '296701a7-1076-40df-8378-4b6468993fad'

      jest.mocked(resetSaveAndExitRecord).mockResolvedValue({
        recordFound: false,
        recordUpdated: false
      })

      const options = {
        method: 'post',
        url: '/admin/reset-save-and-exit',
        auth,
        payload: { magicLinkId }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(resetSaveAndExitRecord).toHaveBeenCalledTimes(1)
      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    })

    test('should handle error thrown from API call', async () => {
      const magicLinkId = '296701a7-1076-40df-8378-4b6468993fad'

      jest.mocked(resetSaveAndExitRecord).mockImplementationOnce(() => {
        throw Boom.badRequest()
      })

      const options = {
        method: 'post',
        url: '/admin/reset-save-and-exit',
        auth,
        payload: { magicLinkId }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(resetSaveAndExitRecord).toHaveBeenCalledTimes(1)
      expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    })
  })
})
/**
 * @import { Server } from '@hapi/hapi'
 */
