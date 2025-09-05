import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export default [
  /**
   * AI generation progress page
   */
  {
    method: 'GET',
    path: '/create/ai-progress',
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    handler(request, h) {
      const { yar } = request
      const sessionKey = sessionNames.create
      const createSession = yar.get(sessionKey) ?? {}

      if (!createSession.aiJobId) {
        return h.redirect('/create/ai-describe').code(302)
      }

      return h.view('forms/ai-create/progress', {
        pageTitle: 'Generating your form...',
        formTitle: createSession.title,
        jobId: createSession.aiJobId
      })
    }
  },

  /**
   * Poll for AI generation job status (API endpoint)
   */
  {
    method: 'GET',
    path: '/api/ai/generate/status/{jobId}',
    options: {
      validate: {
        params: Joi.object({
          jobId: Joi.string().required()
        })
      }
    },
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    async handler(request, h) {
      const { jobId } = request.params

      try {
        const aiService = request.server.app.aiService
        const jobStatus = await aiService?.getJobStatus(jobId)

        if (!jobStatus) {
          logger.warn(
            `Job ${jobId} not found - likely orphaned from server restart`
          )
          return h
            .response({
              error: 'Job not found - possibly lost due to server restart',
              status: 'failed',
              message:
                'The generation job was lost, possibly due to a server restart. Please try generating your form again.'
            })
            .code(200) // Return 200 so frontend handles it as a failed job, not a polling error
        }

        return jobStatus
      } catch (error) {
        logger.error(error, `Failed to get job status for job ${jobId}`)
        return h
          .response({
            error: 'Failed to get status',
            message: error instanceof Error ? error.message : String(error)
          })
          .code(500)
      }
    }
  }
]

/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
