/**
 * @interface IAIProvider
 */
export class IAIProvider {
  /**
   * @abstract
   * @param {string} prompt
   * @returns {Promise<AIResponse>}
   */
  async generate(prompt) {
    throw new Error('Method must be implemented')
  }

  /**
   * @abstract
   * @param {string} prompt
   * @returns {boolean}
   */
  validatePrompt(prompt) {
    throw new Error('Method must be implemented')
  }
}

/**
 * @typedef {Object} AIResponse
 * @property {string} content
 * @property {Object} usage
 * @property {number} usage.inputTokens
 * @property {number} usage.outputTokens
 * @property {string} model
 */
