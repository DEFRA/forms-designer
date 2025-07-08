import { randomUUID } from 'crypto'
import Stream from 'node:stream'

import {
  FormDefinitionError,
  conditionDataSchemaV2,
  conditionWrapperSchemaV2,
  slugSchema
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  createJoiError,
  isInvalidFormErrorType
} from '~/src/lib/error-boom-helper.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import * as viewModel from '~/src/models/forms/editor-v2/conditions-join.js'
import { editorFormPath } from '~/src/models/links.js'
import {
  processErrorMessages,
  saveSessionState
} from '~/src/routes/forms/editor-v2/condition-helper.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_PATH = `/library/{slug}/editor-v2/conditions-join`

const errorKey = sessionNames.validationFailure.editorCondition
const notificationKey = sessionNames.successNotification

const idSchema = Joi.string().uuid().allow('new').required()
const stateIdSchema = Joi.string().optional()
const componentIdSchema = conditionDataSchemaV2.extract('componentId')
const operatorSchema = conditionDataSchemaV2.extract('operator')
const valueSchema = conditionDataSchemaV2.extract('value')
const typeSchema = conditionDataSchemaV2.extract('type')

// const conditionsSchema = Joi.object({
//   action: Joi.string().valid('join').required(),
//   multiSelectCondition: Joi.array()
//     .min(2)
//     .items(Joi.string())
//     .required()
//     .messages({
//       '*': 'Select at least 2 conditions to join'
//     })
// })

/**
 * @type {Joi.ObjectSchema<ConditionWrapperPayload>}
 * Custom condition wrapper payload schema that
 * only allows conditions, not condition references.
 *
 * There is a dependency chain in the validation of each condition item:
 * - Condition operator is only required once a componentId has been selected
 * - Condition value is only required once a valid operator has been selected
 * Given this, we don't want to surface errors to the user for operator and
 * value before their dependent fields are valid hence the use of `joi.when` below
 */
const conditionWrapperSchema = conditionWrapperSchemaV2.keys({
  coordinator: conditionWrapperSchemaV2.extract('coordinator').messages({
    'any.required': 'Choose how you want to combine conditions'
  }),
  items: Joi.array().items(
    conditionDataSchemaV2.keys({
      componentId: componentIdSchema.messages({
        '*': 'Select a question'
      }),
      operator: operatorSchema
        .when('componentId', {
          not: componentIdSchema,
          then: Joi.optional() // Only validate the operator if the componentId is valid
        })
        .messages({
          '*': 'Select a condition type'
        }),
      type: typeSchema
        .when('operator', {
          not: operatorSchema,
          then: Joi.optional() // Only validate the value if the operator is valid
        })
        .messages({
          '*': 'Enter a condition value type'
        }),
      value: valueSchema
        .when('operator', {
          not: operatorSchema,
          then: Joi.optional() // Only validate the value if the operator is valid
        })
        .messages({
          '*': 'Enter a condition value',
          'date.format': 'Enter a condition value in the correct format'
        })
    })
  ),
  displayName: conditionWrapperSchemaV2.extract('displayName').messages({
    'string.empty': 'Enter condition name'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH,
    async handler(request, h) {
      const { yar } = request
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      // Get form metadata and definition
      const { metadata, definition } = await getForm(slug, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/conditions-join',
        viewModel.conditionsJoinViewModel(
          metadata,
          definition,
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
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      },
      validate: {
        params: Joi.object().keys({
          slug: slugSchema,
          conditionId: idSchema.optional(),
          stateId: stateIdSchema
        })
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: ConditionWrapperV2 }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH,
    async handler(request, h) {
      const { auth, params, /* payload, */ yar } = request
      const { slug } = params
      const { token } = auth.credentials
      // const { items = [] } = payload

      await forms.get(slug, token)

      try {
        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        // Redirect to conditions list page
        return h
          .redirect(editorFormPath(slug, `conditions`))
          .code(StatusCodes.SEE_OTHER)
      } catch (err) {
        if (
          isInvalidFormErrorType(
            err,
            FormDefinitionError.UniqueConditionDisplayName
          )
        ) {
          const joiErr = createJoiError(
            'displayName',
            'Duplicate condition name'
          )

          return redirectWithErrors(request, h, joiErr, errorKey, '#')
        }

        throw err
      }
    },
    options: {
      validate: {
        // Ensure any submits from buttons other than 'Save condition' flow into the failAction handler
        payload: conditionWrapperSchema.append({
          action: Joi.forbidden(),
          removeAction: Joi.forbidden()
        }),
        failAction: (request, h, error) => {
          // When the user clicks any button apart form 'Save condition', the processing should hit this section.

          // Guard for type safety
          if (
            typeof request.payload !== 'object' ||
            request.payload instanceof Stream ||
            Buffer.isBuffer(request.payload)
          ) {
            throw Boom.badRequest(
              'Unexpected payload data in conditions fail action'
            )
          }

          /**
           *  @type {ConditionWrapperPayload}
           */
          const payload = request.payload
          const { params, yar } = request
          const { slug, conditionId, stateId } = params
          const { items = [] } = payload

          if (payload.action || payload.removeAction) {
            if (payload.action === 'addCondition') {
              items.push({ id: randomUUID() })
            } else if (payload.removeAction) {
              items.splice(Number(payload.removeAction), 1)
            } else {
              // Do nothing - clause in here to satisfy SonarCloud
            }

            saveSessionState(yar, payload, stateId, items)

            // Redirect POST to GET without resubmit on back button
            return h
              .redirect(
                editorFormPath(slug, `condition/${conditionId}/${stateId}`)
              )
              .code(StatusCodes.SEE_OTHER)
              .takeover()
          } else {
            saveSessionState(yar, payload, stateId, items)

            processErrorMessages(error)

            return redirectWithErrors(request, h, error, errorKey)
          }
        }
      },
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
    }
  })
]

/**
 * @typedef {Partial<Omit<ConditionWrapperV2, 'items'>> & { action?: string, removeAction?: string, items?: Partial<ConditionDataV2>[] }} ConditionWrapperPayload
 */

/**
 * @import { ConditionDataV2, ConditionWrapperV2 } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
