import { randomUUID } from 'node:crypto'
import Stream from 'stream'

import { FormDefinitionError, getConditionV2 } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { addCondition } from '~/src/lib/editor.js'
import {
  createJoiError,
  isInvalidFormErrorType
} from '~/src/lib/error-boom-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import {
  getConditionSessionState,
  setConditionSessionState
} from '~/src/lib/session-helper.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import { editorFormPath } from '~/src/models/links.js'

/**
 * @param {Yar} yar
 * @param {string} stateId
 * @param {FormDefinition} definition
 * @param {string} conditionId
 * @returns {ConditionSessionState}
 */
export function buildSessionState(yar, stateId, definition, conditionId) {
  const state = getConditionSessionState(yar, stateId)
  const isNew = conditionId && conditionId !== 'new'
  const foundCondition = isNew
    ? getConditionV2(definition, conditionId)
    : undefined
  if (!state?.id) {
    const newState = {
      id: conditionId,
      stateId,
      conditionWrapper: isNew
        ? foundCondition
        : /** @type {ConditionWrapperV2} */ ({
            id: randomUUID(),
            items: [{ id: randomUUID() }]
          })
    }
    setConditionSessionState(yar, stateId, newState)
    return newState
  }
  return state
}

/**
 * @param {Yar} yar
 * @param {{ coordinator?: Coordinator, displayName?: string }} payload
 * @param {string} stateId
 * @param {Partial<ConditionDataV2>[]} items
 */
export function saveSessionState(yar, payload, stateId, items) {
  const { coordinator, displayName } = payload
  const state = getConditionSessionState(yar, stateId)
  const newState = {
    ...state,
    conditionWrapper: {
      ...state?.conditionWrapper,
      items,
      displayName,
      coordinator
    }
  }

  // @ts-expect-error - dynamic parse so enforcing type is problematic
  setConditionSessionState(yar, stateId, newState)
}

/**
 * Process schema error messages to add a suffix to condition item errors
 * @param { Error | undefined } error
 */
export function processErrorMessages(error) {
  if (Joi.isError(error)) {
    error.details.forEach((err) => {
      if (err.path.length > 1) {
        // Period, unit and direction need extra attention
        if (err.context?.key === 'period') {
          err.message = `${err.message} period`
        }
        if (err.context?.key === 'unit') {
          err.message = `${err.message} unit`
        }
        if (err.context?.key === 'direction') {
          err.message = `${err.message} direction`
        }

        // Must be that part of a condition item is in
        // error so we append a "for condition X" suffix
        const idx = err.path.at(1)
        if (typeof idx === 'number' && idx > 0) {
          err.message = `${err.message} for additional condition ${idx}`
        }
      }
    })
  }
}

/**
 * @param {Request<{ Params: { slug: string; conditionId: string; stateId: string; }; Payload: ConditionWrapperV2; }>} request
 * @param {ResponseToolkit<{ Params: { slug: string; conditionId: string; stateId: string; }; Payload: ConditionWrapperV2; }>} h
 * @param {ConditionPostHandlerOptions} options
 */
export async function conditionPostHandlerSuccessAction(request, h, options) {
  const { auth, params, payload, yar } = request
  const { slug, conditionId, stateId } = params
  const { token } = auth.credentials
  // eslint-disable-next-line @typescript-eslint/no-useless-default-assignment
  const { items = [] } = payload

  const metadata = await forms.get(slug, token)

  if (conditionId !== 'new' && options.showCheckChanges) {
    saveSessionState(yar, payload, stateId, items)

    // Redirect user to 'check changes' screen
    return h
      .redirect(
        editorFormPath(
          slug,
          `condition-check-changes/${conditionId}/${stateId}`
        )
      )
      .code(StatusCodes.SEE_OTHER)
      .takeover()
  }

  try {
    await addCondition(metadata.id, token, payload)

    yar.flash(sessionNames.successNotification, CHANGES_SAVED_SUCCESSFULLY)

    return h
      .redirect(editorFormPath(slug, options.redirectUrl))
      .code(StatusCodes.SEE_OTHER)
  } catch (err) {
    if (
      isInvalidFormErrorType(
        err,
        FormDefinitionError.UniqueConditionDisplayName
      )
    ) {
      const joiErr = createJoiError('displayName', 'Duplicate condition name')

      return redirectWithErrors(
        request,
        h,
        joiErr,
        options.errorSessionKey,
        '#'
      )
    }

    throw err
  }
}

/**
 * @param {Request<ReqRefDefaults>} request
 * @param {ResponseToolkit<ReqRefDefaults>} h
 * @param { Error | undefined } error
 * @param {ConditionPostHandlerOptions} options
 */
export function conditionPostHandlerFailAction(request, h, error, options) {
  // Guard for type safety
  if (
    typeof request.payload !== 'object' ||
    request.payload instanceof Stream ||
    Buffer.isBuffer(request.payload)
  ) {
    throw Boom.badRequest('Unexpected payload data in conditions fail action')
  }

  /**
   *  @type {ConditionWrapperPayload}
   */
  const payload = request.payload
  const { params, yar } = request
  const { slug, stateId } = params
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
      .redirect(editorFormPath(slug, options.redirectUrl))
      .code(StatusCodes.SEE_OTHER)
      .takeover()
  } else {
    saveSessionState(yar, payload, stateId, items)

    processErrorMessages(error)

    return redirectWithErrors(request, h, error, options.errorSessionKey)
  }
}

/**
 * @typedef {{ redirectUrl: string; showCheckChanges?: boolean; errorSessionKey: ValidationSessionKey }} ConditionPostHandlerOptions
 */

/**
 * @import { Coordinator, ConditionDataV2, ConditionSessionState, ConditionWrapperV2, FormDefinition } from '@defra/forms-model'
 * @import { Request, ReqRefDefaults, ResponseToolkit } from '@hapi/hapi'
 * @import { ValidationSessionKey, Yar } from '@hapi/yar'
 * @import { ConditionWrapperPayload } from '~/src/models/forms/editor-v2/condition-helper.js'
 */
