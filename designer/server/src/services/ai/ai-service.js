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
    this.logger.info('AIService.generateForm() called')

    if (!this.isInitialized) {
      this.logger.error('AI service not initialised')
      throw new AIServiceError('AI service not initialised')
    }

    this.logger.info('Components check')

    try {
      this.logger.info('Starting AI form generation flow')

      this.logger.info('Calling agentic form generator directly')
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
   * Generate form in background as a job
   * @param {string} jobId - Unique job identifier
   * @param {string} description - Form description
   * @param {string} title - Form title
   * @param {Yar} yar - Session manager
   * @param {string} [userId] - User ID for usage tracking
   */
  async generateFormInBackground(jobId, description, title, yar, userId) {
    try {
      await this.setJobStatus(jobId, {
        status: 'processing',
        message: 'Starting form generation...',
        startTime: new Date().toISOString(),
        step: 'starting'
      })

      this.logger.info('Background AI generation started')

      // Create progress callback that tracks real AI workflow steps
      const updateProgress = async (
        /** @type {string} */ step,
        /** @type {string} */ message,
        /** @type {object} */ details = {}
      ) => {
        // Map AI workflow steps to user-friendly progress
        let displayMessage = message
        let progressStep = step

        if (step === 'ai_generation') {
          displayMessage = 'Creating your form with AI...'
          progressStep = 'generation'
        } else if (step === 'analysis') {
          displayMessage = 'Analysing your form requirements...'
          progressStep = 'analysis'
        } else if (step === 'design') {
          displayMessage = 'Designing form structure and pages...'
          progressStep = 'design'
        } else if (step === 'lists') {
          displayMessage = 'Creating dropdown and selection lists...'
          progressStep = 'lists'
        } else if (step === 'components') {
          displayMessage = 'Adding form fields and components...'
          progressStep = 'components'
        } else if (step === 'validation') {
          displayMessage = 'Validating form logic and flow...'
          progressStep = 'validation'
        } else if (step === 'refinement') {
          displayMessage = 'Refining form structure and validation...'
          progressStep = 'refinement'
        } else if (step === 'finalising') {
          displayMessage = 'Finalising and validating your form...'
          progressStep = 'finalising'
        }

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
        message: 'Finalising your form...',
        step: 'finalising'
      })

      const sessionKey = 'create'
      const createSession = yar.get(sessionKey) ?? {}
      createSession.aiFormDefinition = result.formDefinition
      yar.set(sessionKey, createSession)

      await this.setJobStatus(jobId, {
        status: 'completed',
        message: 'Form generated successfully!',
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

      this.logger.info('Background AI generation completed')

      if (userId) {
        this.logger.info(
          `AI usage for user ${userId} - Form generation completed`
        )
      }
    } catch (error) {
      this.logger.error('Background AI generation failed', error)

      // Create user-friendly error message
      let userMessage =
        'We encountered an issue while generating your form. Please try again with a simpler description or contact support if the problem persists.'

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
          type: 'generation_error'
        },
        failedTime: new Date().toISOString()
      })

      throw error
    }
  }

  /**
   * Set job status in cache (using Hapi cache with Redis backend)
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
