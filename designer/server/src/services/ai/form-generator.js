import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
import {
  ResponseParser,
  ParseError,
  ValidationError
} from '~/src/services/ai/response-parser.js'
import { AIProviderError } from '~/src/services/ai/providers/claude-provider.js'

const logger = createLogger()

export class FormGenerationError extends Error {
  /**
   * @param {string} message
   * @param {Error} cause
   */
  constructor(message, cause = null) {
    super(message)
    this.name = 'FormGenerationError'
    this.cause = cause
  }
}

export class FormGeneratorService {
  /**
   * @param {Object} aiProvider
   * @param {Object} validator
   */
  constructor(aiProvider, validator) {
    this.aiProvider = aiProvider
    this.validator = validator
    this.promptBuilder = new PromptBuilder()
    this.responseParser = new ResponseParser()
    this.maxRetries = 3
  }

  /**
   * @param {string} description
   * @param {Object} preferences
   */
  async generateForm(description, preferences = {}) {
    logger.info('🎬 FormGeneratorService.generateForm() started', {
      descriptionLength: description?.length || 'undefined',
      preferencesKeys: Object.keys(preferences || {}),
      maxRetries: this.maxRetries
    })

    let lastError = null

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info(`🔄 Form generation attempt ${attempt}`, {
          description: description.substring(0, 100) + '...',
          preferences,
          isRetry: attempt > 1
        })

        // Build prompt with error context if retrying
        logger.info('🏗️  Building prompt...')
        let prompt
        if (attempt === 1) {
          prompt = this.promptBuilder.buildFormGenerationPrompt(
            description,
            preferences
          )
        } else {
          // Include detailed validation errors for refinement
          const errorDetails = lastError.details
            ? lastError.details
                .map((d) => `- ${d.path?.join('.') || 'unknown'}: ${d.message}`)
                .join('\n')
            : lastError.message

          console.log(
            '🔧 REFINEMENT ATTEMPT - Adding error context:',
            errorDetails
          )

          prompt =
            this.promptBuilder.buildFormGenerationPrompt(
              description,
              preferences
            ) +
            `\n\nIMPORTANT: The previous attempt failed validation. Fix these specific errors:\n${errorDetails}\n\nPay special attention to UUID format requirements - ALL "id" fields must be proper UUIDs like "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d", not descriptive names.`
        }

        logger.info('✅ Prompt built successfully', {
          promptLength: prompt?.length || 'undefined',
          hasPrompt: !!prompt
        })

        // Generate with AI
        logger.info('🤖 Calling AI provider...')
        const startTime = Date.now()
        const aiResponse = await this.aiProvider.generate(prompt)
        const duration = Date.now() - startTime

        logger.info('✅ AI provider responded', {
          duration: `${duration}ms`,
          hasResponse: !!aiResponse,
          hasContent: !!aiResponse?.content,
          contentLength: aiResponse?.content?.length || 'undefined'
        })

        // Debug: Log the AI response content
        console.log('🤖 AI RESPONSE DEBUG:')
        console.log('Response object:', aiResponse)
        console.log('Response content:', aiResponse?.content)
        console.log('Content type:', typeof aiResponse?.content)
        console.log('================')

        // Parse and validate
        logger.info('📝 Parsing form definition...')
        const formDefinition = this.responseParser.parseFormDefinition(
          aiResponse.content
        )
        logger.info('✅ Form definition parsed', {
          hasFormDefinition: !!formDefinition,
          pageCount: formDefinition?.pages?.length || 'undefined'
        })

        // Additional custom validation
        const customValidation =
          await this.validator.validateFormIntegrity(formDefinition)
        if (!customValidation.isValid) {
          throw new ValidationError(
            'Form integrity validation failed',
            customValidation.errors
          )
        }

        const summary = this.responseParser.extractFormSummary(formDefinition)

        logger.info('Form generation successful', {
          attempt,
          summary,
          tokensUsed: aiResponse.usage
        })

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
        logger.warn(`Form generation attempt ${attempt} failed`, {
          error: error.message,
          type: error.constructor.name
        })

        if (attempt === this.maxRetries) {
          break
        }

        // Don't retry certain types of errors
        if (error instanceof AIProviderError && error.statusCode === 429) {
          // Rate limit - don't retry immediately
          break
        }
      }
    }

    logger.error('Form generation failed after all attempts', {
      maxRetries: this.maxRetries,
      lastError: lastError?.message
    })

    throw new FormGenerationError(
      `Failed to generate valid form after ${this.maxRetries} attempts: ${lastError?.message}`,
      lastError
    )
  }

  /**
   * @param {string} originalDescription
   * @param {string} feedback
   * @param {Object} previousDefinition
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
        await this.validator.validateFormIntegrity(formDefinition)
      if (!customValidation.isValid) {
        throw new ValidationError(
          'Regenerated form integrity validation failed',
          customValidation.errors
        )
      }

      const summary = this.responseParser.extractFormSummary(formDefinition)

      logger.info('Form regeneration successful', { summary })

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
      logger.error('Form regeneration failed', { error: error.message })
      throw new FormGenerationError(
        `Failed to regenerate form: ${error.message}`,
        error
      )
    }
  }
}
