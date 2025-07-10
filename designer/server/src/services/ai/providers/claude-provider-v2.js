import Anthropic from '@anthropic-ai/sdk'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import { AIFormValidator } from '~/src/services/ai/form-validator.js'
import { PromptBuilderV2 } from '~/src/services/ai/prompt-builder-v2.js'
import { ResponseProcessor } from '~/src/services/ai/response-processor.js'
import { SchemaManager } from '~/src/services/ai/schema-manager.js'

const logger = createLogger()

/**
 * Optimized Claude Provider - Reduces costs and improves performance
 */
export class ClaudeProviderV2 {
  /**
   * @param {any} config
   */
  constructor(config) {
    const claudeConfig = config.claude ?? config

    this.apiKey = claudeConfig.apiKey
    this.baseUrl = claudeConfig.baseUrl ?? 'https://api.anthropic.com'
    this.model = claudeConfig.model ?? 'claude-3-5-sonnet-20241022'
    this.maxTokens = claudeConfig.maxTokens ?? 8000
    this.temperature = claudeConfig.temperature ?? 0.1
    this.enablePromptCaching = claudeConfig.enablePromptCaching ?? true
    this.useDirectGeneration = true // Always use direct for V2

    if (!this.apiKey) {
      throw new Error('Claude API key is required')
    }

    this.client = new Anthropic({
      apiKey: this.apiKey,
      baseURL: this.baseUrl
    })

    // Initialize optimized services
    this.schemaManager = new SchemaManager()
    this.promptBuilder = new PromptBuilderV2()
    this.responseProcessor = new ResponseProcessor()
    this.validator = new AIFormValidator()

    logger.info(
      `ClaudeProviderV2 initialized with model: ${this.model}, prompt caching: ${this.enablePromptCaching}`
    )
  }

  /**
   * Load and prepare V2 schemas for AI generation
   * @returns {object} Object containing all V2 schemas
   */
  loadV2Schemas() {
    try {
      const schemas = this.schemaManager.loadAllV2Schemas()
      logger.info('Loaded all V2 schemas for form generation')
      return schemas
    } catch (error) {
      logger.error(error, 'Failed to load V2 schemas')
      throw error
    }
  }

  /**
   * Count tokens for a message to get input token estimate
   * @param {string} systemPrompt - System prompt
   * @param {Array<any>} messages - Messages array
   * @param {Array<any>} [tools] - Optional tools array
   * @returns {Promise<number>} - Estimated input tokens
   */
  async countTokens(systemPrompt, messages, tools = undefined) {
    try {
      const countParams = /** @type {any} */ ({
        model: this.model,
        system: systemPrompt,
        messages
      })

      if (tools) {
        countParams.tools = tools
      }

      const response = await this.client.messages.countTokens(countParams)
      return response.input_tokens
    } catch (error) {
      logger.warn('Token counting failed:', error)
      return 0
    }
  }

  /**
   * Estimate cost based on token usage for different Claude models
   * @param {number} inputTokens - Input tokens
   * @param {number} outputTokens - Output tokens
   * @param {string} model - Model name
   * @returns {number} - Estimated cost in GBP
   */
  estimateCost(inputTokens, outputTokens, model) {
    /** @type {Record<string, {input: number, output: number}>} */
    const pricing = {
      'claude-opus-4-20250514': { input: 12, output: 60 },
      'claude-sonnet-4-20250514': { input: 2.4, output: 12 },
      'claude-3-7-sonnet-20250219': { input: 2.4, output: 12 },
      'claude-3-5-sonnet-20241022': { input: 2.4, output: 12 },
      'claude-3-5-haiku-20241022': { input: 0.64, output: 3.2 },
      'claude-3-opus-20240229': { input: 12, output: 60 },
      'claude-3-haiku-20240307': { input: 0.2, output: 1 }
    }
    const modelPricing = pricing[model] ?? pricing['claude-3-5-sonnet-20241022']
    const inputCost = (inputTokens * modelPricing.input) / 1000000
    const outputCost = (outputTokens * modelPricing.output) / 1000000
    return inputCost + outputCost
  }

  /**
   * Generate form using optimized direct approach
   * @param {string} description
   * @param {string} _title
   * @param {Function} updateProgress
   * @returns {Promise<any>}
   */
  async generateFormDirect(description, _title, updateProgress) {
    try {
      await updateProgress('generation', 'Creating your form with AI...', {
        step: 1
      })

      const systemPrompt = this.promptBuilder.buildSystemPrompt()
      const userPrompt = this.promptBuilder.buildFormGenerationPrompt(
        description,
        {
          complexity: 'medium',
          maxPages: 10,
          includeConditionals: true
        }
      )

      const messages = this.enablePromptCaching
        ? [
            {
              role: /** @type {const} */ ('user'),
              content: [
                {
                  type: /** @type {const} */ ('text'),
                  text: userPrompt,
                  cache_control: { type: /** @type {const} */ ('ephemeral') }
                }
              ]
            }
          ]
        : [
            {
              role: /** @type {const} */ ('user'),
              content: userPrompt
            }
          ]

      const estimatedInputTokens = await this.countTokens(
        systemPrompt,
        messages
      )
      logger.info(
        `Estimated input tokens for V2 generation: ${estimatedInputTokens.toLocaleString()}`
      )

      let response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages
      })

