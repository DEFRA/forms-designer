import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
import {
  ResponseParser,
  ValidationError
} from '~/src/services/ai/response-parser.js'

/**
 * @typedef {object} ValidationDetail
 * @property {string[]} [path] - The path to the validation error
 * @property {string} message - The error message
 */

/**
 * @typedef {import('./providers/ai-provider-interface.js').FormPreferences} FormPreferences
 */

const logger = createLogger()

export class FormGenerationError extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} cause
   */
  constructor(message, cause = undefined) {
    super(message)
    this.name = 'FormGenerationError'
    this.cause = cause
  }
}

export class FormGeneratorService {
  /**
   * @param {IAIProvider} aiProvider
   * @param {AIFormValidator} validator
   */
  constructor(aiProvider, validator) {
    this.aiProvider = aiProvider
    this.validator = validator
    this.promptBuilder = new PromptBuilder()
    this.responseParser = new ResponseParser()
    this.maxRetries = 3
  }

  /**
   * @param {unknown} error
   * @returns {string}
   */
  extractErrorDetails(error) {
    if (
      error &&
      typeof error === 'object' &&
      'details' in error &&
      Array.isArray(error.details)
    ) {
      return error.details
        .map(
          (/** @type {ValidationDetail} */ d) =>
            `- ${d.path?.join('.') ?? 'unknown'}: ${d.message}`
        )
        .join('\n')
    }

    if (error instanceof Error) {
      return error.message
    }

    return typeof error === 'string' ? error : 'Unknown error occurred'
  }

  /**
   * @param {FormPreferences} preferences
   * @param {unknown} lastError
   * @returns {FormPreferences}
   */
  enhancePreferencesWithError(preferences, lastError) {
    const errorDetails = this.extractErrorDetails(lastError)
    return {
      ...preferences,
      refinementContext: `Previous attempt failed: ${errorDetails}`
    }
  }

  /**
   * @param {string} description
   * @param {FormPreferences} preferences
   * @returns {Promise<object>}
   */
  async generateForm(description, preferences = {}) {
    logger.info('FormGeneratorService.generateForm() started')

    let lastError = null

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info(`Form generation attempt ${attempt}`)

        logger.info(
          'Using agentic approach - AI will autonomously plan and generate form'
        )

        const enhancedPreferences =
          attempt > 1 && lastError
            ? this.enhancePreferencesWithError(preferences, lastError)
            : preferences

        if (attempt > 1) {
          logger.info('Adding refinement context to preferences')
        }

        logger.info('Calling AI provider with agentic approach')
        const startTime = Date.now()
        const aiResponse = await this.aiProvider.generateFormAgentic(
          description,
          '',
          enhancedPreferences
        )
        const duration = Date.now() - startTime

        logger.info('AI provider responded', {
          duration: `${duration}ms`
        })

        if (aiResponse.formDefinition) {
          const formDefinition = aiResponse.formDefinition
          const summary = this.responseParser.extractFormSummary(formDefinition)

          logger.info('Form generation successful')

          return {
            formDefinition,
            summary,
            metadata: {
              aiGenerated: true,
              generatedAt: new Date(),
              tokensUsed: aiResponse.usage,
              attempts: attempt,
              agenticApproach: aiResponse.agenticApproach,
              conversationTurns: aiResponse.conversationTurns,
              refinementAttempts: aiResponse.refinementAttempts
            }
          }
        }

        // Fallback: parse from content (for backwards compatibility)
        logger.info('Parsing form definition from content')
        const formDefinition = this.responseParser.parseFormDefinition(
          aiResponse.content
        )
        logger.info('Form definition parsed')

        const customValidation =
          this.validator.validateFormIntegrity(formDefinition)
        if (!customValidation.isValid) {
          throw new ValidationError(
            'Form integrity validation failed',
            undefined
          )
        }

        const summary = this.responseParser.extractFormSummary(formDefinition)

        logger.info('Form generation successful')

        return {
          formDefinition,
          summary,
          metadata: {
            aiGenerated: true,
            generatedAt: new Date(),
            tokensUsed: aiResponse.usage,
            attempts: attempt
          }
        }
      } catch (error) {
        lastError = error
        logger.warn('Form generation attempt failed', error)

        if (attempt === this.maxRetries) {
          break
        }

        if (error instanceof Error && error.message.includes('rate limit')) {
          break
        }
      }
    }

    const errorMessage = this.extractErrorDetails(lastError)
    logger.error('Form generation failed after all attempts')

    throw new FormGenerationError(
      `Failed to generate valid form after ${this.maxRetries} attempts: ${errorMessage}`,
      lastError instanceof Error ? lastError : undefined
    )
  }

  /**
   * @param {string} originalDescription
   * @param {string} feedback
   * @param {object} previousDefinition
   */
  async regenerateForm(originalDescription, feedback, previousDefinition) {
    try {
      const prompt = this.promptBuilder.buildRegenerationPrompt(
        originalDescription,
        feedback,
        previousDefinition
      )

      const aiResponse = await this.aiProvider.generate(prompt)
      const formDefinition = this.responseParser.parseFormDefinition(
        aiResponse.content
      )

      const customValidation =
        this.validator.validateFormIntegrity(formDefinition)
      if (!customValidation.isValid) {
        throw new ValidationError(
          'Regenerated form integrity validation failed',
          undefined
        )
      }

      const summary = this.responseParser.extractFormSummary(formDefinition)

      logger.info('Form regeneration successful')

      return {
        formDefinition,
        summary,
        metadata: {
          aiGenerated: true,
          regenerated: true,
          generatedAt: new Date(),
          originalFeedback: feedback
        }
      }
    } catch (error) {
      const errorMessage = this.extractErrorDetails(error)
      logger.error('Form regeneration failed', error)
      throw new FormGenerationError(
        `Failed to regenerate form: ${errorMessage}`,
        error instanceof Error ? error : undefined
      )
    }
  }
}

/**
 * @import { IAIProvider } from '~/src/services/ai/providers/ai-provider-interface.js'
 * @import { AIFormValidator } from '~/src/services/ai/form-validator.js'
 */
