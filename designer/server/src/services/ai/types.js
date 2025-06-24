/**
 * @typedef {object} AIProviderConfig
 * @property {string} apiKey - API key for the AI provider
 * @property {string} model - Model name to use
 * @property {number} maxTokens - Maximum tokens for generation
 * @property {number} temperature - Temperature for generation (0-1)
 */

/**
 * @typedef {object} AIResponse
 * @property {string} content - Generated content
 * @property {object} formDefinition - Parsed form definition object
 * @property {AIUsage} usage - Token usage information
 * @property {string} model - Model used for generation
 */

/**
 * @typedef {object} AIUsage
 * @property {number} inputTokens - Number of input tokens used
 * @property {number} outputTokens - Number of output tokens generated
 */

/**
 * @typedef {object} IRateLimiter
 * @property {function(string): void} checkLimit - Check if rate limit allows request
 */

/**
 * @typedef {object} ICache
 * @property {function(string): Promise<any>} get - Get cached value
 * @property {function(string, any, number): Promise<void>} set - Set cached value with TTL
 */
