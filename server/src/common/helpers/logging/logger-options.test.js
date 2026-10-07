import { createLogContext, runWithLogContext } from '@defra/forms-common'

import { loggerOptions } from '~/src/common/helpers/logging/logger-options.js'

describe('logger-options', () => {
  const correlationId = '1066e8cc-8e1e-4671-8ad7-b4cd9c95bb94'
  const userId = '86758ba9-92e7-4287-9751-7705e449f0a5'

  describe('mixin', () => {
    it('should add nothing outside of a log context', () => {
      expect(loggerOptions.mixin()).toEqual({})
    })

    it('should add the trace ID', () => {
      runWithLogContext(createLogContext({ correlationId }), () => {
        expect(loggerOptions.mixin()).toEqual({ trace: { id: correlationId } })
      })
    })

    it('should add the user ID when there is one', () => {
      runWithLogContext(createLogContext({ correlationId, userId }), () => {
        expect(loggerOptions.mixin()).toEqual({
          trace: { id: correlationId },
          user: { id: userId }
        })
      })
    })
  })

  describe('logMethod', () => {
    it('should write the user ID into the message', () => {
      const logger = /** @type {Logger} */ (/** @type {unknown} */ ({}))
      const method = jest.fn()

      runWithLogContext(createLogContext({ correlationId, userId }), () => {
        loggerOptions.hooks.logMethod.call(logger, ['message'], method)
      })

      expect(method).toHaveBeenCalledWith(`[uid:${userId}] message`)
    })
  })
})

/**
 * @import { Logger } from 'pino'
 */
