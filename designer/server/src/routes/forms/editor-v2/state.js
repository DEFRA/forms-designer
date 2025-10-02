import { Scopes, getErrorMessage } from '@defra/forms-model'
import Joi from 'joi'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'

export const ROUTE_FULL_PATH = `/library/{slug}/editor-v2/state/{stateId}`

const logger = createLogger()

export const schema = Joi.object().keys({
  listItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string()
          .trim()
          .uuid()
          .optional()
          .description('Unique identifier for the list item'),
        text: Joi.string()
          .trim()
          .optional()
          .description('Display text for the list item'),
        hint: Joi.object({
          text: Joi.string()
            .trim()
            .optional()
            .description('Hint text for the list item')
        }).optional(),
        value: Joi.string()
          .trim()
          .optional()
          .description('Option value for the list item')
      })
    )
    .required()
})

// Updates session state - used in JS edit/reorder of radios/checkboxes for example
export default [
  /**
   * @satisfies {ServerRoute<{ Payload: Partial<QuestionSessionState> }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH,
    handler(request, h) {
      const { params, payload, yar } = request
      const { stateId } = /** @type {{ stateId: string }} */ (params)

      const state = getQuestionSessionState(yar, stateId)
      if (!state?.questionType) {
        throw new Error(
          'Invalid session contents when trying to save list entries in session'
        )
      }

      const newState = /** @type {QuestionSessionState} */ ({
        ...state,
        listItems: payload.listItems ?? []
      })

      setQuestionSessionState(yar, stateId, newState)

      return h.response('ok')
    },
    options: {
      validate: {
        payload: schema,
        failAction: (_request, h, err) => {
          logger.error(
            err,
            'Invalid session contents when trying to save list entries in session'
          )
          return h.response(`error: ${getErrorMessage(err)}`).takeover()
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
 * @import { QuestionSessionState } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
