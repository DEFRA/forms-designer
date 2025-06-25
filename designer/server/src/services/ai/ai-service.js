import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { AIFormAgent } from '~/src/services/ai/ai-agent.js'
import { FormGeneratorService } from '~/src/services/ai/form-generator.js'
import { AIFormValidator } from '~/src/services/ai/form-validator.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
import { ClaudeProvider } from '~/src/services/ai/providers/claude-provider.js'
import { ResponseParser } from '~/src/services/ai/response-parser.js'
import { TempFormManager } from '~/src/services/session/temp-form-manager.js'

export class AIServiceError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode = 500) {
    super(message)
    this.name = 'AIServiceError'
    this.statusCode = statusCode
  }
}

export class AIService {
  constructor() {
    this.isInitialized = false
    /** @type {any} */
    this.components = {}
    this.logger = createLogger()
    /** @type {any} */
    this.server = null
  }

  /**
   * @param {any} config
   * @param {any} server - Hapi server instance
   */
  initialize(config, server) {
    try {
      this.server = server

      if (!config.claude) {
        this.logger.error('Claude configuration missing from config.claude')
        throw new Error('Claude configuration is missing from config.claude')
      }

      if (!config.claude.apiKey) {
        this.logger.error('Claude API key is missing')
        throw new Error('Claude API key is required but not provided')
      }

      this.components.aiProvider = new ClaudeProvider(config.claude, null)

      this.components.promptBuilder = new PromptBuilder()
      this.components.responseParser = new ResponseParser()
      this.components.validator = new AIFormValidator()
      this.components.tempFormManager = new TempFormManager(server)

      this.components.formGenerator = new FormGeneratorService(
        this.components.aiProvider,
        this.components.validator
      )

      this.components.aiAgent = new AIFormAgent(
        config,
        this.components.formGenerator,
        this.components.validator,
        this.components.promptBuilder
      )

      this.isInitialized = true
    } catch (error) {
      this.logger.error('Failed to initialise AI service', error)
      throw new AIServiceError(
        `Initialisation failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * @param {string} description
   * @param {object} preferences
   * @param {string} sessionId
   * @param {Function} [updateProgress] - Optional progress callback
   */
  async generateForm(description, preferences = {}, sessionId, updateProgress) {
    if (!this.isInitialized) {
      this.logger.error('AI service not initialised')
      throw new AIServiceError('AI service not initialised')
    }
    this.logger.info('Starting AI form generation flow')

    try {
      const result = await this.components.formGenerator.generateForm(
        description,
        preferences,
        updateProgress
      )
      this.logger.info('Agentic form generation completed')

      if (sessionId) {
        this.logger.info('Storing temp form')
        await this.components.tempFormManager.storeTempForm(sessionId, {
          formDefinition: result.formDefinition,
          description,
          preferences,
          metadata: result.metadata
        })
        this.logger.info('Temp form stored successfully')
      } else {
        this.logger.info(
          'Skipping temp form storage (no sessionId for background job)'
        )
      }

      this.logger.info('AI form generation completed successfully')
      return result
    } catch (error) {
      this.logger.error('AI form generation failed', error)

      throw new AIServiceError(
        `Form generation failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Regenerate form in background with feedback and context
   * @param {string} jobId - Unique job identifier
   * @param {string} originalDescription - Original form description
   * @param {string} feedback - User feedback for regeneration
   * @param {object} currentFormDefinition - Current form definition
   * @param {string} title - Form title
   * @param {Yar} yar - Session manager
   * @param {string} [userId] - User ID for usage tracking
   */
  async regenerateFormInBackground(
    jobId,
    originalDescription,
    feedback,
    currentFormDefinition,
    title,
    yar,
    userId
  ) {
    const regenerationPrompt =
      this.components.promptBuilder.buildRegenerationPrompt(
        originalDescription,
        feedback,
        currentFormDefinition
      )

    return this._runFormGenerationJob(
      jobId,
      regenerationPrompt,
      title,
      yar,
      userId,
      {
        startMessage: 'Starting form regeneration with your feedback...',
        completedMessage:
          'Form regenerated successfully based on your feedback!',
        errorType: 'regeneration_error',
        defaultErrorMessage:
          'We encountered an issue while applying your feedback. Please try again with different feedback or contact support if the problem persists.',
        loggerContext: 'regeneration',
        progressMapping: {
          analysis: 'Analysing your feedback and current form...',
          generation: 'Applying your feedback to improve the form...',
          processing: 'Processing and validating changes...',
          refinement: 'Refining form based on your feedback...',
          finalising: 'Finalising your improved form...'
        }
      }
    )
  }

  /**
   * Shared background job logic for both generation and regeneration
   * @param {string} jobId - Unique job identifier
   * @param {string} description - Form description or regeneration prompt
   * @param {string} title - Form title
   * @param {Yar} yar - Session manager
   * @param {string} [userId] - User ID for usage tracking
   * @param {object} [options] - Customization options
   */
  async _runFormGenerationJob(
    jobId,
    description,
    title,
    yar,
    userId,
    options = {}
  ) {
    const startMessage =
      /** @type {any} */ (options).startMessage ?? 'Starting form generation...'
    const completedMessage =
      /** @type {any} */ (options).completedMessage ??
      'Form generated successfully!'
    const errorType =
      /** @type {any} */ (options).errorType ?? 'generation_error'
    const defaultErrorMessage =
      /** @type {any} */ (options).defaultErrorMessage ??
      'We encountered an issue while generating your form. Please try again with a simpler description or contact support if the problem persists.'
    const loggerContext =
      /** @type {any} */ (options).loggerContext ?? 'generation'
    const progressMapping = /** @type {any} */ (options).progressMapping ?? {
      ai_generation: 'Creating your form with AI...',
      analysis: 'Analysing your form requirements...',
      design: 'Designing form structure and pages...',
      lists: 'Creating dropdown and selection lists...',
      components: 'Adding form fields and components...',
      validation: 'Validating form logic and flow...',
      refinement: 'Refining form structure and validation...',
      finalising: 'Finalising and validating your form...'
    }

    try {
      await this.setJobStatus(jobId, {
        status: 'processing',
        message: startMessage,
        startTime: new Date().toISOString(),
        step: 'starting'
      })

      this.logger.info(`Background AI ${loggerContext} started`)

      const updateProgress = async (
        /** @type {string} */ step,
        /** @type {string} */ message,
        /** @type {object} */ details = {}
      ) => {
        const displayMessage = progressMapping[step] ?? message
        const progressStep = step === 'ai_generation' ? 'generation' : step

        await this.setJobStatus(jobId, {
          status: 'processing',
          message: displayMessage,
          step: progressStep,
          ...details
        })
      }

      const result = await this.generateForm(
        description,
        {},
        '',
        updateProgress
      )

      await this.setJobStatus(jobId, {
        status: 'processing',
        message: progressMapping.finalising,
        step: 'finalising'
      })

      const sessionKey = 'create'
      const createSession = yar.get(sessionKey) ?? {}
      createSession.aiFormDefinition = result.formDefinition
      yar.set(sessionKey, createSession)

      await this.setJobStatus(jobId, {
        status: 'completed',
        message: completedMessage,
        completedTime: new Date().toISOString(),
        result: {
          formDefinition: result.formDefinition,
          pageCount: result.formDefinition.pages?.length ?? 0,
          componentCount:
            result.formDefinition.pages?.reduce(
              (/** @type {number} */ total, /** @type {any} */ page) => {
                const componentLength = page.components?.length ?? 0
                return total + Number(componentLength)
              },
              0
            ) ?? 0
        }
      })

      this.logger.info(`Background AI ${loggerContext} completed`)

      if (userId) {
        this.logger.info(
          `AI usage for user ${userId} - Form ${loggerContext} completed`
        )
      }
    } catch (/** @type {any} */ error) {
      this.logger.error(`Background AI ${loggerContext} failed`, error)

      let userMessage = defaultErrorMessage

      if (error instanceof Error) {
        if (
          error.message.includes(
            'too complex or contain conflicting constraints'
          )
        ) {
          userMessage =
            'Your form description appears to be too complex. Please try breaking it down into simpler requirements or contact support for assistance.'
        } else if (
          error.message.includes('conversation turns') ||
          error.message.includes('refinement')
        ) {
          userMessage =
            'The form generation took longer than expected. Please try again with a more specific description.'
        } else if (
          error.message.includes('API') ||
          error.message.includes('network')
        ) {
          userMessage =
            'There was a temporary connection issue. Please try again in a few moments.'
        } else if (
          error.message.includes('validation') ||
          error.message.includes('GDS')
        ) {
          userMessage =
            'We had trouble creating a form that meets government standards. Please try again with clearer requirements.'
        }
      }

      await this.setJobStatus(jobId, {
        status: 'failed',
        message: userMessage,
        error: {
          message: userMessage,
          type: errorType
        },
        failedTime: new Date().toISOString()
      })

      throw error
    }
  }

  /**
   * Generate form in background as a job
   * @param {string} jobId - Unique job identifier
   * @param {string} description - Form description
   * @param {string} title - Form title
   * @param {Yar} yar - Session manager
   * @param {string} [userId] - User ID for usage tracking
   */
  async generateFormInBackground(jobId, description, title, yar, userId) {
    return this._runFormGenerationJob(jobId, description, title, yar, userId)
  }

  /**
   * Set job status in cache
   * @param {string} jobId - Job identifier
   * @param {object} status - Status object
   */
  async setJobStatus(jobId, status) {
    const cacheKey = `ai_job_status:${jobId}`
    const ttl = 1800 // 30 minutes

    const existingString = await this.server.methods.state.get(
      'ai-cache',
      cacheKey
    )
    const parsedExisting = existingString ? JSON.parse(existingString) : {}
    const updatedStatus = {
      ...parsedExisting,
      ...status,
      lastUpdated: new Date().toISOString()
    }

    await this.server.methods.state.set(
      'ai-cache',
      cacheKey,
      JSON.stringify(updatedStatus),
      ttl * 1000
    )
    this.logger.debug('Job status updated')
  }

  /**
   * Get job status from cache
   * @param {string} jobId - Job identifier
   * @returns {Promise<object|null>} Job status or null if not found
   */
  async getJobStatus(jobId) {
    const cacheKey = `ai_job_status:${jobId}`
    const data = await this.server.methods.state.get('ai-cache', cacheKey)
    return data ? JSON.parse(data) : null
  }
}

/** @type {AIService | null} */
let aiServiceInstance = null

/**
 * @param {any} config
 * @param {any} server
 * @returns {AIService}
 */
export function getAIService(config, server) {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService()
    aiServiceInstance.initialize(config, server)
  }

  return aiServiceInstance
}

/**
 * @import { Yar } from '@hapi/yar'
 */
