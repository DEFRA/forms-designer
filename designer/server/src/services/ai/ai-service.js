import { createLogger } from '~/src/common/helpers/logging/logger.js'
// import { AIFormAgent } from '~/src/services/ai/ai-agent.js' // Not used - ClaudeProviderV2 always uses direct generation
import { FormGeneratorService } from '~/src/services/ai/form-generator.js'
import { AIFormValidator } from '~/src/services/ai/form-validator.js'
import { PromptBuilder } from '~/src/services/ai/prompt-builder.js'
import { ClaudeProviderV2 } from '~/src/services/ai/providers/claude-provider-v2.js'
import { ClaudeProvider } from '~/src/services/ai/providers/claude-provider.js'
// import { ResponseParser } from '~/src/services/ai/response-parser.js' // Not used - ClaudeProviderV2 uses ResponseProcessor instead
import { ResponseProcessor } from '~/src/services/ai/response-processor.js'
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

      this.components.aiProvider = new ClaudeProviderV2(config.claude)

      const evaluationConfig = {
        ...config.claude,
        model: config.claude.evaluationModel ?? 'claude-3-5-haiku-latest'
      }
      this.components.evaluationProvider = new ClaudeProvider(
        evaluationConfig,
        null
      )

      this.components.promptBuilder = new PromptBuilder()
      // this.components.responseParser = new ResponseParser() // Not used - ClaudeProviderV2 uses ResponseProcessor instead
      this.components.responseProcessor = new ResponseProcessor()
      this.components.validator = new AIFormValidator()
      this.components.tempFormManager = new TempFormManager(server)

      this.components.formGenerator = new FormGeneratorService(
        this.components.aiProvider,
        this.components.validator
      )

      // this.components.aiAgent = new AIFormAgent(
      //   config,
      //   this.components.formGenerator,
      //   this.components.validator,
      //   this.components.promptBuilder
      // ) // Not used - ClaudeProviderV2 always uses direct generation

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
      complexity_warning:
        'Complex form detected - proceeding with generation...',
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

        const statusUpdate = {
          status: 'processing',
          message: displayMessage,
          step: progressStep,
          ...details
        }

        // Debug logging for complexity warnings
        if (step === 'complexity_warning') {
          this.logger.info('📤 Storing complexity warning in job status')
        }

        await this.setJobStatus(jobId, statusUpdate)
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
        } else if (
          error.message.includes('exceeds the maximum complexity') ||
          error.message.includes('32,000 output tokens') ||
          error.message.includes('Breaking your form into smaller sections')
        ) {
          userMessage = error.message // Use the detailed error message from pre-validation (legacy)
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
   * Analyze form description against GDS guidelines and provide feedback
   * @param {string} description - Form description to analyze
   * @returns {Promise<{isGood: boolean, feedback: Array<{issue: string, suggestion: string}>, overallScore: number}>}
   */
  async analyzeFormDescription(description) {
    if (!this.isInitialized) {
      throw new AIServiceError('AI service not initialised')
    }

    try {
      const analysisPrompt =
        this.components.promptBuilder.buildGDSAnalysisPrompt(description)

      const response =
        await this.components.evaluationProvider.generate(analysisPrompt)

      // Extract XML content
      const xmlMatch = /<analysis>[\s\S]*<\/analysis>/.exec(response.content)
      if (!xmlMatch) {
        this.logger.error(
          'No XML analysis found in AI response:',
          response.content
        )
        throw new Error('Invalid response format from AI analysis')
      }

      const xmlContent = xmlMatch[0]

      // Parse XML manually (simple parsing for our specific format)
      const isGoodMatch = /<isGood>(true|false)<\/isGood>/.exec(xmlContent)
      const scoreMatch = /<overallScore>(\d+(?:\.\d+)?)<\/overallScore>/.exec(
        xmlContent
      )
      const feedbackItems = []

      // Extract all feedback items
      const feedbackRegex =
        /<item>\s*<issue>([\s\S]*?)<\/issue>\s*<suggestion>([\s\S]*?)<\/suggestion>\s*<\/item>/g
      let match
      while ((match = feedbackRegex.exec(xmlContent)) !== null) {
        feedbackItems.push({
          issue: match[1].trim(),
          suggestion: match[2].trim()
        })
      }

      const analysis = {
        isGood: isGoodMatch ? isGoodMatch[1] === 'true' : true,
        overallScore: scoreMatch ? parseFloat(scoreMatch[1]) : 7,
        feedback: feedbackItems
      }

      this.logger.info('Form description analyzed')
      // eslint-disable-next-line no-console
      console.log('Form description analysis:', {
        isGood: analysis.isGood,
        score: analysis.overallScore,
        feedbackCount: analysis.feedback.length
      })

      return analysis
    } catch (error) {
      this.logger.error(error, 'Form description analysis failed')
      this.logger.error(
        `Returning default analysis due to error: ${error instanceof Error ? error.message : String(error)}`
      )

      return {
        isGood: true,
        overallScore: 7,
        feedback: []
      }
    }
  }

  /**
   * Analyze and refine form description in a single call (for server-side efficiency)
   * @param {string} description - Form description to analyze and refine
   * @returns {Promise<{analysis: {isGood: boolean, feedback: Array<{issue: string, suggestion: string}>, overallScore: number}, refinedDescription: string}>}
   */
  async analyseAndRefineDescription(description) {
    if (!this.isInitialized) {
      throw new AIServiceError('AI service not initialised')
    }

    try {
      const analysis = await this.analyzeFormDescription(description)

      let refinedDescription = description
      if (analysis.feedback.length > 0) {
        refinedDescription = await this.refineFormDescription(
          description,
          analysis.feedback
        )
      }

      this.logger.info('Form description analyzed and refined')
      // eslint-disable-next-line no-console
      console.log('Form analysis and refinement:', {
        score: analysis.overallScore,
        issuesFound: analysis.feedback.length,
        wasRefined: refinedDescription !== description
      })

      return {
        analysis,
        refinedDescription
      }
    } catch (error) {
      this.logger.error(
        error,
        'Form description analysis and refinement failed'
      )
      this.logger.error(
        `Returning defaults due to error: ${error instanceof Error ? error.message : String(error)}`
      )

      return {
        analysis: {
          isGood: true,
          overallScore: 7,
          feedback: []
        },
        refinedDescription: description
      }
    }
  }

  /**
   * Refine form description based on GDS feedback
   * @param {string} description - Original form description
   * @param {Array<{issue: string, suggestion: string}>} feedback - GDS analysis feedback
   * @returns {Promise<string>} Refined description
   */
  async refineFormDescription(description, feedback) {
    if (!this.isInitialized) {
      throw new AIServiceError('AI service not initialised')
    }

    try {
      const refinementPrompt = `You are helping improve a form description based on GDS guidelines feedback.

Original description:
<description>
${description}
</description>

Feedback received:
<feedback>
${feedback
  .map(
    (item) => `
  <item>
    <issue>${item.issue}</issue>
    <suggestion>${item.suggestion}</suggestion>
  </item>`
  )
  .join('')}
</feedback>

Please rewrite the description to address ALL the feedback points while:
1. Maintaining the original intent and requirements
2. Following GDS guidelines for clarity and user focus
3. Being specific about form fields and validation needed
4. Using plain English and avoiding jargon

Provide ONLY the improved description, no explanations or commentary.`

      const response =
        await this.components.evaluationProvider.generate(refinementPrompt)

      const rawRefinedDescription = response.content.trim()

      // Clean any XML tags from the refined description before showing to users
      const refinedDescription =
        this.components.responseProcessor.cleanDescriptionText(
          rawRefinedDescription
        )

      this.logger.info('Form description refined and cleaned')
      // eslint-disable-next-line no-console
      console.log('Form refinement details:', {
        originalLength: description.length,
        rawRefinedLength: rawRefinedDescription.length,
        cleanedRefinedLength: refinedDescription.length,
        feedbackItemsAddressed: feedback.length,
        hadXmlTags: rawRefinedDescription !== refinedDescription
      })

      return refinedDescription
    } catch (error) {
      this.logger.error(error, 'Form description refinement failed')
      this.logger.error(
        `Returning original description due to error: ${error instanceof Error ? error.message : String(error)}`
      )

      return description
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
