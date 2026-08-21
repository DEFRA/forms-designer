import Boom from '@hapi/boom'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { MAX_ATTEMPTS, isRetryable, withRetry } from '~/src/lib/retry.js'

jest.mock('~/src/common/helpers/logging/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn() }
}))

const noDelay = { initialDelayMs: 0 }

describe('retry', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('isRetryable', () => {
    test('should retry errors that never reached the service', () => {
      expect(isRetryable(new Error('socket hang up'))).toBe(true)
    })

    test.each([500, 502, 503, 504, 408, 429])(
      'should retry a %s response',
      (statusCode) => {
        expect(isRetryable(new Boom.Boom('Error', { statusCode }))).toBe(true)
      }
    )

    test.each([400, 401, 403, 404, 409])(
      'should not retry a %s response',
      (statusCode) => {
        expect(isRetryable(new Boom.Boom('Error', { statusCode }))).toBe(false)
      }
    )
  })

  describe('withRetry', () => {
    test('should return the result of a successful call', async () => {
      const operation = jest.fn().mockResolvedValue('done')

      await expect(withRetry(operation, noDelay)).resolves.toBe('done')
      expect(operation).toHaveBeenCalledTimes(1)
    })

    test('should retry a transient failure until it succeeds', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(Boom.serverUnavailable('Service unavailable'))
        .mockResolvedValue('done')

      await expect(withRetry(operation, noDelay)).resolves.toBe('done')
      expect(operation).toHaveBeenCalledTimes(2)
      expect(logger.warn).toHaveBeenCalledTimes(1)
    })

    test('should make no more than three attempts in total', async () => {
      const operation = jest
        .fn()
        .mockRejectedValue(Boom.badGateway('Bad gateway'))

      await expect(withRetry(operation, noDelay)).rejects.toThrow('Bad gateway')
      expect(operation).toHaveBeenCalledTimes(MAX_ATTEMPTS)
    })

    test('should not retry a validation error', async () => {
      const operation = jest
        .fn()
        .mockRejectedValue(Boom.badRequest('Invalid form definition'))

      await expect(withRetry(operation, noDelay)).rejects.toThrow(
        'Invalid form definition'
      )
      expect(operation).toHaveBeenCalledTimes(1)
      expect(logger.warn).not.toHaveBeenCalled()
    })

    test('should back off exponentially between attempts', async () => {
      jest.useFakeTimers()

      try {
        const operation = jest
          .fn()
          .mockRejectedValue(Boom.badGateway('Bad gateway'))

        const promise = withRetry(operation, { initialDelayMs: 200 })
        promise.catch(() => undefined)

        await jest.advanceTimersByTimeAsync(199)
        expect(operation).toHaveBeenCalledTimes(1)

        await jest.advanceTimersByTimeAsync(1)
        expect(operation).toHaveBeenCalledTimes(2)

        await jest.advanceTimersByTimeAsync(399)
        expect(operation).toHaveBeenCalledTimes(2)

        await jest.advanceTimersByTimeAsync(1)
        expect(operation).toHaveBeenCalledTimes(3)

        await expect(promise).rejects.toThrow('Bad gateway')
      } finally {
        jest.useRealTimers()
      }
    })

    test('should honour a custom attempt count', async () => {
      const operation = jest
        .fn()
        .mockRejectedValue(Boom.badGateway('Bad gateway'))

      await expect(
        withRetry(operation, { ...noDelay, attempts: 2 })
      ).rejects.toThrow('Bad gateway')
      expect(operation).toHaveBeenCalledTimes(2)
    })
  })
})
