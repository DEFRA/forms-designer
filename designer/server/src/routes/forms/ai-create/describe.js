/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as describeModel from '~/src/models/forms/ai-create/describe.js'

const logger = createLogger()

export const ROUTE_PATH_CREATE_AI_DESCRIBE = '/create/ai-describe'
export const ROUTE_PATH_CREATE_AI_REVIEW = '/create/ai-review'
export const ROUTE_PATH_CREATE_AI_APPLY_SUGGESTIONS =
  '/create/ai-describe/apply-suggestions'
export const ROUTE_PATH_CREATE_AI_EVALUATE = '/create/ai-describe/evaluate'

const formDescriptionSchema = Joi.object().keys({
  formDescription: Joi.string().trim().min(20).max(20000).required().messages({
    'string.empty': 'Enter a description of your form',
    'string.min': 'Description must be at least 20 characters',
    'string.max': 'Description must be 20000 characters or less',
    'any.required': 'Enter a description of your form'
  }),

  preferences: Joi.object()
    .keys({
      complexity: Joi.string()
        .valid('simple', 'medium', 'complex')
        .default('medium'),
      maxPages: Joi.number().integer().min(1).max(100).default(50),
      includeConditionals: Joi.boolean().default(true)
    })
    .default({})
})

const evaluateDescriptionSchema = Joi.object().keys({
  formDescription: Joi.string().trim().min(10).max(20000).required().messages({
    'string.empty': 'Enter a description to evaluate',
    'string.min': 'Description must be at least 10 characters to evaluate',
    'string.max': 'Description must be 20000 characters or less',
    'any.required': 'Enter a description to evaluate'
  })
})

