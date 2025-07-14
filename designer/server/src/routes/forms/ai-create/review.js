import { randomUUID } from 'node:crypto'
import Stream from 'node:stream'

import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import { formOverviewPath } from '~/src/models/links.js'
import { AIFormValidator } from '~/src/services/ai/form-validator.js'
import { ResponseProcessor } from '~/src/services/ai/response-processor.js'

const logger = createLogger()

export const ROUTE_PATH_CREATE_AI_REVIEW = '/create/ai-review'

const reviewActionSchema = Joi.object().keys({
  action: Joi.string()
    .valid('approve', 'regenerate', 'edit-manually')
    .required()
    .messages({
      'any.required': 'Select what you want to do with this form',
      'any.only': 'Select a valid action'
    }),
  feedback: Joi.when('action', {
    is: 'regenerate',
    then: Joi.string().trim().min(10).max(1000).required().messages({
      'string.empty': 'Provide feedback for regeneration',
      'string.min': 'Feedback must be at least 10 characters',
      'string.max': 'Feedback must not exceed 1000 characters'
    }),
    otherwise: Joi.string().optional().allow('')
  })
})

export default [
  /**
   * @satisfies {ServerRoute}
   */
  {
    method: 'GET',
    path: ROUTE_PATH_CREATE_AI_REVIEW,
    options: {
      validate: {
        query: Joi.object().keys({
          regenerated: Joi.boolean().optional()
        })
      }
    },
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    handler: async (request, h) => {
      try {
        const { yar } = request
        const metadata = yar.get(sessionNames.create)

        if (!metadata) {
          return h.redirect('/create')
        }

        const aiService = request.server.app.aiService
        if (!aiService) {
          throw new Error('AI service not available')
        }

        let tempForm = null

        try {
          tempForm = await aiService.components.tempFormManager.getTempForm(
            request.yar.id
          )
        } catch (error) {
          logger.warn('Could not get temp form from manager', error)
        }

        if (!tempForm && metadata.aiJobId) {
          logger.info('Getting form from job status for background job')
          const jobStatus = await aiService.getJobStatus(metadata.aiJobId)

          if (
            jobStatus &&
            typeof jobStatus === 'object' &&
            'status' in jobStatus &&
            jobStatus.status === 'completed' &&
            'result' in jobStatus &&
            jobStatus.result
          ) {
            /**
             * @type {{ formDefinition?: any, metadata?: any }}
             */
            const result = jobStatus.result
            tempForm = {
              formDefinition: result.formDefinition,
              description: metadata.formDescription ?? 'AI-generated form',
              preferences: metadata.preferences ?? {},
              metadata: result.metadata ?? {}
            }

            try {
              await aiService.components.tempFormManager.storeTempForm(
                request.yar.id,
                tempForm
              )
              logger.info(
                'Stored job result in temp form manager for future access'
              )
            } catch (error) {
              logger.warn('Could not store in temp form manager', error)
            }
          }
        }

        if (
          !tempForm ||
          typeof tempForm !== 'object' ||
          !('formDefinition' in tempForm)
        ) {
          logger.warn('No temp form found, redirecting to describe')
          return h.redirect('/create/ai-describe')
        }

        const formDefinition = tempForm.formDefinition
        if (formDefinition && typeof formDefinition === 'object') {
          if ('name' in formDefinition) {
            formDefinition.name = metadata.title ?? 'AI Generated Form'
          }
        }

        /**
         * @type {{ formDefinition?: any, metadata?: any, description?: string }}
         */
        const tempFormData = tempForm
        const formDef = /** @type {FormDefinition} */ (formDefinition)
        const pages = formDef.pages
        const conditions = formDef.conditions
        const lists = formDef.lists

        const viewModel = {
          backLink: {
            href: '/create/ai-describe'
          },
          pageTitle: 'Review your AI-generated form',
          pageHeading: {
            text: 'Review your form',
            size: 'large'
          },
          pageDescription: `AI has generated: "${metadata.title}"`,
          formDefinition: tempFormData.formDefinition,
          metadata: tempFormData.metadata,
          stats: {
            pageCount: Array.isArray(pages) ? pages.length : 0,
            componentCount: Array.isArray(pages)
              ? pages.reduce(
                  (/** @type {number} */ count, /** @type {any} */ page) => {
                    const components = page?.components ?? []
                    return (
                      count +
                      (Array.isArray(components) ? components.length : 0)
                    )
                  },
                  0
                )
              : 0,
            conditionCount: Array.isArray(conditions) ? conditions.length : 0,
            listCount: Array.isArray(lists) ? lists.length : 0
          },
          isRegenerated: request.query.regenerated === true,
          originalDescription: tempFormData.description
        }

        return h.view('forms/ai-create/review', viewModel)
      } catch (error) {
        logger.error('AI review GET failed', error)

        return h
          .view('error/index', {
            pageTitle: 'Error',
            heading: 'Something went wrong',
            message: 'Unable to load the AI-generated form. Please try again.'
          })
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
      }
    }
  },
  /**
   * @satisfies {ServerRoute<{ Payload: ReviewActionPayload }>}
   */
  {
    method: 'POST',
    path: ROUTE_PATH_CREATE_AI_REVIEW,
    options: {
      validate: {
        payload: reviewActionSchema,
        /**
         * @param {Request} request
         * @param {ResponseToolkit} h
         * @param {ValidationError} error
         */
        failAction: (request, h, error) => {
          const formErrors = buildErrorDetails(error)

          return h
            .view('forms/ai-create/review', {
              pageTitle: 'Review your AI-generated form',
              formErrors,
              formValues: request.payload
            })
            .code(StatusCodes.BAD_REQUEST)
            .takeover()
        }
      }
    },
    /**
     * @param {Request} request
     * @param {ResponseToolkit} h
     */
    handler: async (request, h) => {
      try {
        if (
          typeof request.payload !== 'object' ||
          request.payload instanceof Stream ||
          Buffer.isBuffer(request.payload)
        ) {
          throw new Error('Invalid payload type')
        }

        /**
         * @type {ReviewActionPayload}
         */
        const payload = /** @type {ReviewActionPayload} */ (request.payload)
        const { action, feedback } = payload

        logger.info('AI review POST handler started')

        const { yar } = request
        const metadata = yar.get(sessionNames.create)

        logger.info('Session metadata check')

        if (!metadata) {
          logger.warn('No metadata found in session, redirecting to /create')
          return h.redirect('/create')
        }

        if (
          !metadata.organisation ||
          !metadata.teamName ||
          !metadata.teamEmail
        ) {
          logger.warn(
            'Incomplete metadata (missing org/team), redirecting to start flow properly'
          )

          yar.clear(sessionNames.create)
          return h.redirect('/create')
        }

        const aiService = request.server.app.aiService
        if (!aiService) {
          logger.error('AI service not available on server.app')
          throw new Error('AI service not available')
        }

        switch (action) {
          case 'approve': {
            const tempForm =
              await aiService.components.tempFormManager.getTempForm(
                request.yar.id
              )

            if (
              !tempForm ||
              typeof tempForm !== 'object' ||
              !('formDefinition' in tempForm)
            ) {
              logger.warn('No temp form found, redirecting to describe')
              return h.redirect('/create/ai-describe')
            }

            const tempFormDef = /** @type {any} */ (tempForm.formDefinition)
            logger.info('Form retrieved from temp form manager')
            // eslint-disable-next-line no-console
            console.log('=== RETRIEVED FORM ANALYSIS ===')
            // eslint-disable-next-line no-console
            console.log(
              'Conditions:',
              JSON.stringify(tempFormDef.conditions, null, 2)
            )
            // eslint-disable-next-line no-console
            console.log('Pages with condition references:')
            tempFormDef.pages?.forEach((/** @type {any} */ page) => {
              if (page.condition) {
                // eslint-disable-next-line no-console
                console.log(
                  `  - Page ${page.path} has page-level condition: ${page.condition}`
                )
              }
              if (page.next && Array.isArray(page.next)) {
                page.next.forEach(
                  (/** @type {any} */ nextItem, /** @type {number} */ idx) => {
                    if (nextItem.condition) {
                      // eslint-disable-next-line no-console
                      console.log(
                        `  - Page ${page.path} next[${idx}] to ${nextItem.path} has condition: ${nextItem.condition}`
                      )
                    }
                  }
                )
              }
            })
            // eslint-disable-next-line no-console
            console.log('=== END RETRIEVED FORM ANALYSIS ===')

            const formDefinition = tempForm.formDefinition
            if (
              !formDefinition ||
              typeof formDefinition !== 'object' ||
              Array.isArray(formDefinition)
            ) {
              throw new Error('Invalid form definition structure')
            }

            if ('name' in formDefinition) {
              formDefinition.name = metadata.title ?? 'AI Generated Form'
            }

            logger.info('Creating new form with metadata')

            const newForm = await forms.create(
              {
                title: metadata.title ?? 'AI Generated Form',
                organisation: metadata.organisation,
                teamName: metadata.teamName,
                teamEmail: metadata.teamEmail
              },
              request.auth.credentials.token
            )

            try {
              const responseProcessor = new ResponseProcessor()
              responseProcessor.fixConditionStructure(formDefinition)
              responseProcessor.ensureRequiredFields(formDefinition)

              logger.info(
                'Conditions fixed and required fields ensured by ResponseProcessor'
              )
              // eslint-disable-next-line no-console
              console.log(
                'Fixed conditions:',
                JSON.stringify(
                  /** @type {any} */ (formDefinition).conditions,
                  null,
                  2
                )
              )

              const validator = new AIFormValidator()
              const validationResult =
                validator.validateFormIntegrity(formDefinition)

              if (!validationResult.isValid) {
                logger.error(
                  'Form validation failed before sending to forms manager'
                )
                // eslint-disable-next-line no-console
                console.log('Validation errors:', validationResult.errors)

                // Store validation errors in session for regeneration
                yar.set(sessionNames.create, {
                  ...metadata
                })

                throw new Error(
                  `Form validation failed: ${validationResult.errors.map((/** @type {any} */ e) => e.message).join(', ')}`
                )
              }

              const formDef = /** @type {any} */ (formDefinition)
              logger.info('Form structure being sent to forms manager')
              // eslint-disable-next-line no-console
              console.log('Form structure:', {
                engine: formDef.engine,
                schema: formDef.schema,
                name: formDef.name,
                startPage: formDef.startPage,
                hasConditions: !!formDef.conditions,
                conditionCount: formDef.conditions?.length ?? 0,
                firstConditionStructure: formDef.conditions?.[0]
                  ? {
                      hasField: 'field' in formDef.conditions[0],
                      hasItems: 'items' in formDef.conditions[0],
                      keys: Object.keys(formDef.conditions[0])
                    }
                  : null
              })

              await forms.updateDraftFormDefinition(
                newForm.id,
                /** @type {FormDefinition} */ (formDefinition),
                request.auth.credentials.token
              )

              logger.info('Draft form definition updated successfully')

              logger.info('Cleaning up temp form')
              await aiService.components.tempFormManager.deleteTempForm(
                request.yar.id
              )

              yar.clear(sessionNames.create)

              logger.info('AI-generated form saved successfully')

              return h.redirect(formOverviewPath(newForm.slug))
            } catch (formsManagerError) {
              logger.error(
                'Forms manager API failed to accept form definition',
                formsManagerError
              )

              // Log more details about the error
              // eslint-disable-next-line no-console
              console.log('Forms manager error details:', {
                message:
                  formsManagerError instanceof Error
                    ? formsManagerError.message
                    : String(formsManagerError),
                stack:
                  formsManagerError instanceof Error
                    ? formsManagerError.stack
                    : undefined,
                response:
                  /** @type {any} */ (formsManagerError).response?.data ??
                  formsManagerError,
                data: /** @type {any} */ (formsManagerError).data,
                validation: /** @type {any} */ (formsManagerError).data
                  ?.validation
              })

              // Log the full form definition being sent
              // eslint-disable-next-line no-console
              console.log(
                'Full form definition sent to forms manager:',
                JSON.stringify(formDefinition, null, 2)
              )

              try {
                await forms.deleteForm(
                  newForm.id,
                  request.auth.credentials.token
                )
                logger.info('Cleaned up empty form after forms manager failure')
              } catch (cleanupError) {
                logger.warn('Could not clean up empty form', cleanupError)
              }

              logger.info('Preserving temp form and session for user to retry')

              return h
                .view('forms/ai-create/review', {
                  backLink: {
                    href: '/create/ai-describe'
                  },
                  pageTitle: 'Review your AI-generated form',
                  pageHeading: {
                    text: 'Review your form',
                    size: 'large'
                  },
                  pageDescription: `AI has generated: "${metadata.title}"`,
                  formDefinition: tempForm.formDefinition,
                  metadata: /** @type {any} */ (tempForm).metadata ?? {},
                  stats: {
                    pageCount: Array.isArray(
                      /** @type {any} */ (formDefinition).pages
                    )
                      ? /** @type {any} */ (formDefinition).pages.length
                      : 0,
                    componentCount: Array.isArray(
                      /** @type {any} */ (formDefinition).pages
                    )
                      ? /** @type {any} */ (formDefinition).pages.reduce(
                          (
                            /** @type {number} */ count,
                            /** @type {any} */ page
                          ) => {
                            const components = page?.components ?? []
                            return (
                              count +
                              (Array.isArray(components)
                                ? components.length
                                : 0)
                            )
                          },
                          0
                        )
                      : 0,
                    conditionCount: Array.isArray(
                      /** @type {any} */ (formDefinition).conditions
                    )
                      ? /** @type {any} */ (formDefinition).conditions.length
                      : 0,
                    listCount: Array.isArray(
                      /** @type {any} */ (formDefinition).lists
                    )
                      ? /** @type {any} */ (formDefinition).lists.length
                      : 0
                  },
                  formErrors: [
                    {
                      text: 'There was a problem with the generated form structure. Please try regenerating with feedback, or choose to edit manually.',
                      href: '#action'
                    }
                  ],
                  originalDescription: /** @type {any} */ (tempForm)
                    .description,
                  showRetryOptions: true
                })
                .code(StatusCodes.BAD_REQUEST)
            }
          }

          case 'regenerate': {
            logger.info('Processing REGENERATE action')

            const tempForm =
              await aiService.components.tempFormManager.getTempForm(
                request.yar.id
              )

            if (
              !tempForm ||
              typeof tempForm !== 'object' ||
              !('formDefinition' in tempForm) ||
              !tempForm.formDefinition
            ) {
              logger.warn(
                'No temp form found for regeneration, redirecting to describe'
              )
              return h.redirect('/create/ai-describe')
            }

            const jobId = `job-${randomUUID()}`

            const typedTempForm =
              /** @type {{formDefinition: object, description?: string}} */ (
                tempForm
              )

            yar.set(sessionNames.create, {
              ...metadata,
              formDescription: metadata.formDescription,
              aiJobId: jobId,
              regenerationFeedback: feedback,
              regenerationContext: {
                originalDescription:
                  typedTempForm.description ?? metadata.formDescription,
                currentFormDefinition: typedTempForm.formDefinition,
                userFeedback: feedback
              }
            })

            setImmediate(() => {
              const userId = request.auth.credentials.user?.id ?? undefined

              const enhancedFeedback = feedback ?? ''

              aiService
                .regenerateFormInBackground(
                  jobId,
                  typedTempForm.description ?? metadata.formDescription ?? '',
                  enhancedFeedback,
                  typedTempForm.formDefinition,
                  metadata.title ?? 'AI Form',
                  yar,
                  userId
                )
                .catch((/** @type {any} */ error) => {
                  logger.error(
                    error,
                    `Background AI regeneration failed for job ${jobId}`
                  )
                })
            })

            logger.info(
              'AI form regeneration started in background with proper context'
            )

            return h.redirect('/create/ai-progress').code(StatusCodes.SEE_OTHER)
          }

          case 'edit-manually': {
            logger.info('Processing EDIT-MANUALLY action')

            const tempFormForEdit =
              await aiService.components.tempFormManager.getTempForm(
                request.yar.id
              )

            if (tempFormForEdit) {
              const draftForm = await forms.create(
                {
                  title: metadata.title ?? 'AI Generated Form',
                  organisation: metadata.organisation,
                  teamName: metadata.teamName,
                  teamEmail: metadata.teamEmail
                },
                request.auth.credentials.token
              )

              const editFormDef = /** @type {FormDefinition} */ (
                /** @type {any} */ (tempFormForEdit).formDefinition
              )

              try {
                const responseProcessor = new ResponseProcessor()
                responseProcessor.fixConditionStructure(editFormDef)
                responseProcessor.ensureRequiredFields(editFormDef)

                await forms.updateDraftFormDefinition(
                  draftForm.id,
                  editFormDef,
                  request.auth.credentials.token
                )

                await aiService.components.tempFormManager.deleteTempForm(
                  request.yar.id
                )
                yar.clear(sessionNames.create)

                return h.redirect(formOverviewPath(draftForm.slug))
              } catch (formsManagerError) {
                logger.error(
                  'Forms manager failed for edit-manually',
                  formsManagerError
                )

                // eslint-disable-next-line no-console
                console.log('Forms manager error details (edit-manually):', {
                  message:
                    formsManagerError instanceof Error
                      ? formsManagerError.message
                      : String(formsManagerError),
                  stack:
                    formsManagerError instanceof Error
                      ? formsManagerError.stack
                      : undefined,
                  response:
                    /** @type {any} */ (formsManagerError).response?.data ??
                    formsManagerError
                })

                try {
                  await forms.deleteForm(
                    draftForm.id,
                    request.auth.credentials.token
                  )
                  logger.info(
                    'Cleaned up empty form after edit-manually failure'
                  )
                } catch (cleanupError) {
                  logger.warn('Could not clean up empty form', cleanupError)
                }

                throw formsManagerError
              }
            }

            logger.warn('No temp form found, redirecting to /create')
            return h.redirect('/create')
          }

          default:
            logger.error('Invalid action received')
            throw new Error('Invalid action')
        }
      } catch (error) {
        logger.error('AI review POST failed', error)

        return h
          .view('forms/ai-create/review', {
            pageTitle: 'Review your AI-generated form',
            formErrors: [
              {
                text: 'Something went wrong. Please try again.',
                href: '#action'
              }
            ],
            formValues: request.payload
          })
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
      }
    }
  }
]

/**
 * @typedef {object} ReviewActionPayload
 * @property {'approve' | 'regenerate' | 'edit-manually'} action - The action to take
 * @property {string} [feedback] - Feedback for regeneration (required when action is 'regenerate')
 */

/**
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 * @import { ValidationError } from 'joi'
 * @import { FormDefinition } from '@defra/forms-model'
 */
