import {
  createLogContext,
  getCorrelationId,
  getSessionId,
  getUserId,
  runWithLogContext
} from '@defra/forms-common'
import { getTraceId } from '@defra/hapi-tracing'
import hapi from '@hapi/hapi'
import yar from '@hapi/yar'

import {
  applyLogContextHeaders,
  applyTraceHeaders,
  getRequestSessionId,
  getRequestUserId,
  requestTracing
} from '~/src/common/helpers/request-tracing.js'

describe('request-tracing', () => {
  const tracingHeader = 'x-cdp-request-id'
  const correlationId = '1066e8cc-8e1e-4671-8ad7-b4cd9c95bb94'
  const userId = '86758ba9-92e7-4287-9751-7705e449f0a5'
  const sessionId = 'c3a2e5f4-2b8e-4e1f-9a8d-3f6b7c1d2e9a'

  describe('plugin', () => {
    /** @type {Server} */
    let server

    /** @type {{ correlationId?: string, userId?: string, sessionId?: string }} */
    let responseContext

    beforeEach(async () => {
      server = hapi.server()
      responseContext = {}

      server.auth.scheme('test', () => ({
        authenticate(request, h) {
          return h.authenticated({
            credentials: /** @type {AuthCredentials} */ (
              /** @type {unknown} */ ({ user: { id: userId } })
            )
          })
        }
      }))
      server.auth.strategy('test', 'test')

      await server.register(requestTracing)

      // Registered after the request tracing plugin, which must still read
      // the session ID once yar has loaded the session
      await server.register({
        plugin: yar,
        options: {
          cookieOptions: { password: 'a'.repeat(32), isSecure: false },
          customSessionIDGenerator: () => sessionId
        }
      })

      const handler = () => ({
        correlationId: getCorrelationId(),
        traceId: getTraceId(),
        userId: getUserId(),
        sessionId: getSessionId()
      })

      server.route([
        { method: 'GET', path: '/open', handler },
        {
          method: 'GET',
          path: '/secure',
          handler,
          options: { auth: 'test' }
        }
      ])

      // The response log is written when this event is emitted
      server.events.on('response', () => {
        responseContext = {
          correlationId: getCorrelationId(),
          userId: getUserId(),
          sessionId: getSessionId()
        }
      })
    })

    afterEach(async () => {
      await server.stop()
    })

    it('should use the correlation ID from the tracing header', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/open',
        headers: { [tracingHeader]: correlationId }
      })

      expect(result).toEqual({
        correlationId,
        traceId: correlationId,
        userId: undefined,
        sessionId
      })
      expect(responseContext).toEqual({
        correlationId,
        userId: undefined,
        sessionId
      })
    })

    it('should add the ID of the authenticated user', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/secure',
        headers: { [tracingHeader]: correlationId }
      })

      expect(result).toEqual({
        correlationId,
        traceId: correlationId,
        userId,
        sessionId
      })
      expect(responseContext).toEqual({ correlationId, userId, sessionId })
    })
  })

  describe('getRequestSessionId', () => {
    it('should return the ID of the yar session', () => {
      const request = /** @type {Request} */ (
        /** @type {unknown} */ ({ yar: { id: sessionId } })
      )

      expect(getRequestSessionId(request)).toBe(sessionId)
    })

    it('should return undefined when yar is not registered', () => {
      const request = /** @type {Request} */ (/** @type {unknown} */ ({}))

      expect(getRequestSessionId(request)).toBeUndefined()
    })
  })

  describe('getRequestUserId', () => {
    /**
     * @param {object} auth
     */
    function buildRequest(auth) {
      return /** @type {Request} */ (/** @type {unknown} */ ({ auth }))
    }

    it('should return the ID of the user', () => {
      const request = buildRequest({
        isAuthenticated: true,
        credentials: { user: { id: userId } }
      })

      expect(getRequestUserId(request)).toBe(userId)
    })

    it('should return undefined when there is no user', () => {
      const request = buildRequest({
        isAuthenticated: true,
        credentials: {}
      })

      expect(getRequestUserId(request)).toBeUndefined()
    })

    it('should return undefined when the request is not authenticated', () => {
      const request = buildRequest({
        isAuthenticated: false,
        credentials: { user: { id: userId } }
      })

      expect(getRequestUserId(request)).toBeUndefined()
    })
  })

  describe('applyTraceHeaders', () => {
    it('should return the headers unchanged outside of a log context', () => {
      const headers = { accept: 'application/json' }

      expect(applyTraceHeaders(headers)).toBe(headers)
      expect(applyTraceHeaders(undefined)).toBeUndefined()
    })

    it('should add the tracing header', () => {
      runWithLogContext(createLogContext({ correlationId }), () => {
        expect(applyTraceHeaders({ accept: 'application/json' })).toEqual({
          accept: 'application/json',
          [tracingHeader]: correlationId
        })
        expect(applyTraceHeaders(undefined)).toEqual({
          [tracingHeader]: correlationId
        })
      })
    })
  })

  describe('applyLogContextHeaders', () => {
    const referenceNumber = 'ABC-123-DEF'
    const context = createLogContext({
      correlationId,
      sessionId,
      referenceNumber
    })
    const headers = { accept: 'application/json' }

    it('should add the session ID and reference number for a forms service', () => {
      runWithLogContext(context, () => {
        expect(
          applyLogContextHeaders(
            new URL('http://localhost:3001/forms'),
            headers
          )
        ).toEqual({
          accept: 'application/json',
          'x-forms-session-id': sessionId,
          'x-forms-reference-number': referenceNumber
        })
      })
    })

    it.each([
      'http://example.com/api',
      'http://localhost:5556/.well-known/openid-configuration'
    ])('should return the headers unchanged for %s', (url) => {
      runWithLogContext(context, () => {
        expect(applyLogContextHeaders(new URL(url), headers)).toBe(headers)
      })
    })
  })
})

/**
 * @import { AuthCredentials, Request, Server } from '@hapi/hapi'
 */
