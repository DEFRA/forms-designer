import { getErrorMessage } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { logger } from '~/src/common/helpers/logging/logger.js'

/**
 * Total number of attempts - the first call plus two retries.
 */
export const MAX_ATTEMPTS = 3

/**
 * Delay before the first retry, doubled for each attempt after that.
 */
export const INITIAL_DELAY_MS = 200

const retryableStatusCodes = /** @type {number[]} */ ([
  StatusCodes.REQUEST_TIMEOUT,
  StatusCodes.TOO_MANY_REQUESTS
])

const serverErrorStatusCode = /** @type {number} */ (
  StatusCodes.INTERNAL_SERVER_ERROR
)

/**
 * Only transient failures are worth retrying. A 4xx from forms-manager (eg a
 * validation error) fails the same way however many times we send it.
 * @param {unknown} err
 */
export function isRetryable(err) {
  if (!Boom.isBoom(err)) {
    // Connection resets, DNS failures and socket timeouts never get boomified
    return true
  }

  const { statusCode } = err.output

  return (
    statusCode >= serverErrorStatusCode ||
    retryableStatusCodes.includes(statusCode)
  )
}

/**
 * @param {number} delayMs
 */
function wait(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs))
}

/**
 * Runs an operation, retrying transient failures with an exponential back-off.
 * The last failure is rethrown untouched, so callers can still surface any
 * validation message the service sent back.
 * @template T
 * @param {() => Promise<T>} operation
 * @param {RetryOptions} [options]
 * @returns {Promise<T>}
 */
export async function withRetry(operation, options = {}) {
  const {
    attempts = MAX_ATTEMPTS,
    initialDelayMs = INITIAL_DELAY_MS,
    description = 'Request'
  } = options

  for (let attempt = 1; attempt < attempts; attempt++) {
    try {
      return await operation()
    } catch (err) {
      if (!isRetryable(err)) {
        throw err
      }

      const delayMs = initialDelayMs * 2 ** (attempt - 1)

      logger.warn(
        `${description} failed (attempt ${attempt} of ${attempts}), retrying in ${delayMs}ms: ${getErrorMessage(err)}`
      )

      await wait(delayMs)
    }
  }

  // Nothing is retried after the final attempt - the caller handles any failure
  return operation()
}

/**
 * @typedef {object} RetryOptions
 * @property {number} [attempts] - total attempts, including the first call
 * @property {number} [initialDelayMs] - delay before the first retry
 * @property {string} [description] - used when logging a retry
 */
