import { createLogContext, runWithLogContext } from '@defra/forms-common'
import Boom from '@hapi/boom'
import Wreck from '@hapi/wreck'

import { getJson, request } from '~/src/lib/fetch.js'

jest.mock('@hapi/wreck')

describe('fetch', () => {
  const url = new URL('http://example.com/api')

  /** @type {any} */
  const okResponse = { statusCode: 200, headers: {} }

  describe('request', () => {
    it('should return the response and body', async () => {
      const body = { data: 'test' }

      jest.mocked(Wreck.request).mockResolvedValue(okResponse)
      jest.mocked(Wreck.read).mockResolvedValue(body)

      const result = await request('get', url, {})

      expect(result).toEqual({ response: okResponse, body })
      expect(Wreck.request).toHaveBeenCalledWith(
        'get',
        'http://example.com/api',
        {}
      )
    })

    it('should send the correlation ID of the log context', async () => {
      const context = createLogContext({ correlationId: 'correlation-id' })

      jest.mocked(Wreck.request).mockResolvedValue(okResponse)
      jest.mocked(Wreck.read).mockResolvedValue({})

      await runWithLogContext(context, () =>
        request('get', url, { headers: { accept: 'application/json' } })
      )

      expect(Wreck.request).toHaveBeenCalledWith(
        'get',
        'http://example.com/api',
        {
          headers: {
            accept: 'application/json',
            'x-cdp-request-id': 'correlation-id'
          }
        }
      )
    })

    it('should send the correlation ID when there are no options', async () => {
      const context = createLogContext({ correlationId: 'correlation-id' })

      jest.mocked(Wreck.request).mockResolvedValue(okResponse)
      jest.mocked(Wreck.read).mockResolvedValue({})

      await runWithLogContext(context, () => getJson(url))

      expect(Wreck.request).toHaveBeenCalledWith(
        'get',
        'http://example.com/api',
        { json: true, headers: { 'x-cdp-request-id': 'correlation-id' } }
      )
    })

    it('should throw a Boom error with the message of the response', async () => {
      /** @type {any} */
      const response = { statusCode: 404 }
      const body = { message: 'Not found', cause: 'Resource missing' }

      jest.mocked(Wreck.request).mockResolvedValue(response)
      jest.mocked(Wreck.read).mockResolvedValue(body)

      await expect(request('get', url, {})).rejects.toThrow(
        Boom.boomify(new Error('Not found', { cause: 'Resource missing' }), {
          statusCode: 404,
          data: body
        })
      )
    })

    it('should throw a Boom error with the status code of the response', async () => {
      /** @type {any} */
      const response = { statusCode: 500 }

      jest.mocked(Wreck.request).mockResolvedValue(response)
      jest.mocked(Wreck.read).mockResolvedValue({})

      await expect(request('get', url, {})).rejects.toThrow(
        'HTTP status code 500'
      )
    })
  })
})
