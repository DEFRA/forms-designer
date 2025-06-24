/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import config from '~/src/config.js'
import { getAIService } from '~/src/services/ai/ai-service.js'

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

      if (aiConfig?.enabled && aiConfig.claude.apiKey) {
        try {
          const aiService = getAIService(aiConfig, server)
          server.app.aiService =
            /** @type {ServerApplicationState['aiService']} */ (aiService)
        } catch {
          server.app.aiService = undefined
        }
      } else {
        server.app.aiService = undefined
      }
    }
  }
}

/**
 * @import { Server, ServerApplicationState } from '@hapi/hapi'
 */
