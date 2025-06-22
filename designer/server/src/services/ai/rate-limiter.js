import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export class RateLimitError extends Error {
  /**
   * @param {string} message
   * @param {number} retryAfter
   */
  constructor(message, retryAfter = 60) {
    super(message)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

export class TokenBucketRateLimiter {
  /**
   * @param {Object} config
   * @param {number} config.capacity - Maximum tokens in bucket
   * @param {number} config.refillRate - Tokens added per second
   * @param {number} config.tokensPerRequest - Tokens consumed per request
   */
  constructor(config) {
    this.capacity = config.capacity || 10
    this.refillRate = config.refillRate || 1
    this.tokensPerRequest = config.tokensPerRequest || 1
    this.tokens = this.capacity
    this.lastRefill = Date.now()
    this.requests = new Map() // For per-user tracking
  }

  /**
   * Check if request is allowed
   * @param {string} userId - User identifier for per-user limits
   */
  checkLimit(userId = 'default') {
    const now = Date.now()
    const timePassed = (now - this.lastRefill) / 1000

    // Refill tokens based on time passed
    this.tokens = Math.min(
      this.capacity,
      this.tokens + timePassed * this.refillRate
    )
    this.lastRefill = now

    // Check per-user limits
    if (userId !== 'default') {
      const userRequests = this.requests.get(userId) ?? {
        count: 0,
        resetTime: now + 3600000
      }

      if (now > userRequests.resetTime) {
        userRequests.count = 0
        userRequests.resetTime = now + 3600000
      }

      if (userRequests.count >= 20) {
        // 20 requests per hour per user
        throw new RateLimitError('User rate limit exceeded', 3600)
      }

      userRequests.count++
      this.requests.set(userId, userRequests)
    }

    // Check global token bucket
    if (this.tokens < this.tokensPerRequest) {
      const retryAfter = Math.ceil(
        (this.tokensPerRequest - this.tokens) / this.refillRate
      )
      logger.warn('Rate limit exceeded', { userId, retryAfter })
      throw new RateLimitError('Rate limit exceeded', retryAfter)
    }

    this.tokens -= this.tokensPerRequest
    logger.debug('Rate limit check passed', {
      userId,
      tokensRemaining: this.tokens
    })
  }

  /**
   * Get current rate limit status
   * @param {string} userId
   */
  getStatus(userId = 'default') {
    const now = Date.now()
    const timePassed = (now - this.lastRefill) / 1000
    const currentTokens = Math.min(
      this.capacity,
      this.tokens + timePassed * this.refillRate
    )

    const userRequests = this.requests.get(userId) ?? {
      count: 0,
      resetTime: now + 3600000
    }
    const userRequestsRemaining = Math.max(0, 20 - userRequests.count)

    return {
      tokensAvailable: Math.floor(currentTokens),
      capacity: this.capacity,
      userRequestsRemaining,
      nextRefill: Math.ceil(
        (this.tokensPerRequest - currentTokens) / this.refillRate
      )
    }
  }

  /**
   * Reset rate limiter (for testing)
   */
  reset() {
    this.tokens = this.capacity
    this.lastRefill = Date.now()
    this.requests.clear()
  }
}