      await updateProgress('processing', 'Processing and validating form...', {
        step: 2
      })

      let formDefinition = null
      let refinementAttempts = 0
      const maxRefinements = 5

      while (refinementAttempts < maxRefinements && !formDefinition) {
        try {
          const firstContent = response.content[0]
          if (firstContent.type !== 'text') {
            throw new Error('No valid text content found in AI response')
          }

          const candidateForm = this.responseProcessor.processResponse(
            firstContent.text
          )

          const validationResult =
            this.validator.validateFormIntegrity(candidateForm)

          if (validationResult.isValid) {
            formDefinition = candidateForm
            logger.info('Form validation passed')
            break
          }

          if (refinementAttempts >= maxRefinements - 1) {
            formDefinition = candidateForm
            logger.warn(
              'Accepting form with validation warnings after max refinements'
            )
            break
          }

          refinementAttempts++
          logger.info(
            `Refinement attempt ${refinementAttempts}/${maxRefinements}`
          )

          const refinementPrompt = this.promptBuilder.buildRefinementPrompt(
            description,
            validationResult.errors
          )

          response = await this.client.messages.create({
            model: this.model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            system: systemPrompt,
            messages: [
              {
                role: /** @type {const} */ ('user'),
                content: refinementPrompt
              }
            ]
          })

          await updateProgress(
            'refinement',
            `Refining form design (attempt ${refinementAttempts})...`,
            { step: 3, refinement: refinementAttempts }
          )
        } catch (error) {
          if (
            error instanceof Error &&
            refinementAttempts < maxRefinements - 1
          ) {
            refinementAttempts++
            logger.warn(
              `Refinement error, attempt ${refinementAttempts}/${maxRefinements}`
            )

            response = await this.client.messages.create({
              model: this.model,
              max_tokens: this.maxTokens,
              temperature: this.temperature,
              system: systemPrompt,
              messages: [
                {
                  role: /** @type {const} */ ('user'),
                  content: `Generate a valid FormDefinitionV2 for: "${description}"

Focus on:
- Valid UUID format (hex only: 0-9,a-f)
- Unique IDs for all elements
- One question per page
- Required fields filled

Generate JSON only.`
                }
              ]
            })
          } else {
            throw error
          }
        }
      }

      if (!formDefinition) {
        throw new Error(
          'Failed to generate valid form after all refinement attempts'
        )
      }

      const usage = {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        cachedTokens:
          /** @type {any} */ (response.usage).cache_creation_input_tokens ?? 0,
        cacheReadTokens:
          /** @type {any} */ (response.usage).cache_read_input_tokens ?? 0
      }

      const cost = this.estimateCost(
        usage.inputTokens,
        usage.outputTokens,
        this.model
      )
      logger.info(`=== TOKEN USAGE SUMMARY ===`)
      logger.info(`Model: ${this.model}`)
      logger.info(`Input Tokens: ${usage.inputTokens.toLocaleString()}`)
      logger.info(`Output Tokens: ${usage.outputTokens.toLocaleString()}`)
      logger.info(
        `Total Tokens: ${(usage.inputTokens + usage.outputTokens).toLocaleString()}`
      )
      logger.info(`Cost Estimate: £${cost.toFixed(2)}`)
      if (usage.cachedTokens > 0 || usage.cacheReadTokens > 0) {
        logger.info(
          `Cache Tokens: ${usage.cachedTokens.toLocaleString()} created, ${usage.cacheReadTokens.toLocaleString()} read`
        )
      }
      logger.info(`=== END TOKEN USAGE ===`)

      return {
        content: JSON.stringify(formDefinition, null, 2),
        formDefinition,
        usage,
        model: this.model,
        directApproach: true,
        refinementAttempts
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error(error, `Direct generation failed: ${errorMessage}`)
      throw error
    }
  }

  /**
   * Simple generate method for analysis prompts
   * @param {string} prompt
   * @returns {Promise<{content: string, usage: object}>}
   */
  async generate(prompt) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        temperature: this.temperature,
        messages: [
          {
            role: /** @type {const} */ ('user'),
            content: prompt
          }
        ]
      })

      const firstContent = response.content[0]
      if (firstContent.type !== 'text') {
        throw new Error('No valid text content found in AI response')
      }

      return {
        content: firstContent.text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens
        }
      }
    } catch (error) {
      logger.error(error, 'Generation failed')
      throw error
    }
  }

  /**
   * Agentic generation placeholder - can be optimized similarly
   * @param {string} description
   * @param {string} title
   * @param {Function} updateProgress
   * @returns {Promise<any>}
   */
  async generateFormAgentic(description, title, updateProgress) {
    // For now, redirect to direct generation
    // Agentic approach can be optimized separately if needed
    logger.info('Using optimized direct generation instead of agentic')
    return this.generateFormDirect(description, title, updateProgress)
  }
}
