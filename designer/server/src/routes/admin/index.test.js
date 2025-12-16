import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { getUser } from '~/src/lib/manage.js'
import { sendFeedbackSubmissionsFile } from '~/src/services/formSubmissionService.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')
jest.mock('~/src/services/formSubmissionService.js')
jest.mock('~/src/lib/manage.js')

describe('System admin routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    test('should render table with options', async () => {
      const options = {
        method: 'get',
        url: '/admin/index',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $links = container.getAllByRole('link')

      expect($mastheadHeading).toHaveTextContent('Admin tools')
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      // Check tab headings and active tab
      expect($links[4]).toHaveTextContent('My account')
      expect($links[5]).toHaveTextContent('Manage users')
      expect($links[6]).toHaveTextContent('Admin tools')
      expect($links[7]).toHaveTextContent('Support')

      const $feedbackLinks = container.getAllByRole('button')
      expect($feedbackLinks[2]).toHaveTextContent('Send feedback data')
    })
  })

  describe('POST', () => {
    describe('action=feedback', () => {
      test('should error if invalid payload key', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { invalid: 'true' }
        }

        const {
          response: { statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
      })

      test('should error if invalid payload value', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'invalid' }
        }

        const {
          response: { statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
      })

      test('should handle boom error if boom received from API call', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce({
          ...testFormMetadata,
          notificationEmail: 'something@text.com'
        })
        jest.mocked(sendFeedbackSubmissionsFile).mockImplementationOnce(() => {
          throw Boom.notFound()
        })

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'feedback' }
        }

        const {
          response: { statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.NOT_FOUND)
      })

      test('should handle valid payload', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce({
          ...testFormMetadata,
          notificationEmail: 'test@defratest.gov.uk'
        })
        jest
          .mocked(getUser)
          // @ts-expect-error - mocked only partial object
          .mockResolvedValueOnce({ email: 'target@test.gov.uk' })

        jest.mocked(sendFeedbackSubmissionsFile).mockResolvedValueOnce({
          message: 'Generate file success'
        })

        const options = {
          method: 'post',
          url: '/admin/index',
          auth,
          payload: { action: 'feedback' }
        }

        const {
          response: { headers, statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(headers.location).toBe('/admin/index')
        expect(sendFeedbackSubmissionsFile).toHaveBeenCalledTimes(1)
      })
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
