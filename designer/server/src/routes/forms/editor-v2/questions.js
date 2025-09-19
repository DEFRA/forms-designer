import {
  MAX_NUMBER_OF_REPEAT_ITEMS,
  MIN_NUMBER_OF_REPEAT_ITEMS,
  Scopes,
  guidanceTextSchema,
  maxItemsSchema,
  minItemsSchema,
  pageHeadingAndGuidanceSchema,
  pageHeadingSchema,
  questionSetNameSchema,
  repeaterSchema
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { reorderQuestions, setPageSettings } from '~/src/lib/editor.js'
import { checkBoomError } from '~/src/lib/error-boom-helper.js'
import {
  getValidationErrorsFromSession,
  pageTitleError
} from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'
import {
  getFormComponentsCount,
  getPageFromDefinition,
  isCheckboxSelected
} from '~/src/lib/utils.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import {
  getFocus,
  repositionItem
} from '~/src/models/forms/editor-v2/pages-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/questions.js'
import { editorv2Path } from '~/src/models/links.js'
import {
  customItemOrder,
  mergeMissingComponentsIntoOrder
} from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_FULL_PATH_QUESTIONS = `/library/{slug}/editor-v2/page/{pageId}/questions`

export const ROUTE_PATH_QUESTION_DETAILS =
  '/library/{slug}/editor-v2/page/{pageId}/question/{questionId}'

const errorKey = sessionNames.validationFailure.editorQuestions
const reorderQuestionsKey = sessionNames.reorderQuestions

export const schema = Joi.object().keys({
  pageHeadingAndGuidance: pageHeadingAndGuidanceSchema,
  pageHeading: Joi.when('pageHeadingAndGuidance', {
    is: 'true',
    then: pageHeadingSchema.required().messages({
      '*': 'Enter a page heading'
    })
  }),
  guidanceText: guidanceTextSchema.optional().allow(''),
  repeater: repeaterSchema,
  minItems: minItemsSchema.when('repeater', {
    is: 'true',
    then: Joi.required().messages({
      'any.required':
        'Enter the minimum number of times someone can answer these questions',
      'number.min': `Enter a number greater than or equal to ${MIN_NUMBER_OF_REPEAT_ITEMS}`
    })
  }),
  maxItems: maxItemsSchema.when('repeater', {
    is: 'true',
    then: Joi.number()
      .min(Joi.ref('minItems'))
      .required()
      .messages({
        'any.required':
          'Enter the maximum number of times someone can answer these questions',
        'number.min':
          'The maximum number cannot be lower than the minimum number',
        'number.max': `Enter a number less than or equal to ${MAX_NUMBER_OF_REPEAT_ITEMS}`
      })
  }),
  questionSetName: questionSetNameSchema.when('repeater', {
    is: 'true',
    then: Joi.required().messages({
      'string.empty': 'Enter a name for this set of questions'
    }),
    otherwise: Joi.allow('')
  }),
  saveReorder: Joi.boolean().default(false).optional(),
  movement: Joi.string().optional(),
  itemOrder: Joi.any().custom(customItemOrder)
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, questionId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_QUESTIONS,
    async handler(request, h) {
      const { yar } = request
      const { params, auth, query } = request
      const { token } = auth.credentials
      const { slug, pageId } = /** @type {{ slug: string, pageId: string }} */ (
        params
      )
      const { action, focus } =
        /** @type {{ action: string, focus: string }} */ (query)

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)
      const focusObj = getFocus(focus)
      const validation = getValidationErrorsFromSession(yar, errorKey)

      // Question reorder
      const questionOrder = getFlashFromSession(yar, reorderQuestionsKey)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(sessionNames.successNotification).at(0)
      )

      return h.view(
        'forms/editor-v2/questions',
        viewModel.questionsViewModel(
          metadata,
          definition,
          pageId,
          {
            questionOrder,
            action,
            focus: focusObj
          },
          validation,
          notification
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormRead}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string }, Payload: Pick<FormEditorInputPageSettings, 'pageHeadingAndGuidance' | 'pageHeading' | 'movement' | 'itemOrder' | 'saveReorder'> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_QUESTIONS,
    async handler(request, h) {
      const { params, auth, payload, yar, query } = request
      const { slug, pageId } = params
      const { action } = query
      const { token } = auth.credentials
      const { movement, itemOrder, saveReorder } =
        /** @type {{ movement: string, itemOrder: string[], saveReorder: boolean}} */ (
          payload
        )

      // Form metadata and page components
      const metadata = await forms.get(slug, token)
      const definition = await forms.getDraftFormDefinition(metadata.id, token)
      const page = getPageFromDefinition(definition, pageId)

      if (!page) {
        throw Boom.notFound(`Page with id '${pageId}' not found`)
      }

      if (saveReorder) {
        mergeMissingComponentsIntoOrder(page, itemOrder)
        await reorderQuestions(metadata.id, token, pageId, itemOrder)
        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)
        yar.clear(reorderQuestionsKey)

        return h
          .redirect(editorv2Path(slug, `page/${pageId}/questions`))
          .code(StatusCodes.SEE_OTHER)
          .takeover()
      }

      if (movement) {
        const [direction, itemId] = movement.split('|')

        const newQuestionOrder = repositionItem(
          itemOrder,
          direction,
          itemId
        ).join(',')

        setFlashInSession(yar, reorderQuestionsKey, newQuestionOrder)

        return h
          .redirect(
            editorv2Path(
              slug,
              `page/${pageId}/questions?action=reorder&focus=${movement}`
            )
          )
          .code(StatusCodes.SEE_OTHER)
      }

      const isExpanded = isCheckboxSelected(payload.pageHeadingAndGuidance)

      try {
        // Save re-order (if in reorder mode) in case user pressed the main 'Save changes' button
        // as opposed to the reorder 'Save changes' button
        if (action === 'reorder') {
          mergeMissingComponentsIntoOrder(page, itemOrder)
          await reorderQuestions(metadata.id, token, pageId, itemOrder)
        }

        // Ensure there's a page title when multiple questions exist
        if (
          (!isExpanded || !payload.pageHeading) &&
          getFormComponentsCount(page) > 1
        ) {
          return redirectWithErrors(
            request,
            h,
            pageTitleError(),
            sessionNames.validationFailure.editorQuestions
          )
        }

        await setPageSettings(metadata.id, token, pageId, definition, payload)

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        // Redirect to same page
        return h
          .redirect(editorv2Path(slug, `page/${pageId}/questions`))
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        const error = checkBoomError(/** @type {Boom.Boom} */ (err), errorKey)
        if (error) {
          return redirectWithErrors(request, h, error, errorKey, '#')
        }
        throw err
      }
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          if (error && error instanceof Joi.ValidationError) {
            // Filter out "ref" errors
            error.details = error.details.filter(
              (err) => err.type !== 'any.ref'
            )
          }

          return redirectWithErrors(request, h, error, errorKey)
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
  })
]

/**
 * @import { FormEditorInputPageSettings } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
