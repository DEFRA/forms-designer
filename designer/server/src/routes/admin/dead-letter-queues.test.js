import { DeadLetterQueues } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import {
  getDeadLetterQueueMessages,
  redriveDeadLetterQueueMessages
} from '~/src/lib/dead-letter-queue.js'
import { authSuperAdmin as auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/dead-letter-queue.js')

describe('Dead-letter queues routes', () => {
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

  describe('Journey', () => {
    test('should render form with radio options with counts', async () => {
      jest
        .mocked(getDeadLetterQueueMessages)
        .mockResolvedValueOnce({ messages: [] })
        // @ts-expect-error - invalid response to throw error
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ messages: [{}, {}] })
        .mockResolvedValueOnce({ messages: [{}, {}, {}] })
        .mockResolvedValueOnce({ messages: [{}, {}, {}, {}] })
      const options = {
        method: 'get',
        url: '/admin/dead-letter-queues',
        auth
      }

      const { response, container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $links = container.getAllByRole('link')
      const $radios = container.getAllByRole('radio')

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

      expect($radios).toHaveLength(5)
      expect($radios[0].outerHTML).toContain('value="audit-api"')
      expect($radios[0]).toHaveAccessibleName('audit-api - 0 messages')
      expect($radios[1].outerHTML).toContain('value="notify-listener"')
      expect($radios[1]).toHaveAccessibleName('notify-listener - error')
      expect($radios[2].outerHTML).toContain('value="sharepoint-listener"')
      expect($radios[2]).toHaveAccessibleName(
        'sharepoint-listener - 2 messages'
      )
      expect($radios[3].outerHTML).toContain(
        'value="submissions-api (form submissions)"'
      )
      expect($radios[3]).toHaveAccessibleName(
        'submissions-api (form submissions) - 3 messages'
      )
      expect($radios[4].outerHTML).toContain(
        'value="submissions-api (save-and-exit)"'
      )
      expect($radios[4]).toHaveAccessibleName(
        'submissions-api (save-and-exit) - 4 messages'
      )
      expect(response.result).toMatchSnapshot()
    })

    test('should error if invalid payload key', async () => {
      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues',
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
        url: '/admin/dead-letter-queues',
        auth,
        payload: { dlq: 'invalid' }
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    })

    test('should redirect to next screen if valid queue selected and display queue messages', async () => {
      jest.mocked(getDeadLetterQueueMessages).mockResolvedValue({
        messages: [
          {
            MessageId: 'message-id',
            Body: '{ "field1": "value1" }',
            ReceiptHandle: 'rec-handle'
          }
        ]
      })
      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues',
        auth,
        payload: { dlq: DeadLetterQueues.AuditApi }
      }

      const {
        response: { statusCode, headers }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe('/admin/dead-letter-queues/audit-api')
    })

    test('should render form with messages and redrive button', async () => {
      jest.mocked(getDeadLetterQueueMessages).mockResolvedValue({
        messages: [
          {
            MessageId: 'message-id',
            Body: '{ "field1": "value1" }',
            ReceiptHandle: 'rec-handle'
          }
        ]
      })

      const options = {
        method: 'get',
        url: '/admin/dead-letter-queues/audit-api',
        auth
      }

      const { response, container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $links = container.getAllByRole('link')
      const $button = container.getByRole('button', {
        name: 'Redrive all messages'
      })
      const $messages = container.getAllByRole('code')

      expect($mastheadHeading).toHaveTextContent('Admin tools')
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      // Check tab headings and active tab
      expect($links[4]).toHaveTextContent('My account')
      expect($links[5]).toHaveTextContent('Manage users')
      expect($links[6]).toHaveTextContent('Admin tools')
      expect($links[7]).toHaveTextContent('Support')
      expect($links[8]).toHaveTextContent('Back to dead-letter queues')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.headers['content-type']).toContain('text/html')

      expect($messages).toHaveLength(1)
      expect($button).toBeInTheDocument()

      expect(response.result).toMatchSnapshot()
    })

    test('should forward to confirmation screen if redrive selected', async () => {
      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues/audit-api',
        auth
      }

      const {
        response: { statusCode, headers }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
      expect(headers.location).toBe(
        '/admin/dead-letter-queues/audit-api/redrive'
      )
    })

    test('should render confirmation screen', async () => {
      const options = {
        method: 'get',
        url: '/admin/dead-letter-queues/audit-api/redrive',
        auth
      }

      const { response, container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $headings2 = container.getAllByRole('heading', { level: 2 })
      const $button = container.getByRole('button', {
        name: 'Redrive all messages'
      })

      expect($mastheadHeading).toHaveTextContent('Admin tools')
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      expect($headings2[0]).toHaveTextContent(
        "Are you sure you want to redrive all messages from the 'audit-api' queue?"
      )

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.headers['content-type']).toContain('text/html')

      expect($button).toBeInTheDocument()
    })

    test('should redrive if redrive button pressed on confirmation screen', async () => {
      jest.mocked(redriveDeadLetterQueueMessages).mockResolvedValue()

      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues/audit-api/redrive',
        auth
      }

      const {
        response: { statusCode, headers }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
      expect(redriveDeadLetterQueueMessages).toHaveBeenCalledWith(
        'audit-api',
        expect.any(String)
      )
      expect(headers.location).toBe('/admin/index')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
