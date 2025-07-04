import { randomUUID } from 'node:crypto'
import Stream from 'node:stream'

import { FormDefinitionError, slugSchema } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { addCondition, setPageCondition } from '~/src/lib/editor.js'
import {
  createJoiError,
  isInvalidFormErrorType
} from '~/src/lib/error-boom-helper.js'
import { getValidationErrorsFromSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  createConditionSessionState,
  getConditionSessionState
} from '~/src/lib/session-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import { conditionWrapperSchema } from '~/src/models/forms/editor-v2/condition-helper.js'
import * as viewModel from '~/src/models/forms/editor-v2/conditions.js'
import * as pageConditionsViewModel from '~/src/models/forms/editor-v2/page-conditions.js'
import { editorFormPath, editorv2Path } from '~/src/models/links.js'
import {
  buildSessionState,
  processErrorMessages,
  saveSessionState
} from '~/src/routes/forms/editor-v2/condition-helper.js'
import { getForm } from '~/src/routes/forms/editor-v2/helpers.js'

export const ROUTE_FULL_PATH_CONDITIONS = '/library/{slug}/editor-v2/conditions'
export const ROUTE_FULL_PATH_PAGE_CONDITIONS =
  '/library/{slug}/editor-v2/page/{pageId}/conditions'
export const ROUTE_FULL_PATH_PAGE_CONDITIONS_WITH_STATE =
  '/library/{slug}/editor-v2/page/{pageId}/conditions/{conditionId}/{stateId?}'

const notificationKey = sessionNames.successNotification
const errorKey = sessionNames.validationFailure.editorPageConditions

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_CONDITIONS,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      // Get form metadata and definition
      const { metadata, definition } = await getForm(slug, token)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      return h.view(
        'forms/editor-v2/conditions',
        viewModel.conditionsViewModel(metadata, definition, notification)
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
          slug: slugSchema
        })
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE_CONDITIONS,
    handler(request, h) {
      const { params, yar } = request
      const { slug, pageId } = params

      // Set up session
      const newStateId = createConditionSessionState(yar)
      return h
        .redirect(
          editorv2Path(slug, `page/${pageId}/conditions/new/${newStateId}`)
        )
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
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
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, conditionId: string, stateId: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_PAGE_CONDITIONS_WITH_STATE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, pageId, conditionId, stateId } = params

      // Set up session if not yet exists
      if (!stateId || !getConditionSessionState(yar, stateId)) {
        const newStateId = createConditionSessionState(yar)
        return h
          .redirect(
            editorv2Path(slug, `page/${pageId}/conditions/new/${newStateId}`)
          )
          .code(StatusCodes.SEE_OTHER)
      }

      const metadata = await forms.get(slug, token)
      const formId = metadata.id

      const definition = await forms.getDraftFormDefinition(formId, token)

      // Saved banner
      const notification = /** @type {string[] | undefined} */ (
        yar.flash(notificationKey).at(0)
      )

      const validation = getValidationErrorsFromSession(yar, errorKey)

      const sessionState = buildSessionState(
        yar,
        stateId,
        definition,
        conditionId
      )

      return h.view(
        'forms/editor-v2/page-conditions',
        pageConditionsViewModel.pageConditionsViewModel(
          metadata,
          definition,
          pageId,
          sessionState,
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
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, pageId: string, conditionId: string, stateId: string }, Payload: ConditionPayload }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_PAGE_CONDITIONS_WITH_STATE,
    async handler(request, h) {
      // This is the 'Save condition' submit flow
      // when the payload is fully valid

      // The process here may seem unusual - the failAction handler is used to handle most of the processing
      // when any of the buttons are clicked, except for when the final 'Save condition' submit button is clicked.
      // When clicking buttons such as 'Select' or 'Add another condition', we want the payload to fail so that
      // the process flow hits the the failAction handler below.
      // When clicking the 'Save condition' button, and the payload is valid, the processing hits this section.

      const { auth, params, payload, yar } = request
      const { slug, pageId } = params
      const { token } = auth.credentials
      const { action, conditionName, displayName } = payload

      const metadata = await forms.get(slug, token)

      try {
        if (displayName && displayName !== '') {
          const condRes = await addCondition(metadata.id, token, payload)
          await setPageCondition(metadata.id, token, pageId, condRes.id)
        } else {
          if (action === 'add' && conditionName) {
            await setPageCondition(metadata.id, token, pageId, conditionName)
          } else {
            await setPageCondition(metadata.id, token, pageId, null)
          }
        }

        yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

        return h
          .redirect(editorv2Path(slug, `page/${pageId}/conditions`))
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
          const { slug, pageId, conditionId, stateId } = params
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
                editorFormPath(
                  slug,
                  `page/${pageId}/conditions/${conditionId}/${stateId}`
                )
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
 * @typedef {ConditionWrapperPayload & { conditionName?: string }} ConditionPayload
 */

/**
 * @import { ServerRoute } from '@hapi/hapi'
 * @import { ConditionWrapperPayload } from '~/src/models/forms/editor-v2/condition-helper.js'
 */
