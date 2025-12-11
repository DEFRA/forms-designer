import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import {
  sendFeedbackSubmissionsFile,
  sendFormSubmissionsFile
} from '~/src/services/formSubmissionService.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')
jest.mock('~/src/services/formSubmissionService.js')

describe('Editor v2 responses routes', () => {
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
      jest.mocked(forms.get).mockResolvedValueOnce({
        ...testFormMetadata,
        notificationEmail: 'test@defra.gov.uk'
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/responses',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByText(
        'Download responses as an Excel spreadsheet'
      )
      const $links = container.getAllByRole('link')

      expect($mastheadHeading).toBeInTheDocument()
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      // Check tab headings and active tab
      expect($links[4]).toHaveTextContent('Forms library')
      expect($links[5]).toHaveTextContent('Overview')

      const responsesTab = $links[6]
      expect(responsesTab).toHaveTextContent('Responses')
      expect(responsesTab.parentElement).toHaveClass(
        'service-header__nav-list-item--active'
      )

      expect($links[7]).toHaveTextContent('Editor')
      expect($links[8]).toHaveTextContent('Support')

      const $error = container.queryByText(
        'the form overview to send data to a shared mailbox.',
        { exact: false }
      )
      expect($error).toBeNull()
    })

    test('should render error summary', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/responses',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByText(
        'Download responses as an Excel spreadsheet'
      )
      expect($mastheadHeading).toBeInTheDocument()
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      const $error = container.getByText(
        'the form overview to send data to a shared mailbox.',
        { exact: false }
      )
      expect($error).toBeInTheDocument()
    })
  })

  describe('POST', () => {
    describe('action=submissions', () => {
      test('should error if invalid payload key', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

        const options = {
          method: 'post',
          url: '/library/my-form-slug/editor-v2/responses',
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
          url: '/library/my-form-slug/editor-v2/responses',
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
        jest.mocked(sendFormSubmissionsFile).mockImplementationOnce(() => {
          throw Boom.notFound()
        })

        const options = {
          method: 'post',
          url: '/library/my-form-slug/editor-v2/responses',
          auth,
          payload: { action: 'submissions' }
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

        jest.mocked(sendFormSubmissionsFile).mockResolvedValueOnce({
          message: 'Generate file success'
        })

        const options = {
          method: 'post',
          url: '/library/my-form-slug/editor-v2/responses',
          auth,
          payload: { action: 'submissions' }
        }

        const {
          response: { headers, statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(headers.location).toBe(
          '/library/my-form-slug/editor-v2/responses'
        )
        expect(sendFormSubmissionsFile).toHaveBeenCalledTimes(1)
      })
    })

    describe('action=feedback', () => {
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
          url: '/library/my-form-slug/editor-v2/responses',
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

        jest.mocked(sendFormSubmissionsFile).mockResolvedValueOnce({
          message: 'Generate file success'
        })

        const options = {
          method: 'post',
          url: '/library/my-form-slug/editor-v2/responses',
          auth,
          payload: { action: 'feedback' }
        }

        const {
          response: { headers, statusCode }
        } = await renderResponse(server, options)

        expect(statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(headers.location).toBe(
          '/library/my-form-slug/editor-v2/responses'
        )
        expect(sendFeedbackSubmissionsFile).toHaveBeenCalledTimes(1)
      })
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
