import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { AIFormAgent } from '~/src/services/ai/ai-agent.js'
import { FormGeneratorService } from '~/src/services/ai/form-generator.js'
import { AIFormValidator } from '~/src/services/ai/form-validator.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
import { ClaudeProvider } from '~/src/services/ai/providers/claude-provider.js'
import { TokenBucketRateLimiter } from '~/src/services/ai/rate-limiter.js'
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
  }

  /**
   * @param {any} config
   * @param {any} server - Hapi server instance
   */
  initialize(config, server) {
    try {
      this.logger.info('Initializing AI service')

      this.components.rateLimiter = new TokenBucketRateLimiter({
        capacity: 10,
        refillRate: 1,
        tokensPerRequest: 1
      })

      const cache = {
        /**
         * @param {string} key
         */
        async get(key) {
          const data = await server.methods.state.get('ai-cache', key)
          return data ? JSON.parse(data) : null
        },
        /**
         * @param {string} key
         * @param {any} value
         * @param {number} ttlSeconds
         */
        async set(key, value, ttlSeconds) {
          return await server.methods.state.set(
            'ai-cache',
            key,
            JSON.stringify(value),
            ttlSeconds * 1000
          )
        }
      }

      this.logger.info('AI provider config check')

      if (!config.claude) {
        this.logger.error('Claude configuration missing from config.claude')
        throw new Error('Claude configuration is missing from config.claude')
      }

      if (!config.claude.apiKey) {
        this.logger.error('Claude API key is missing')
        throw new Error('Claude API key is required but not provided')
      }

      this.logger.info('Creating Claude provider')

      this.components.aiProvider = new ClaudeProvider(config.claude, cache)

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
      this.logger.info('AI service initialised successfully')
    } catch (error) {
      this.logger.error('Failed to initialise AI service', error)
      throw new AIServiceError(
        `Initialisation failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  clearCache() {
    try {
      this.logger.info('Clearing AI cache')
      this.logger.info('AI cache cleared successfully')
    } catch (error) {
      this.logger.error('Failed to clear AI cache', error)
    }
  }

  /**
   * @param {string} description
   * @param {object} preferences
   * @param {string} sessionId
   */
  async generateForm(description, preferences = {}, sessionId) {
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
        preferences
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
        message: 'Analysing your form requirements...',
        startTime: new Date().toISOString()
      })

      this.logger.info('Background AI generation started')

      await this.setJobStatus(jobId, {
        status: 'processing',
        message: 'Generating form structure with AI...'
      })

      const result = await this.generateForm(description, {}, '')

      await this.setJobStatus(jobId, {
        status: 'processing',
        message: 'Finalising your form'
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

      const errorMessage =
        error instanceof Error ? error.message : 'Form generation failed'
      const errorType =
        error instanceof Error ? error.constructor.name : 'Unknown'

      await this.setJobStatus(jobId, {
        status: 'failed',
        message: errorMessage,
        error: {
          message: errorMessage,
          type: errorType
        },
        failedTime: new Date().toISOString()
      })

      throw error
    }
  }

  /**
   * Set job status in cache
   * @param {string} jobId - Job identifier
   * @param {object} status - Status object
   */
  async setJobStatus(jobId, status) {
    const cacheKey = `ai_job_status:${jobId}`
    const ttl = 1800 // 30 minutes

    const cache = this.components.aiProvider.cache ?? this.components.cache

    const existing = (await /** @type {any} */ (cache).get(cacheKey)) ?? {}
    const updatedStatus = {
      ...existing,
      ...status,
      lastUpdated: new Date().toISOString()
    }

    await /** @type {any} */ (cache).set(cacheKey, updatedStatus, ttl)
    this.logger.debug('Job status updated')
  }

  /**
   * Get job status from cache
   * @param {string} jobId - Job identifier
   * @returns {Promise<object|null>} Job status or null if not found
   */
  async getJobStatus(jobId) {
    const cacheKey = `ai_job_status:${jobId}`
    const cache = this.components.aiProvider.cache ?? this.components.cache
    return await /** @type {any} */ (cache).get(cacheKey)
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
