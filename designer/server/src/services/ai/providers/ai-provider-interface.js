/**
 * @interface IAIProvider
 */
export class IAIProvider {
  /**
   * @abstract
   * @param {string} _prompt
   * @returns {Promise<AIResponse>}
   */
  generate(_prompt) {
    throw new Error('Method must be implemented')
  }

  /**
   * @abstract
   * @param {string} _prompt
   * @param {string} _sessionId
   * @param {FormPreferences} _preferences
   * @returns {Promise<AgenticAIResponse>}
   */
  generateFormAgentic(_prompt, _sessionId, _preferences) {
    throw new Error('Method must be implemented')
  }

  /**
   * @abstract
   * @param {string} _prompt
   * @returns {boolean}
   */
  validatePrompt(_prompt) {
    throw new Error('Method must be implemented')
  }
}

/**
 * @typedef {object} AIResponse
 * @property {string} content - The generated content from the AI
 * @property {object} usage - Token usage information
 * @property {number} usage.inputTokens - Number of input tokens consumed
 * @property {number} usage.outputTokens - Number of output tokens generated
 * @property {string} model - The AI model used for generation
 */

/**
 * @typedef {object} FormPreferences
 * @property {string} [refinementContext] - Context for refinement attempts
 * @property {boolean} [accessibilityFocus] - Focus on accessibility features
 * @property {string} [theme] - UI theme preferences
 */

/**
 * @typedef {object} WorkflowStep
 * @property {string} tool - Name of the tool used
 * @property {object} input - Input passed to the tool
 * @property {number} step - Step number in the workflow
 */

/**
 * @typedef {object} AgenticAIResponse
 * @property {string} content - The generated content from the AI
 * @property {FormDefinition} [formDefinition] - The parsed form definition object (optional - present when agentic validation passes)
 * @property {object} usage - Token usage information
 * @property {number} usage.inputTokens - Number of input tokens consumed
 * @property {number} usage.outputTokens - Number of output tokens generated
 * @property {string} model - The AI model used for generation
 * @property {WorkflowStep[]} workflowSteps - Steps taken by the agentic system
 * @property {boolean} agenticApproach - Whether this used the agentic approach
 * @property {number} conversationTurns - Number of conversation turns in the agentic workflow
 * @property {number} refinementAttempts - Number of refinement attempts made
 */

/**
 * @import { FormDefinition } from '@defra/forms-model'
 */
