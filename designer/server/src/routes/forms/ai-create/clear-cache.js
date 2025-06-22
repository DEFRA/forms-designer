import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export default [
  {
    method: 'GET',
    path: '/ai/clear-cache',
    handler: async (request, h) => {
      try {
        logger.info('🧹 Manual cache clear requested')

        // Get AI service and clear cache
        const aiService = request.server.app.aiService
        if (aiService) {
          await aiService.clearCache()
          logger.info('✅ Cache cleared successfully')
          return { success: true, message: 'AI cache cleared successfully' }
        } else {
          logger.warn('❌ AI service not available')
          return { success: false, message: 'AI service not available' }
        }
      } catch (error) {
        logger.error('❌ Failed to clear cache', {
          error: error.message
        })
        return {
          success: false,
          message: 'Failed to clear cache',
          error: error.message
        }
      }
    }
  }
]
