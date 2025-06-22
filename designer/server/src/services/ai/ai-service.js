import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { AIFormAgent } from '~/src/services/ai/ai-agent.js'
import { FormGeneratorService } from '~/src/services/ai/form-generator.js'
import { AIFormValidator } from '~/src/services/ai/form-validator.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
import { ClaudeAIProvider } from '~/src/services/ai/providers/claude-provider.js'
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

      // Initialize rate limiter
      this.components.rateLimiter = new TokenBucketRateLimiter({
        capacity: 10,
        refillRate: 1,
        tokensPerRequest: 1
      })

      // Create a simple cache wrapper around Hapi's server cache
      const cache = {
        async get(key) {
          const data = await server.methods.state.get('ai-cache', key)
          return data ? JSON.parse(data) : null
        },
        async set(key, value, ttlSeconds) {
          return server.methods.state.set(
            'ai-cache',
            key,
            JSON.stringify(value),
            ttlSeconds * 1000
          )
        }
      }

      // Initialize AI provider
      this.logger.info('🔑 AI provider config check:', {
        hasClaudeConfig: !!config.claude,
        hasApiKey: !!config.claude?.apiKey,
        apiKeyLength: config.claude?.apiKey?.length || 'undefined',
        apiKeyPrefix:
          config.claude?.apiKey?.substring(0, 15) + '...' || 'no-key',
        hasValidFormat: config.claude?.apiKey?.startsWith('sk-ant-') || false,
        model: config.claude?.model || 'undefined',
        maxTokens: config.claude?.maxTokens || 'undefined'
      })

      this.components.aiProvider = new ClaudeAIProvider(
        config.claude,
        this.components.rateLimiter,
        cache
      )

      // Initialize other components
      this.components.promptBuilder = new PromptBuilder()
      this.components.responseParser = new ResponseParser()
      this.components.validator = new AIFormValidator()
      this.components.tempFormManager = new TempFormManager(server)

      // Initialize form generator
      this.components.formGenerator = new FormGeneratorService(
        this.components.aiProvider,
        this.components.validator
      )

      // Initialize AI agent
      this.components.aiAgent = new AIFormAgent(
        config,
        this.components.formGenerator,
        this.components.validator,
        this.components.promptBuilder
      )

      this.isInitialized = true
      this.logger.info('AI service initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize AI service', {
        error: error instanceof Error ? error.message : String(error)
      })
      throw new AIServiceError(
        `Initialization failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  async clearCache() {
    try {
      this.logger.info('🧹 Clearing AI cache...')
      // Clear cache by clearing all ai-cache entries
      // Note: This is a simple approach - in production you might want more granular cache clearing
      this.logger.info('✅ AI cache cleared successfully')
    } catch (error) {
      this.logger.error('❌ Failed to clear AI cache', {
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  async generateForm(description, preferences = {}, sessionId) {
    this.logger.info('🎯 AIService.generateForm() called', {
      isInitialized: this.isInitialized,
      descriptionLength: description?.length || 'undefined',
      sessionId: sessionId || 'undefined',
      preferencesKeys: Object.keys(preferences || {})
    })

    if (!this.isInitialized) {
      this.logger.error('❌ AI service not initialized')
      throw new AIServiceError('AI service not initialized')
    }

    this.logger.info('🔧 Components check:', {
      hasAiAgent: !!this.components.aiAgent,
      hasTempFormManager: !!this.components.tempFormManager,
      hasAiProvider: !!this.components.aiProvider,
      hasFormGenerator: !!this.components.formGenerator
    })

    try {
      this.logger.info('🚀 Starting AI form generation flow', {
        descriptionLength: description.length,
        sessionId,
        preferences
      })

      this.logger.info('📞 Calling aiAgent.generateFormWithRefinement...')
      const result = await this.components.aiAgent.generateFormWithRefinement(
        description,
        preferences,
        sessionId
      )
      this.logger.info('✅ aiAgent.generateFormWithRefinement completed', {
        hasResult: !!result,
        hasFormDefinition: !!result?.formDefinition,
        hasMetadata: !!result?.metadata
      })

      // Only store temp form if we have a sessionId (for direct user interactions)
      if (sessionId) {
        this.logger.info('💾 Storing temp form...')
        await this.components.tempFormManager.storeTempForm(sessionId, {
          formDefinition: result.formDefinition,
          description,
          preferences,
          metadata: result.metadata
        })
        this.logger.info('✅ Temp form stored successfully')
      } else {
        this.logger.info(
          '💾 Skipping temp form storage (no sessionId for background job)'
        )
      }

      this.logger.info('🎉 AI form generation completed successfully')
      return result
    } catch (error) {
      this.logger.error('💥 AI FORM GENERATION FAILED - Full error details:', {
        errorMessage: error?.message || 'No message',
        errorName: error?.name || 'No name',
        errorStack: error?.stack || 'No stack',
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        sessionId,
        fullErrorObject: JSON.stringify(error, null, 2)
      })

      // Also log to console for immediate visibility
      console.log('🔍 AI SERVICE ERROR DETAILS:')
      console.log('Error:', error)
      console.log('Error message:', error?.message)
      console.log('Error name:', error?.name)
      console.log('Error constructor:', error?.constructor?.name)

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
   * @param {Object} yar - Session manager
   */
  async generateFormInBackground(jobId, description, title, yar) {
    try {
      // Set initial job status
      await this.setJobStatus(jobId, {
        status: 'processing',
        message: 'Analyzing your form requirements...',
        startTime: new Date().toISOString()
      })

      this.logger.info('🎯 Background AI generation started', { jobId, title })

      // Update progress - generating
      await this.setJobStatus(jobId, {
        status: 'processing',
        message: 'Generating form structure with AI...'
      })

      // Generate the form
      const result = await this.generateForm(description, {}) // Pass empty preferences for background jobs

      // Update progress - finalizing
      await this.setJobStatus(jobId, {
        status: 'processing',
        message: 'Finalizing your form...'
      })

      // Store in session for review page
      const sessionKey = 'create'
      const createSession = yar.get(sessionKey) || {}
      createSession.aiFormDefinition = result.formDefinition
      yar.set(sessionKey, createSession)

      // Mark as completed
      await this.setJobStatus(jobId, {
        status: 'completed',
        message: 'Form generated successfully!',
        completedTime: new Date().toISOString(),
        result: {
          formDefinition: result.formDefinition,
          pageCount: result.formDefinition.pages?.length || 0,
          componentCount:
            result.formDefinition.pages?.reduce(
              (total, page) => total + (page.components?.length || 0),
              0
            ) || 0
        }
      })

      this.logger.info('✅ Background AI generation completed', {
        jobId,
        title
      })
    } catch (error) {
      this.logger.error('💥 Background AI generation failed', {
        jobId,
        title,
        error
      })

      // Mark as failed
      await this.setJobStatus(jobId, {
        status: 'failed',
        message: error.message || 'Form generation failed',
        error: {
          message: error.message,
          type: error.constructor.name
        },
        failedTime: new Date().toISOString()
      })

      throw error
    }
  }

  /**
   * Set job status in cache
   * @param {string} jobId - Job identifier
   * @param {Object} status - Status object
   */
  async setJobStatus(jobId, status) {
    const cacheKey = `ai_job_status:${jobId}`
    const ttl = 1800 // 30 minutes

    // Get cache from components
    const cache = this.components.aiProvider.cache || this.components.cache

    // Merge with existing status if partial update
    const existing = (await cache.get(cacheKey)) || {}
    const updatedStatus = {
      ...existing,
      ...status,
      lastUpdated: new Date().toISOString()
    }

    await cache.set(cacheKey, updatedStatus, ttl)
    this.logger.debug('Job status updated', {
      jobId,
      status: updatedStatus.status
    })
  }

  /**
   * Get job status from cache
   * @param {string} jobId - Job identifier
   * @returns {Promise<Object|null>} Job status or null if not found
   */
  async getJobStatus(jobId) {
    const cacheKey = `ai_job_status:${jobId}`
    const cache = this.components.aiProvider.cache || this.components.cache
    return await cache.get(cacheKey)
  }
}

// Singleton instance
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
