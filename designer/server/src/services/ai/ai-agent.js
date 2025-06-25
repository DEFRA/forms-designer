import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { FormValidationError } from '~/src/services/ai/form-validator.js'

/**
 * @typedef {object} AIServiceConfig
 * @property {number} [maxRetries] - Maximum number of retries for form generation
 * @property {number} [maxSelfRefinements] - Maximum number of self-refinements
 */

/**
 * @typedef {object} ValidationError
 * @property {string} type - The type of validation error
 * @property {string} message - The error message
 */

/**
 * @typedef {object} FormGenerationResult
 * @property {object} formDefinition - The generated form definition
 * @property {object} summary - Summary of the form
 * @property {object} metadata - Additional metadata about the generation
 */

/**
 * @typedef {object} GenerationResult
 * @property {boolean} success - Whether the form generation was successful
 * @property {object} formDefinition - The generated form definition
 * @property {number} attempts - The number of attempts made
 * @property {number} refinements - The number of refinements made
 * @property {object} metadata - Additional metadata about the generation
 */

/**
 * @typedef {object} RefinementResult
 * @property {object} formDefinition - The refined form definition
 * @property {number} refinements - The number of refinements made
 */

export class AIAgentError extends Error {
  /**
   * @param {string} message
   * @param {number} attempts
   * @param {Error | null} lastError
   */
  constructor(message, attempts = 0, lastError = null) {
    super(message)
    this.name = 'AIAgentError'
    this.attempts = attempts
    this.lastError = lastError
  }
}

export class AIFormAgent {
  /**
   * @param {AIServiceConfig} config
   * @param {FormGeneratorService} formGenerator
   * @param {AIFormValidator} validator
   * @param {PromptBuilder} promptBuilder
   */
  constructor(config, formGenerator, validator, promptBuilder) {
    this.config = config
    this.formGenerator = formGenerator
    this.validator = validator
    this.promptBuilder = promptBuilder
    this.maxRetries = config.maxRetries ?? 3
    this.maxSelfRefinements = config.maxSelfRefinements ?? 2
    this.logger = createLogger()
  }

  /**
   * Generate a form with agentic self-refinement
   * @param {string} description
   * @param {object} preferences
   * @param {string} sessionId
   * @returns {Promise<GenerationResult>}
   */
  async generateFormWithRefinement(description, preferences = {}, sessionId) {
    let attempts = 0
    let lastError = null
    let currentDefinition = null

    while (attempts < this.maxRetries) {
      try {
        this.logger.info('Starting form generation attempt')

        const generationResult = await this.formGenerator.generateForm(
          description,
          preferences
        )

        currentDefinition = generationResult.formDefinition

        const validationResult =
          this.validator.validateFormIntegrity(currentDefinition)

        if (validationResult.isValid) {
          this.logger.info('Form generation successful')

          return {
            success: true,
            formDefinition: currentDefinition,
            attempts: attempts + 1,
            refinements: 0,
            metadata: {
              generatedAt: new Date(),
              sessionId,
              description,
              preferences
            }
          }
        }

        this.logger.warn('Form validation failed, attempting refinement')

        const refinedDefinition = await this.performSelfRefinement(
          description,
          currentDefinition,
          /** @type {ValidationError[]} */ (validationResult.errors),
          sessionId
        )

        if (refinedDefinition) {
          return {
            success: true,
            formDefinition: refinedDefinition.formDefinition,
            attempts: attempts + 1,
            refinements: refinedDefinition.refinements,
            metadata: {
              generatedAt: new Date(),
              sessionId,
              description,
              preferences,
              originalErrors: validationResult.errors
            }
          }
        }

        attempts++
        lastError = new FormValidationError(
          'Validation failed after refinement',
          /** @type {ValidationError[]} */ (validationResult.errors)
        )
      } catch (error) {
        attempts++
        lastError = error instanceof Error ? error : new Error(String(error))
        this.logger.error('Form generation attempt failed', error)

        if (attempts >= this.maxRetries) {
          break
        }

        await this.delay(Math.pow(2, attempts) * 1000)
      }
    }

    throw new AIAgentError(
      `Failed to generate valid form after ${this.maxRetries} attempts`,
      attempts,
      lastError
    )
  }

