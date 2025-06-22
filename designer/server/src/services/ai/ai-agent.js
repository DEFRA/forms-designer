import { createLogger } from '~/src/common/helpers/logging/logger.js'
import {
  FormGeneratorService,
  FormGenerationError
} from '~/src/services/ai/form-generator.js'
import {
  AIFormValidator,
  FormValidationError
} from '~/src/services/ai/form-validator.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'

const logger = createLogger()

export class AIAgentError extends Error {
  constructor(message, attempts = 0, lastError = null) {
    super(message)
    this.name = 'AIAgentError'
    this.attempts = attempts
    this.lastError = lastError
  }
}

export class AIFormAgent {
  /**
   * @param {Object} config
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
   * @param {Object} preferences
   * @param {string} sessionId
   * @returns {Promise<Object>}
   */
  async generateFormWithRefinement(description, preferences = {}, sessionId) {
    let attempts = 0
    let lastError = null
    let currentDefinition = null

    while (attempts < this.maxRetries) {
      try {
        this.logger.info('Starting form generation attempt', {
          attempt: attempts + 1,
          maxRetries: this.maxRetries,
          sessionId
        })

        // Generate initial form
        const generationResult = await this.formGenerator.generateForm(
          description,
          preferences,
          sessionId
        )

        currentDefinition = generationResult.formDefinition

        // Validate the generated form
        const validationResult =
          await this.validator.validateFormIntegrity(currentDefinition)

        if (validationResult.isValid) {
          this.logger.info('Form generation successful', {
            attempt: attempts + 1,
            sessionId,
            pageCount: currentDefinition.pages?.length ?? 0
          })

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

        // If validation failed, attempt self-refinement
        this.logger.warn('Form validation failed, attempting refinement', {
          attempt: attempts + 1,
          errorCount: validationResult.errors.length,
          sessionId
        })

        const refinedDefinition = await this.performSelfRefinement(
          description,
          currentDefinition,
          validationResult.errors,
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
          validationResult.errors
        )
      } catch (error) {
        attempts++
        lastError = error
        this.logger.error('Form generation attempt failed', {
          attempt: attempts,
          error: error.message,
          sessionId
        })

        if (attempts >= this.maxRetries) {
          break
        }

        // Exponential backoff before retry
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
   * @param {Object} formDefinition
   * @param {Array} validationErrors
   * @param {string} sessionId
   * @returns {Promise<Object|null>}
   */
  async performSelfRefinement(
    originalDescription,
    formDefinition,
    validationErrors,
    sessionId
  ) {
    let refinements = 0
    let currentDefinition = formDefinition

    while (refinements < this.maxSelfRefinements) {
      try {
        this.logger.info('Starting self-refinement', {
          refinement: refinements + 1,
          maxRefinements: this.maxSelfRefinements,
          errorCount: validationErrors.length,
          sessionId
        })

        // Build refinement prompt with validation feedback
        const refinementPrompt = this.buildRefinementPrompt(
          originalDescription,
          currentDefinition,
          validationErrors
        )

        // Generate refined form
        const refinementResult = await this.formGenerator.generateForm(
          refinementPrompt,
          { isRefinement: true },
          sessionId
        )

        currentDefinition = refinementResult.formDefinition

        // Validate refined form
        const validationResult =
          await this.validator.validateFormIntegrity(currentDefinition)

        if (validationResult.isValid) {
          this.logger.info('Self-refinement successful', {
            refinements: refinements + 1,
            sessionId
          })

          return {
            formDefinition: currentDefinition,
            refinements: refinements + 1
          }
        }

        // Check if we're making progress (fewer errors)
        if (validationResult.errors.length >= validationErrors.length) {
          this.logger.warn('Refinement not improving validation', {
            previousErrors: validationErrors.length,
            currentErrors: validationResult.errors.length,
            refinement: refinements + 1,
            sessionId
          })
        }

        validationErrors = validationResult.errors
        refinements++
      } catch (error) {
        this.logger.error('Self-refinement failed', {
          refinement: refinements + 1,
          error: error.message,
          sessionId
        })
        break
      }
    }

    this.logger.warn('Self-refinement exhausted without success', {
      maxRefinements: this.maxSelfRefinements,
      sessionId
    })

    return null
  }

  /**
   * Build a refinement prompt that addresses validation errors
   * @param {string} originalDescription
   * @param {Object} formDefinition
   * @param {Array} validationErrors
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
   * Summarize validation errors for human-readable feedback
   * @param {Array} validationErrors
   * @returns {string}
   */
  summarizeValidationErrors(validationErrors) {
    const errorsByType = {}

    for (const error of validationErrors) {
      if (!errorsByType[error.type]) {
        errorsByType[error.type] = []
      }
      errorsByType[error.type].push(error)
    }

    const summary = []
    for (const [type, errors] of Object.entries(errorsByType)) {
      summary.push(`${type.toUpperCase()}: ${errors.length} error(s)`)
      errors.slice(0, 3).forEach((error) => {
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
