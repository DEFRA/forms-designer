import { OperatorName, getConditionV2, slugSchema } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  addErrorsToSession,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/condition.js'
import { editorFormPath } from '~/src/models/links.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_PATH_CONDITION = `/library/{slug}/editor-v2/condition/{conditionId?}`
export const ROUTE_PATH_CONDITION_SET_COMPONENT_ID = `/library/{slug}/editor-v2/condition/set-component/{conditionId?}`
export const ROUTE_PATH_CONDITION_SET_OPERATOR = `/library/{slug}/editor-v2/condition/set-operator/{conditionId?}`

const errorKey = sessionNames.validationFailure.editorPage
const notificationKey = sessionNames.successNotification

const idSchema = Joi.string().uuid().required()
const operatorSchema = Joi.string()
  .valid(...Object.values(OperatorName))
  .required()

export const schema = Joi.object().keys({
  componentId: idSchema.messages({
    '*': 'Select a question'
  }),
  operator: operatorSchema.messages({
    '*': 'Select a condition type'
  }),
  // value: pageTypeSchema.messages({
  //   '*': 'Enter a value'
  // }),
  // displayName: pageTypeSchema.messages({
  //   '*': 'Enter a value'
  // })
  displayName: Joi.string().required().messages({
    '*': 'Enter condition name'
  })
})

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId?: string }, Query: { componentId?: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_PATH_CONDITION,
    async handler(request, h) {
      const { yar } = request
      const { params, query, auth } = request
      const { token } = auth.credentials
      const { slug, conditionId } = params
      const { componentId } = query

      // Get form metadata and definition
      const { metadata, definition } = await getForm(slug, token)

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      const condition = conditionId
        ? getConditionV2(definition, conditionId)
        : undefined

      return h.view(
        'forms/editor-v2/condition',
        viewModel.conditionViewModel(
          metadata,
          definition,
          { selectedComponentId: componentId },
          condition,
          notification,
          validation
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
          conditionId: idSchema.optional()
        }),
        query: Joi.object().keys({
          componentId: idSchema.optional()
        })
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId?: string }, Payload: { componentId?: string, operator?: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_PATH_CONDITION,
    handler(request, h) {
      const { payload, params } = request
      const { slug, conditionId } = params
      const { componentId, operator } = payload

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(editorFormPath(slug, 'condition'))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          return redirectWithErrors(request, h, error, errorKey)
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
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, conditionId?: string }, Payload: { componentId: string } }>}
   */
  ;({
    method: 'POST',
    path: ROUTE_PATH_CONDITION_SET_COMPONENT_ID,
    handler(request, h) {
      const { payload, params } = request
      const { slug, conditionId } = params
      const { componentId } = payload

      // Redirect POST to GET without resubmit on back button
      return h
        .redirect(
          editorFormPath(
            slug,
            `condition${conditionId ? `/${conditionId}` : ''}?componentId=${componentId}`
          )
        )
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: {
        payload: Joi.object()
          .keys({
            componentId: schema.extract('componentId'),
            confirmSelectComponent: Joi.boolean().required().allow(true)
          })
          .options({ stripUnknown: true }),
        failAction: (request, h, error) => {
          const { params } = request
          const { slug, conditionId } = params

          addErrorsToSession(request, error, errorKey)

          return h
            .redirect(
              editorFormPath(
                slug,
                `condition${conditionId ? `/${conditionId}` : ''}`
              )
            )
            .code(StatusCodes.SEE_OTHER)
            .takeover()
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
  }),
    /**
     * @satisfies {ServerRoute<{ Params: { slug: string, conditionId?: string }, Payload: { operator: string }, Query: { componentId: string } }>}
     */
    ({
      method: 'POST',
      path: ROUTE_PATH_CONDITION_SET_OPERATOR,
      handler(request, h) {
        const { payload, params, query } = request
        const { slug, conditionId } = params
        const { componentId } = query
        const { operator } = payload

        // Redirect POST to GET without resubmit on back button
        return h
          .redirect(
            editorFormPath(
              slug,
              `condition${conditionId ? `/${conditionId}` : ''}?componentId=${componentId}&operator=${operator}`
            )
          )
          .code(StatusCodes.SEE_OTHER)
      },
      options: {
        validate: {
          payload: Joi.object()
            .keys({
              operator: schema.extract('operator'),
              confirmSelectOperator: Joi.boolean().required().allow(true)
            })
            .options({ stripUnknown: true }),
          failAction: (request, h, error) => {
            const { params, query } = request
            const { slug, conditionId } = params
            const { componentId } = query

            addErrorsToSession(request, error, errorKey)

            return h
              .redirect(
                editorFormPath(
                  slug,
                  `condition${conditionId ? `/${conditionId}` : ''}?componentId=${componentId}`
                )
              )
              .code(StatusCodes.SEE_OTHER)
              .takeover()
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
 * @import { ServerRoute } from '@hapi/hapi'
 */