  /**
   * Perform self-refinement using validation feedback
   * @param {string} originalDescription
   * @param {object} formDefinition
   * @param {ValidationError[]} validationErrors
   * @param {string} _sessionId
   * @returns {Promise<RefinementResult|null>}
   */
  async performSelfRefinement(
    originalDescription,
    formDefinition,
    validationErrors,
    _sessionId
  ) {
    let refinements = 0
    let currentDefinition = formDefinition

    while (refinements < this.maxSelfRefinements) {
      try {
        this.logger.info('Starting self-refinement')

        const refinementPrompt = this.buildRefinementPrompt(
          originalDescription,
          currentDefinition,
          validationErrors
        )

        const refinementResult = await this.formGenerator.generateForm(
          refinementPrompt,
          { refinementContext: 'self-refinement' }
        )

        currentDefinition = refinementResult.formDefinition

        const validationResult =
          this.validator.validateFormIntegrity(currentDefinition)

        if (validationResult.isValid) {
          this.logger.info('Self-refinement successful')

          return {
            formDefinition: currentDefinition,
            refinements: refinements + 1
          }
        }

        if (validationResult.errors.length >= validationErrors.length) {
          this.logger.warn('Refinement not improving validation')
        }

        validationErrors = /** @type {ValidationError[]} */ (
          validationResult.errors
        )
        refinements++
      } catch (error) {
        this.logger.error('Self-refinement failed', error)
        break
      }
    }

    this.logger.warn('Self-refinement exhausted without success')

    return null
  }

  /**
   * Build a refinement prompt that addresses validation errors
   * @param {string} originalDescription
   * @param {object} formDefinition
   * @param {ValidationError[]} validationErrors
   * @returns {string}
   */
  buildRefinementPrompt(originalDescription, formDefinition, validationErrors) {
    const errorSummary = this.summarizeValidationErrors(validationErrors)
    const suggestions = this.validator.generateFixSuggestions(validationErrors)

    return `
FORM REFINEMENT REQUEST

ORIGINAL REQUEST:
"${originalDescription}"

PREVIOUS FORM DEFINITION HAD THESE VALIDATION ERRORS:
${errorSummary}

SPECIFIC ISSUES TO FIX:
${suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}

PREVIOUS FORM DEFINITION:
${JSON.stringify(formDefinition, null, 2)}

Please generate a CORRECTED FormDefinitionV2 that:
1. Addresses ALL the validation errors listed above
2. Maintains the original intent and functionality
3. Follows all FormDefinitionV2 schema requirements
4. Ensures all references are valid and consistent

Generate ONLY the corrected JSON - no explanations.`
  }

  /**
   * Summarise validation errors for human-readable feedback
   * @param {ValidationError[]} validationErrors
   * @returns {string}
   */
  summarizeValidationErrors(validationErrors) {
    /** @type {Record<string, ValidationError[]>} */
    const errorsByType = {}

    for (const error of validationErrors) {
      errorsByType[error.type] ??= []
      errorsByType[error.type].push(error)
    }

    const summary = []
    for (const [type, errors] of Object.entries(errorsByType)) {
      summary.push(`${type.toUpperCase()}: ${errors.length} error(s)`)
      errors.slice(0, 3).forEach((/** @type {ValidationError} */ error) => {
        summary.push(`  - ${error.message}`)
      })
      if (errors.length > 3) {
        summary.push(`  - ... and ${errors.length - 3} more`)
      }
    }

    return summary.join('\n')
  }

  /**
   * Simple delay utility for backoff
   * @param {number} ms
   */
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get agent status and statistics
   */
  getStatus() {
    return {
      maxRetries: this.maxRetries,
      maxSelfRefinements: this.maxSelfRefinements,
      isHealthy: true
    }
  }
}

/**
 * @import { FormGeneratorService } from '~/src/services/ai/form-generator.js'
 * @import { AIFormValidator } from '~/src/services/ai/form-validator.js'
 * @import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
 */