export default [
  /**
   * GET /create/ai-describe
   * @satisfies {ServerRoute}
   */
  {
    method: 'GET',
    path: ROUTE_PATH_CREATE_AI_DESCRIBE,
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    handler(request, h) {
      const { yar, query } = request

      // Check prerequisites
      const createData = /** @type {any} */ (yar.get(sessionNames.create))
      if (!createData?.title || createData.creationMethod !== 'ai-assisted') {
        return h.redirect('/create/method').temporary()
      }

      if (query.hide === 'feedback') {
        yar.clear('gdsAnalysis')
        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      }

      let validation = yar
        .flash(sessionNames.validationFailure.createForm)
        .at(0)

      if (!validation) {
        validation = yar.get('tempValidationFailure')
        if (validation) {
          yar.clear('tempValidationFailure')
        }
      } else {
        yar.set('tempValidationFailure', validation)
      }

      console.log(
        '🐛 DEBUG: GET /create/ai-describe - Retrieved validation:',
        JSON.stringify(validation, null, 2)
      )

      const successMessage = yar.flash('success').at(0)
      const errorMessage = yar.flash('error').at(0)
      const gdsAnalysis = yar.get('gdsAnalysis')

      return h.view(
        'forms/ai-create/describe',
        describeModel.describeViewModel(
          createData,
          /** @type {any} */ (validation),
          successMessage,
          errorMessage,
          gdsAnalysis
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  },

  /**
   * POST /create/ai-describe
   * @satisfies {ServerRoute}
   */
  {
    method: 'POST',
    path: ROUTE_PATH_CREATE_AI_DESCRIBE,
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    async handler(request, h) {
      const { payload, yar, server } = request
      const { formDescription, preferences } = /** @type {any} */ (payload)

      console.log('🐛 DEBUG: POST /create/ai-describe handler called')
      console.log('🐛 DEBUG: formDescription length:', formDescription?.length)
      console.log(
        '🐛 DEBUG: formDescription preview:',
        formDescription?.substring(0, 100) + '...'
      )
      console.log(
        '🐛 DEBUG: Character count validation - limit: 20000, actual:',
        formDescription?.length
      )
      console.log(
        '🐛 DEBUG: Over limit?',
        (formDescription?.length || 0) > 20000
      )
      console.log(
        '🐛 DEBUG: preferences:',
        JSON.stringify(preferences, null, 2)
      )

      try {
        const aiService = /** @type {any} */ (server.app).aiService
        if (!aiService) {
          throw new Error('AI service not available')
        }

        yar.clear('gdsAnalysis')

        try {
          await aiService.components.tempFormManager.deleteTempForm(
            request.yar.id
          )
          logger.info('Cleared existing temp form cache before new generation')
        } catch (error) {
          logger.debug('No existing temp form to clear', error)
        }

        const createData = yar.get(sessionNames.create)
        yar.set(sessionNames.create, {
          ...createData,
          formDescription,
          preferences
        })

        const jobId = `job-${crypto.randomUUID()}`
        yar.set(sessionNames.create, {
          ...createData,
          formDescription,
          preferences,
          aiJobId: jobId
        })

        setImmediate(() => {
          const userId = /** @type {any} */ (request.auth.credentials.user)?.id
          aiService
            .generateFormInBackground(
              jobId,
              formDescription,
              createData?.title,
              yar,
              userId
            )
            .catch((/** @type {any} */ error) => {
              logger.error(
                error,
                `Background AI generation failed for job ${jobId}`
              )
            })
        })

        console.log(
          '🐛 DEBUG: AI generation setup complete, redirecting to progress page'
        )
        return h.redirect('/create/ai-progress').code(StatusCodes.SEE_OTHER)
      } catch (error) {
        console.log('🐛 DEBUG: Exception in AI generation!')
        console.log(
          '🐛 DEBUG: Error name:',
          error instanceof Error ? error.name : 'Unknown'
        )
        console.log(
          '🐛 DEBUG: Error message:',
          error instanceof Error ? error.message : String(error)
        )
        console.log(
          '🐛 DEBUG: Error stack:',
          error instanceof Error ? error.stack : 'No stack'
        )

        logger.error(error, 'AI form generation failed')

        if (error instanceof Error && error.name === 'FormGenerationError') {
          yar.flash(sessionNames.validationFailure.createForm, {
            formErrors: {
              formDescription: {
                text: 'Unable to generate form from your description. Please try describing your requirements differently.',
                href: '#formDescription'
              }
            },
            formValues: payload
          })
        } else {
          yar.flash(sessionNames.validationFailure.createForm, {
            formErrors: {
              formDescription: {
                text: 'Sorry, there was a problem generating your form. Please try again.',
                href: '#formDescription'
              }
            },
            formValues: payload
          })
        }

        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      }
    },
    options: {
      payload: {
        parse: true,
        multipart: true
      },
      validate: {
        payload: formDescriptionSchema,
        /**
         * @param {Request} request
         * @param {ResponseToolkit} h
         * @param {Error} error
         */
        failAction: (request, h, error) => {
          console.log('🐛 DEBUG: Validation failed!')
          console.log('🐛 DEBUG: Validation error:', error.message)
          console.log(
            '🐛 DEBUG: Error details:',
            JSON.stringify(error.details, null, 2)
          )
          console.log(
            '🐛 DEBUG: Request payload in failAction:',
            JSON.stringify(request.payload, null, 2)
          )

          const { yar } = request
          const formErrors = buildErrorDetails(/** @type {any} */ (error))

          console.log(
            '🐛 DEBUG: Built form errors:',
            JSON.stringify(formErrors, null, 2)
          )

          yar.flash(sessionNames.validationFailure.createForm, {
            formErrors,
            formValues: request.payload
          })

          return h
            .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
            .code(StatusCodes.SEE_OTHER)
            .takeover()
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      },
      timeout: {
        server: 1200000 // 20 minutes for AI form generation with large complex forms
      }
    }
  },

  /**
   * POST /create/ai-describe/apply-suggestions
   * @satisfies {ServerRoute}
   */
  {
    method: 'POST',
    path: ROUTE_PATH_CREATE_AI_APPLY_SUGGESTIONS,
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    handler(request, h) {
      const { payload, yar } = request
      const { refinedDescription } = /** @type {any} */ (payload)

      try {
        const createData = yar.get(sessionNames.create) ?? {}
        createData.formDescription = refinedDescription
        yar.set(sessionNames.create, createData)

        yar.clear('gdsAnalysis')

        yar.flash(
          'success',
          'Your description has been refined based on GDS guidelines'
        )

        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      } catch (error) {
        logger.error(error, 'Failed to apply suggestions')

        yar.flash('error', 'Unable to apply suggestions. Please try again.')
        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      }
    },
    options: {
      validate: {
        payload: Joi.object().keys({
          refinedDescription: Joi.string().trim().min(20).max(5000).required()
        })
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  },

  /**
   * POST /create/ai-describe/evaluate
   * @satisfies {ServerRoute}
   */
  {
    method: 'POST',
    path: ROUTE_PATH_CREATE_AI_EVALUATE,
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    async handler(request, h) {
      const { payload, yar, server } = request
      const { formDescription } = /** @type {any} */ (payload)

      try {
        const aiService = /** @type {any} */ (server.app).aiService
        if (!aiService) {
          throw new Error('AI service not available')
        }

        const result =
          await aiService.analyseAndRefineDescription(formDescription)

        yar.set('gdsAnalysis', {
          analysis: result.analysis,
          refinedDescription: result.refinedDescription,
          originalDescription: formDescription
        })

        const createData = yar.get(sessionNames.create) ?? {}
        createData.formDescription = formDescription
        yar.set(sessionNames.create, createData)

        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      } catch (error) {
        logger.error(error, 'GDS analysis failed')

        yar.flash(
          'error',
          'Unable to analyze your description. Please try again.'
        )
        return h
          .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
          .code(StatusCodes.SEE_OTHER)
      }
    },
    options: {
      validate: {
        payload: evaluateDescriptionSchema,
        /**
         * @param {Request} request
         * @param {ResponseToolkit} h
         * @param {Error} error
         */
        failAction: (request, h, error) => {
          const { yar } = request
          const formErrors = buildErrorDetails(/** @type {any} */ (error))

          yar.flash(
            'error',
            Object.values(formErrors)
              .map((e) => e.text)
              .join(', ')
          )
          return h
            .redirect(ROUTE_PATH_CREATE_AI_DESCRIBE)
            .code(StatusCodes.SEE_OTHER)
            .takeover()
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormEdit}`]
        }
      }
    }
  }
]

/**
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
