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
   * @param {string} description
   * @param {FormPreferences} _preferences
   * @param {Function} [updateProgress] - Optional progress callback
   * @returns {Promise<{formDefinition: object, summary: object, metadata: object}>}
   */
  async generateForm(description, _preferences = {}, updateProgress) {
    logger.info('FormGeneratorService.generateForm() started')

    try {
      if (updateProgress) {
        await updateProgress('ai_generation', 'Generating form with AI...', {})
      }

      const startTime = Date.now()

      const progressCallback = updateProgress ?? (() => Promise.resolve())

      const aiResponse = this.aiProvider.useDirectGeneration
        ? await this.aiProvider.generateFormDirect(
            description,
            '',
            progressCallback
          )
        : await this.aiProvider.generateFormAgentic(
            description,
            '',
            progressCallback
          )

      const duration = Date.now() - startTime

      logger.info('AI provider responded', {
        duration: `${duration}ms`
      })

      if (aiResponse.formDefinition) {
        const formDefinition = aiResponse.formDefinition

        const gdsValidation =
          this.responseParser.validateGDSCompliance(formDefinition)

        if (!gdsValidation.isValid) {
          throw new ValidationError(
            `Generated form violates GDS standards: ${gdsValidation.errors.join(', ')}`,
            gdsValidation.errors.map((error) => ({
              message: error,
              path: [],
              type: 'gds.violation'
            }))
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
            attempts: 1,
            agenticApproach: aiResponse.agenticApproach,
            conversationTurns: aiResponse.conversationTurns,
            refinementAttempts: aiResponse.refinementAttempts
          }
        }
      }

      logger.info('Parsing form definition from content')
      const formDefinition = this.responseParser.parseFormDefinition(
        aiResponse.content
      )
      logger.info('Form definition parsed')

      const customValidation =
        this.validator.validateFormIntegrity(formDefinition)
      if (!customValidation.isValid) {
        throw new ValidationError('Form integrity validation failed', undefined)
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
          attempts: 1
        }
      }
    } catch (error) {
      const errorMessage = this.extractErrorDetails(error)
      logger.error('Form generation failed')

      throw new FormGenerationError(
        `Failed to generate valid form: ${errorMessage}`,
        error instanceof Error ? error : undefined
      )
    }
  }
}

/**
 * @import { IAIProvider } from '~/src/services/ai/providers/ai-provider-interface.js'
 * @import { AIFormValidator } from '~/src/services/ai/form-validator.js'
 */
