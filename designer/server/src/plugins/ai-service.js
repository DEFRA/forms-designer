/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'
import { getAIService } from '~/src/services/ai/ai-service.js'

const logger = createLogger()

/**
 * AI Service Plugin for Hapi
 * Initializes AI service if configured and makes it available via server.app
 */
export const aiServicePlugin = {
  plugin: {
    name: 'ai-service',
    /**
     * @param {Server} server
     */
    register(server) {
      const aiConfig = config.ai

      logger.info('🔍 AI Service Plugin - Configuration Check:', {
        hasAiConfig: !!aiConfig,
        aiEnabled: aiConfig?.enabled ?? false,
        hasClaudeConfig: !!aiConfig?.claude,
        hasApiKey: !!aiConfig?.claude?.apiKey,
        apiKeyLength: aiConfig?.claude?.apiKey?.length ?? 'undefined',
        apiKeyPrefix:
          (aiConfig?.claude?.apiKey?.substring(0, 15) ?? 'no-key') + '...',
        validApiKeyFormat:
          aiConfig?.claude?.apiKey?.startsWith('sk-ant-') ?? false,
        model: aiConfig?.claude?.model ?? 'undefined',
        maxTokens: aiConfig?.claude?.maxTokens ?? 'undefined',
        maxRetries: aiConfig?.maxRetries ?? 'undefined',
        environmentVars: {
          CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? 'SET' : 'NOT_SET',
          AI_ENABLED: process.env.AI_ENABLED ?? 'undefined'
        }
      })

      if (aiConfig?.enabled && aiConfig.claude.apiKey) {
        try {
          logger.info(
            '✅ All AI config checks passed - initializing service...'
          )
          const aiService = getAIService(aiConfig, server)
          server.app.aiService = aiService
          logger.info('AI service plugin registered successfully')
        } catch (error) {
          logger.error('Failed to initialize AI service', {
            error: error instanceof Error ? error.message : String(error)
          })
          server.app.aiService = null
        }
      } else {
        logger.warn('❌ AI service disabled - configuration check failed:', {
          hasAiConfig: !!aiConfig,
          isEnabled: aiConfig?.enabled,
          hasClaudeConfig: !!aiConfig?.claude,
          hasApiKey: !!aiConfig?.claude?.apiKey
        })
        server.app.aiService = null
      }
    }
  }
}

/**
 * @import { Server } from '@hapi/hapi'
 */
