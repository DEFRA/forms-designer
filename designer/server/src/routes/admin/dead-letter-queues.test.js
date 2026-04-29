import { DeadLetterQueues } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import {
  deleteDeadLetterQueueMessage,
  getDeadLetterQueueMessage,
  getDeadLetterQueueMessages,
  redriveDeadLetterQueueMessages,
  resubmitDeadLetterQueueMessage
} from '~/src/lib/dead-letter-queue.js'
import { validateMessageJson } from '~/src/routes/admin/dead-letter-queue-helper.js'
import { authSuperAdmin as auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/dead-letter-queue.js')
jest.mock('~/src/messaging/publish.js')

const validJsonMessage = {
  MessageId: 'cc9a6f39-7b9f-4a02-90c0-bb232d2a5555',
  Body: {
    meta: {
      schemaVersion: 1,
      timestamp: '2026-04-23T10:58:56.922Z',
      referenceNumber: '8NW-H8U-B79',
      formName: 'Test submit',
      formId: '69b2cc419148aa6a1f983d75',
      formSlug: 'test-submit',
      status: 'draft',
      isPreview: true,
      notificationEmail: 'test@test.co.uk',
      versionMetadata: {
        versionNumber: 7,
        createdAt: '2026-04-16T09:08:28.897Z'
      },
      custom: {
        userConfirmationEmail: ''
      }
    },
    data: {
      main: {
        dwueGz: 'John',
        KvLcmD: 'Apple'
      },
      repeaters: {},
      files: {}
    },
    result: {
      files: {
        main: '9c1c2458-3143-49c9-89fe-86c18d934c15',
        repeaters: {}
      }
    }
  }
}

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
        .mockResolvedValueOnce([])
        // @ts-expect-error - invalid response to throw error
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce([{}, {}])
        .mockResolvedValueOnce([{}, {}, {}])
        .mockResolvedValueOnce([{}, {}, {}, {}])
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
      expect($links[5]).toHaveTextContent('My account')
      expect($links[6]).toHaveTextContent('Manage users')
      expect($links[7]).toHaveTextContent('Admin tools')
      expect($links[8]).toHaveTextContent('Support')
      expect($links[9]).toHaveTextContent('Back to admin tools home')

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
      jest.mocked(getDeadLetterQueueMessages).mockResolvedValue([
        {
          MessageId: 'message-id',
          Body: '{ "field1": "value1" }',
          ReceiptHandle: 'rec-handle'
        }
      ])
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
      jest.mocked(getDeadLetterQueueMessages).mockResolvedValue([
        {
          MessageId: 'message-id',
          Body: '{ "field1": "value1" }',
          ReceiptHandle: 'rec-handle'
        }
      ])

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
      expect($links[5]).toHaveTextContent('My account')
      expect($links[6]).toHaveTextContent('Manage users')
      expect($links[7]).toHaveTextContent('Admin tools')
      expect($links[8]).toHaveTextContent('Support')
      expect($links[9]).toHaveTextContent('Back to dead-letter queues')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.headers['content-type']).toContain('text/html')

      expect($messages).toHaveLength(1)
      expect($button).toBeInTheDocument()

      expect(response.result).toMatchSnapshot()
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
      expect(headers.location).toBe('/admin/dead-letter-queues')
    })

    test('should render confirmation screen for delete message', async () => {
      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues/audit-api/delete',
        auth,
        payload: {
          action: 'confirm',
          messageId: 'message-id'
        }
      }

      const { response, container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $headings2 = container.getAllByRole('heading', { level: 2 })
      const $button = container.getByRole('button', {
        name: 'Delete message'
      })

      expect($mastheadHeading).toHaveTextContent('Admin tools')
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      expect($headings2[0]).toHaveTextContent(
        "Are you sure you want to delete message 'message-id' from the 'audit-api' queue?"
      )

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.headers['content-type']).toContain('text/html')

      expect($button).toBeInTheDocument()
    })

    test('should delete if delete button pressed on confirmation screen', async () => {
      jest.mocked(deleteDeadLetterQueueMessage).mockResolvedValue()

      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues/audit-api/delete',
        auth,
        payload: {
          action: 'delete',
          messageId: 'message-id'
        }
      }

      const {
        response: { statusCode, headers }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
      expect(deleteDeadLetterQueueMessage).toHaveBeenCalledWith(
        'audit-api',
        'message-id',
        expect.any(String)
      )
      expect(headers.location).toBe('/admin/dead-letter-queues/audit-api')
    })

    test('should render modify form with message content and resubmit button', async () => {
      jest.mocked(getDeadLetterQueueMessages).mockResolvedValue([
        {
          MessageId: 'message-id',
          Body: '{ "field1": "value1" }',
          ReceiptHandle: 'rec-handle'
        }
      ])

      const options = {
        method: 'get',
        url: '/admin/dead-letter-queues/audit-api/modify/message-id',
        auth
      }

      const { response, container } = await renderResponse(server, options)

      const $mastheadHeading = container.getByRole('heading', { level: 1 })
      const $links = container.getAllByRole('link')
      const $button = container.getByRole('button', {
        name: 'Resubmit'
      })
      const $messages = container.getAllByRole('textbox')

      expect($mastheadHeading).toHaveTextContent('Admin tools')
      expect($mastheadHeading).toHaveClass('govuk-heading-xl')

      // Check tab headings and active tab
      expect($links[5]).toHaveTextContent('My account')
      expect($links[6]).toHaveTextContent('Manage users')
      expect($links[7]).toHaveTextContent('Admin tools')
      expect($links[8]).toHaveTextContent('Support')
      expect($links[9]).toHaveTextContent('Back to dead-letter queues')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.headers['content-type']).toContain('text/html')

      expect($messages).toHaveLength(1)
      expect($button).toBeInTheDocument()

      expect(response.result).toMatchSnapshot()
    })

    test('should show errors if resubmit button pressed when invalid JSON', async () => {
      jest.mocked(resubmitDeadLetterQueueMessage).mockResolvedValue()

      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues/audit-api/modify/12345',
        auth,
        payload: {
          messageJson: '{ abc: 123'
        }
      }

      const {
        response: { statusCode, headers }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(resubmitDeadLetterQueueMessage).not.toHaveBeenCalled()
      expect(headers.location).toBe(
        '/admin/dead-letter-queues/audit-api/modify/12345'
      )
    })

    test('should resubmit if resubmit button pressed when valid JSON', async () => {
      jest.mocked(resubmitDeadLetterQueueMessage).mockResolvedValue()

      jest.mocked(getDeadLetterQueueMessage).mockResolvedValue({
        MessageId: 'message-id',
        Body: '{ "field1": "value1" }',
        ReceiptHandle: 'rec-handle'
      })

      const options = {
        method: 'post',
        url: '/admin/dead-letter-queues/audit-api/modify/message-id',
        auth,
        payload: {
          messageJson: JSON.stringify(validJsonMessage)
        }
      }

      const {
        response: { statusCode, headers }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(resubmitDeadLetterQueueMessage).toHaveBeenCalledWith(
        'audit-api',
        'message-id',
        validJsonMessage.Body,
        expect.any(String)
      )
      expect(headers.location).toBe('/admin/dead-letter-queues')
    })
  })

  describe('validMessageJson', () => {
    it('should return error when invalid JSON', () => {
      const { error } = validateMessageJson('{ "abc": "123"')
      expect(error?.message).toBe(
        "Invalid JSON: Expected ',' or '}' after property value in JSON at position 14 (line 1 column 15)"
      )
    })

    it('should return error when valid JSON but no Body element', () => {
      const { error } = validateMessageJson('{ "abc": "123" }')
      expect(error?.message).toBe('Invalid JSON: Missing "Body" element')
    })

    it('should return error when valid JSON but invalid Body schema', () => {
      const { error } = validateMessageJson('{ "Body": {} }')
      expect(error?.message).toBe(
        'JSON does not match the schema: "meta" is required, "data" is required, "result" is required'
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
