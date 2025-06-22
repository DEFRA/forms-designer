import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import { formOverviewPath } from '~/src/models/links.js'

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
    handler: async (request, h) => {
      try {
        const { yar } = request
        const metadata = yar.get(sessionNames.create)

        if (!metadata) {
          return h.redirect('/create')
        }

        // Get AI-generated form from job status (background jobs store it there)
        const aiService = request.server.app.aiService
        if (!aiService) {
          throw new Error('AI service not available')
        }

        let tempForm = null

        // First try to get from temp form manager (for direct generations)
        try {
          tempForm = await aiService.components.tempFormManager.getTempForm(
            request.yar.id
          )
        } catch (error) {
          logger.warn('Could not get temp form from manager', {
            error: error instanceof Error ? error.message : String(error)
          })
        }

        // If not found in temp form manager, get from job status (background jobs)
        if (!tempForm && metadata.aiJobId) {
          logger.info('Getting form from job status for background job', {
            jobId: metadata.aiJobId
          })
          const jobStatus = await aiService.getJobStatus(metadata.aiJobId)

          if (
            jobStatus &&
            jobStatus.status === 'completed' &&
            jobStatus.result
          ) {
            // Convert job result to temp form format
            tempForm = {
              formDefinition: jobStatus.result.formDefinition,
              description: metadata.formDescription || 'AI-generated form',
              preferences: metadata.preferences || {},
              metadata: jobStatus.result.metadata || {}
            }

            // Store in temp form manager for future access
            try {
              await aiService.components.tempFormManager.storeTempForm(
                request.yar.id,
                tempForm
              )
              logger.info(
                'Stored job result in temp form manager for future access'
              )
            } catch (error) {
              logger.warn('Could not store in temp form manager', {
                error: error instanceof Error ? error.message : String(error)
              })
            }
          }
        }

        if (!tempForm) {
          logger.warn(
            'No form found in temp manager or job status, redirecting to describe'
          )
          return h.redirect('/create/ai-describe')
        }

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
          formDefinition: tempForm.formDefinition,
          metadata: tempForm.metadata,
          stats: {
            pageCount: tempForm.formDefinition.pages?.length ?? 0,
            componentCount:
              tempForm.formDefinition.pages?.reduce(
                (count, page) => count + (page.components?.length ?? 0),
                0
              ) ?? 0,
            conditionCount: tempForm.formDefinition.conditions?.length ?? 0,
            listCount: tempForm.formDefinition.lists?.length ?? 0
          },
          isRegenerated: request.query.regenerated === true,
          originalDescription: tempForm.description
        }

        return h.view('forms/ai-create/review', viewModel)
      } catch (error) {
        logger.error('AI review GET failed', {
          error: error instanceof Error ? error.message : String(error)
        })

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
  {
    method: 'POST',
    path: ROUTE_PATH_CREATE_AI_REVIEW,
    options: {
      validate: {
        payload: reviewActionSchema,
        failAction: (request, h, error) => {
          return h
            .view('forms/ai-create/review', {
              pageTitle: 'Review your AI-generated form',
              formErrors: buildErrorDetails(error),
              ...request.payload
            })
            .code(StatusCodes.BAD_REQUEST)
            .takeover()
        }
      }
    },
    handler: async (request, h) => {
      try {
        logger.info('🚀 AI review POST handler started', {
          action: request.payload?.action,
          hasPayload: !!request.payload,
          userId: request.auth?.credentials?.user?.id
        })

        const { yar } = request
        const { action, feedback } = request.payload
        const metadata = yar.get(sessionNames.create)

        logger.info('📋 Session metadata check', {
          hasMetadata: !!metadata,
          metadata: metadata
            ? {
                title: metadata.title,
                organisation: metadata.organisation,
                teamName: metadata.teamName,
                aiJobId: metadata.aiJobId,
                hasFormDescription: !!metadata.formDescription
              }
            : null
        })

        if (!metadata) {
          logger.warn('❌ No metadata found in session, redirecting to /create')
          return h.redirect('/create')
        }

        // Check if we have all required metadata (from new flow)
        if (
          !metadata.organisation ||
          !metadata.teamName ||
          !metadata.teamEmail
        ) {
          logger.warn(
            '❌ Incomplete metadata (missing org/team), redirecting to start flow properly',
            {
              hasOrganisation: !!metadata.organisation,
              hasTeamName: !!metadata.teamName,
              hasTeamEmail: !!metadata.teamEmail
            }
          )

          // Clear the old session and start fresh
          yar.clear(sessionNames.create)
          return h.redirect('/create')
        }

        logger.info('🔍 Getting AI service from server.app')
        const aiService = request.server.app.aiService
        if (!aiService) {
          logger.error('❌ AI service not available on server.app')
          throw new Error('AI service not available')
        }
        logger.info('✅ AI service found successfully')

        switch (action) {
          case 'approve':
            logger.info('✅ Processing APPROVE action')

            // Save the AI-generated form
            logger.info('🔍 Getting temp form from AI service')
            const tempForm =
              await aiService.components.tempFormManager.getTempForm(
                request.yar.id
              )

            logger.info('📋 Temp form check', {
              hasTempForm: !!tempForm,
              tempFormKeys: tempForm ? Object.keys(tempForm) : null,
              hasFormDefinition: tempForm?.formDefinition ? true : false,
              formDefinitionKeys: tempForm?.formDefinition
                ? Object.keys(tempForm.formDefinition)
                : null
            })

            if (!tempForm) {
              logger.warn('❌ No temp form found, redirecting to describe')
              return h.redirect('/create/ai-describe')
            }

            // Create the form using existing forms service
            const formDefinition = tempForm.formDefinition
            formDefinition.name = metadata.title

            logger.info('📝 Creating new form with metadata', {
              title: metadata.title,
              organisation: metadata.organisation,
              teamName: metadata.teamName,
              teamEmail: metadata.teamEmail,
              hasToken: !!request.auth.credentials.token
            })

            // First create empty form with metadata
            const newForm = await forms.create(
              {
                title: metadata.title,
                organisation: metadata.organisation,
                teamName: metadata.teamName,
                teamEmail: metadata.teamEmail
              },
              request.auth.credentials.token
            )

            logger.info('✅ Empty form created successfully', {
              formId: newForm.id,
              slug: newForm.slug
            })

            // Then update the draft definition with AI-generated content
            logger.info('📝 Updating draft form definition')
            await forms.updateDraftFormDefinition(
              newForm.id,
              formDefinition,
              request.auth.credentials.token
            )

            logger.info('✅ Draft form definition updated successfully')

            // Clear temporary form
            logger.info('🧹 Cleaning up temp form')
            await aiService.components.tempFormManager.deleteTempForm(
              request.yar.id
            )

            // Clear session data
            yar.clear(sessionNames.create)

            logger.info('AI-generated form saved successfully', {
              formId: newForm.id,
              title: metadata.title
            })

            return h.redirect(formOverviewPath(newForm.slug))

          case 'regenerate':
            logger.info('🔄 Processing REGENERATE action')

            // Regenerate form with feedback
            await aiService.generateForm(feedback, {}, request.yar.id)

            logger.info('AI form regenerated', {
              sessionId: request.yar.id,
              feedbackLength: feedback.length
            })

            return h.redirect(ROUTE_PATH_CREATE_AI_REVIEW + '?regenerated=true')

          case 'edit-manually':
            logger.info('✏️ Processing EDIT-MANUALLY action')

            // Redirect to manual editor with AI form as starting point
            const tempFormForEdit =
              await aiService.components.tempFormManager.getTempForm(
                request.yar.id
              )

            if (tempFormForEdit) {
              // First create empty form with metadata
              const draftForm = await forms.create(
                {
                  title: metadata.title,
                  organisation: metadata.organisation,
                  teamName: metadata.teamName,
                  teamEmail: metadata.teamEmail
                },
                request.auth.credentials.token
              )

              // Then update the draft definition with AI-generated content
              await forms.updateDraftFormDefinition(
                draftForm.id,
                tempFormForEdit.formDefinition,
                request.auth.credentials.token
              )

              // Clear temporary form
              await aiService.components.tempFormManager.deleteTempForm(
                request.yar.id
              )
              yar.clear(sessionNames.create)

              return h.redirect(formOverviewPath(draftForm.slug))
            }

            logger.warn('❌ No temp form found, redirecting to /create')
            return h.redirect('/create')

          default:
            logger.error('❌ Invalid action received', { action })
            throw new Error('Invalid action')
        }
      } catch (error) {
        logger.error('💥 AI review POST failed with detailed error', {
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack
          },
          action: request.payload?.action,
          requestInfo: {
            method: request.method,
            path: request.path,
            hasAuth: !!request.auth,
            hasCredentials: !!request.auth?.credentials,
            hasToken: !!request.auth?.credentials?.token,
            userId: request.auth?.credentials?.user?.id
          }
        })

        return h
          .view('forms/ai-create/review', {
            pageTitle: 'Review your AI-generated form',
            formErrors: [
              {
                text: 'Something went wrong. Please try again.',
                href: '#action'
              }
            ],
            ...request.payload
          })
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
      }
    }
  }
]
