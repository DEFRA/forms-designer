import {
  Scopes,
  UNICODE_EMAIL_ERROR_MESSAGE,
  isDuplicateOutput,
  notificationEmailAddressSchema
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import {
  checkBoomError,
  createJoiError,
  handleInvalidFormErrors
} from '~/src/lib/error-boom-helper.js'
import {
  addErrorsToSession,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'
import { withRetry } from '~/src/lib/retry.js'
import { CHANGES_SAVED_SUCCESSFULLY } from '~/src/models/forms/editor-v2/common.js'
import {
  MAX_ADDITIONAL_EMAILS,
  latestVersion
} from '~/src/models/forms/editor-v2/email-actions.js'
import * as viewModel from '~/src/models/forms/editor-v2/email-actions.js'
import { editorv2Path } from '~/src/models/links.js'

export const ROUTE_FULL_PATH_EMAIL_ACTIONS =
  '/library/{slug}/editor-v2/email-actions'
export const ROUTE_FULL_PATH_EMAIL_ACTION =
  '/library/{slug}/editor-v2/email-actions/{index}'
export const ROUTE_FULL_PATH_EMAIL_ACTION_REMOVE =
  '/library/{slug}/editor-v2/email-actions/{index}/remove'
export const ROUTE_FULL_PATH_EMAIL_ACTIONS_REMOVE_ALL =
  '/library/{slug}/editor-v2/email-actions/remove-all'

const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

export const EMPTY_MESSAGE = 'Enter an email address'
export const INCORRECT_FORMAT_MESSAGE =
  'Enter an email address in the correct format, like name@example.gov.uk'
export const EMAIL_ADDED = 'Email address added'
export const DUPLICATE_MESSAGE =
  'This email address is already receiving the same submissions. Change the address, condition or format, or remove the duplicate.'

const EMAIL_ADDRESS_ANCHOR = '#email-address-form'
const EMAIL_ACTIONS_PATH = 'email-actions'

const errorKey = sessionNames.validationFailure.editorEmailActions
const notificationKey = sessionNames.successNotification

export const schema = Joi.object().keys({
  condition: Joi.string().trim().allow('').default(''),
  emailAddress: notificationEmailAddressSchema.required().messages({
    'string.empty': EMPTY_MESSAGE,
    'string.email': INCORRECT_FORMAT_MESSAGE,
    'string.pattern.base': INCORRECT_FORMAT_MESSAGE,
    'string.unicode': UNICODE_EMAIL_ERROR_MESSAGE
  }),
  audience: Joi.string().trim().valid('human', 'machine').default('human'),
  machineVersion: Joi.string().trim().optional()
})

const authOptions = {
  mode: /** @type {const} */ ('required'),
  access: {
    entity: /** @type {const} */ ('user'),
    scope: [`+${Scopes.FormEdit}`]
  }
}

/**
 * Turn the submitted form values into an output entry on the definition.
 * @param {EmailActionPayload} payload
 * @returns {Output}
 */
export function payloadToOutput(payload) {
  const audience = /** @type {OutputAudience} */ (payload.audience)

  return {
    emailAddress: payload.emailAddress.toLowerCase(),
    audience,
    // Human-readable submissions are always sent as the latest version
    version:
      audience === 'machine'
        ? (payload.machineVersion ?? latestVersion('machine'))
        : latestVersion('human'),
    ...(payload.condition ? { condition: payload.condition } : {})
  }
}

/**
 * The index of the output being amended or undefined when it does not exist.
 * @param {FormDefinition} definition
 * @param {string} index
 */
export function resolveIndex(definition, index) {
  const parsed = Number.parseInt(index, 10)

  if (Number.isNaN(parsed) || !(definition.outputs ?? []).at(parsed)) {
    return undefined
  }

  return parsed
}

/**
 * Reads the form metadata and draft definition, retrying transient
 * forms-manager failures.
 * @param {string} slug
 * @param {string} token
 */
async function loadForm(slug, token) {
  const metadata = await withRetry(() => forms.get(slug, token), {
    description: `Get form metadata for '${slug}'`
  })

  const definition = await withRetry(
    () => forms.getDraftFormDefinition(metadata.id, token),
    { description: `Get draft form definition for '${slug}'` }
  )

  return { metadata, definition }
}

/**
 * Saves the draft definition, retrying transient forms-manager failures.
 * @param {string} id
 * @param {FormDefinition} definition
 * @param {string} token
 */
function saveForm(id, definition, token) {
  return withRetry(
    () => forms.updateDraftFormDefinition(id, definition, token),
    { description: `Update draft form definition for '${id}'` }
  )
}

/**
 * Turns a forms-manager failure into a validation error on the page. Known
 * form definition errors are mapped to their own wording first, so the author
 * is not shown the raw schema message. Anything that is not a service error is
 * rethrown for the standard error page.
 * @param {unknown} err
 * @param {FormDefinition} definition
 * @param {string} [fieldName]
 * @returns {Joi.ValidationError}
 */
function toValidationError(err, definition, fieldName) {
  const error =
    handleInvalidFormErrors(err, definition) ??
    checkBoomError(/** @type {Boom.Boom} */ (err), errorKey, fieldName)

  if (!error) {
    throw err
  }

  return error
}

/**
 * Builds the email actions view model, optionally with one output open for
 * amending. An index that no longer exists sends the user back to the list.
 * @param {string} slug
 * @param {string} token
 * @param {Yar} yar
 * @param {string} [index]
 */
async function buildEmailActionsView(slug, token, yar, index) {
  const { metadata, definition } = await loadForm(slug, token)

  const editIndex =
    index === undefined ? undefined : resolveIndex(definition, index)

  if (index !== undefined && editIndex === undefined) {
    return undefined
  }

  const validation = getValidationErrorsFromSession(yar, errorKey)

  const [notification, notificationDetail] = /** @type {string[]} */ (
    yar.flash(notificationKey)
  )

  return viewModel.emailActionsViewModel(metadata, definition, {
    editIndex,
    validation:
      /** @type {ValidationFailure<EmailActionFormValues> | undefined} */ (
        validation
      ),
    notification,
    notificationDetail
  })
}

/**
 * Whether the submitted output repeats one already on the definition. An
 * output being amended is skipped so saving it unchanged is not a duplicate.
 * @param {FormDefinition} definition
 * @param {Output} output
 * @param {number} [editIndex] index of the output being amended, if any
 */
function isDuplicate(definition, output, editIndex) {
  return (definition.outputs ?? []).some(
    (existing, idx) => idx !== editIndex && isDuplicateOutput(existing, output)
  )
}

/**
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @param {Error} [error]
 */
function failAction(request, h, error) {
  return redirectWithErrors(request, h, error, errorKey, EMAIL_ADDRESS_ANCHOR)
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_EMAIL_ACTIONS,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials

      const model = await buildEmailActionsView(params.slug, token, yar)

      return h.view('forms/editor-v2/email-actions', model)
    },
    options: { auth: authOptions }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { slug: string, index: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_EMAIL_ACTION,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, index } = params

      const model = await buildEmailActionsView(slug, token, yar, index)

      if (!model) {
        return h
          .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
          .code(StatusCodes.SEE_OTHER)
      }

      return h.view('forms/editor-v2/email-actions', model)
    },
    options: { auth: authOptions }
  }),

  /**
   * Add a new additional email address
   * @satisfies {ServerRoute<{ Params: { slug: string }, Payload: EmailActionPayload }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_EMAIL_ACTIONS,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const { metadata, definition } = await loadForm(slug, token)

      const outputs = definition.outputs ?? []

      if (outputs.length >= MAX_ADDITIONAL_EMAILS) {
        return h
          .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
          .code(StatusCodes.SEE_OTHER)
      }

      const output = payloadToOutput(payload)

      if (isDuplicate(definition, output)) {
        return redirectWithErrors(
          request,
          h,
          createJoiError('emailAddress', DUPLICATE_MESSAGE),
          errorKey,
          EMAIL_ADDRESS_ANCHOR
        )
      }

      definition.outputs = [...outputs, output]

      try {
        await saveForm(metadata.id, definition, token)
      } catch (err) {
        return redirectWithErrors(
          request,
          h,
          toValidationError(err, definition, 'emailAddress'),
          errorKey,
          EMAIL_ADDRESS_ANCHOR
        )
      }

      yar.flash(notificationKey, EMAIL_ADDED)

      return h
        .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: { payload: schema, failAction },
      auth: authOptions
    }
  }),

  /**
   * Amend an existing additional email address
   * @satisfies {ServerRoute<{ Params: { slug: string, index: string }, Payload: EmailActionPayload }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_EMAIL_ACTION,
    async handler(request, h) {
      const { params, auth, payload, yar } = request
      const { token } = auth.credentials
      const { slug, index } = params

      const { metadata, definition } = await loadForm(slug, token)

      const editIndex = resolveIndex(definition, index)

      if (editIndex !== undefined) {
        const output = payloadToOutput(payload)

        if (isDuplicate(definition, output, editIndex)) {
          return redirectWithErrors(
            request,
            h,
            createJoiError('emailAddress', DUPLICATE_MESSAGE),
            errorKey,
            EMAIL_ADDRESS_ANCHOR
          )
        }

        const outputs = [.../** @type {Output[]} */ (definition.outputs)]
        outputs[editIndex] = output
        definition.outputs = outputs

        try {
          await saveForm(metadata.id, definition, token)
        } catch (err) {
          return redirectWithErrors(
            request,
            h,
            toValidationError(err, definition, 'emailAddress'),
            errorKey,
            EMAIL_ADDRESS_ANCHOR
          )
        }

        yar.flash(notificationKey, CHANGES_SAVED_SUCCESSFULLY)
      }

      return h
        .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
        .code(StatusCodes.SEE_OTHER)
    },
    options: {
      validate: { payload: schema, failAction },
      auth: authOptions
    }
  }),

  /**
   * Remove an existing additional email address
   * @satisfies {ServerRoute<{ Params: { slug: string, index: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_EMAIL_ACTION_REMOVE,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug, index } = params

      const { metadata, definition } = await loadForm(slug, token)

      const removeIndex = resolveIndex(definition, index)

      if (removeIndex !== undefined) {
        const outputs = /** @type {Output[]} */ (definition.outputs)

        // Described before the save, whilst the conditions it names are still
        // to hand
        const removed = viewModel.describeRemovedOutput(
          definition,
          outputs[removeIndex]
        )

        definition.outputs = outputs.filter(
          (_output, idx) => idx !== removeIndex
        )

        try {
          await saveForm(metadata.id, definition, token)
        } catch (err) {
          return redirectWithErrors(
            request,
            h,
            toValidationError(err, definition),
            errorKey
          )
        }

        // The second entry is shown under the banner heading, so the author can
        // see which address has gone
        yar.flash(notificationKey, CHANGES_SAVED_SUCCESSFULLY)
        yar.flash(notificationKey, removed)
      }

      return h
        .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
        .code(StatusCodes.SEE_OTHER)
    },
    options: { auth: authOptions }
  }),

  /**
   * Confirm removal of every additional email address
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH_EMAIL_ACTIONS_REMOVE_ALL,
    async handler(request, h) {
      const { params, auth } = request
      const { token } = auth.credentials
      const { slug } = params

      const { metadata, definition } = await loadForm(slug, token)

      // Nothing to confirm, eg the page was opened from a stale link
      if (!(definition.outputs ?? []).length) {
        return h
          .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
          .code(StatusCodes.SEE_OTHER)
      }

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        viewModel.removeAllEmailsViewModel(metadata, definition)
      )
    },
    options: { auth: authOptions }
  }),

  /**
   * Remove every additional email address
   * @satisfies {ServerRoute<{ Params: { slug: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH_EMAIL_ACTIONS_REMOVE_ALL,
    async handler(request, h) {
      const { params, auth, yar } = request
      const { token } = auth.credentials
      const { slug } = params

      const { metadata, definition } = await loadForm(slug, token)

      const removedCount = (definition.outputs ?? []).length

      if (removedCount) {
        definition.outputs = []

        try {
          await saveForm(metadata.id, definition, token)
        } catch (err) {
          // The confirmation page has no error summary of its own, so the
          // failure is reported back on the list
          addErrorsToSession(
            request,
            errorKey,
            toValidationError(err, definition)
          )

          return h
            .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
            .code(StatusCodes.SEE_OTHER)
        }

        // The second entry is shown under the banner heading, so the author can
        // see how many addresses have gone
        yar.flash(notificationKey, CHANGES_SAVED_SUCCESSFULLY)
        yar.flash(
          notificationKey,
          viewModel.describeRemovedAllOutputs(removedCount)
        )
      }

      return h
        .redirect(editorv2Path(slug, EMAIL_ACTIONS_PATH))
        .code(StatusCodes.SEE_OTHER)
    },
    options: { auth: authOptions }
  })
]

/**
 * @typedef {object} EmailActionPayload
 * @property {string} condition - id of the condition, or '' for every submission
 * @property {string} emailAddress - the address submissions are sent to
 * @property {string} audience - human or machine readable
 * @property {string} [machineVersion] - version selected for machine-readable output
 */

/**
 * @import { EmailActionFormValues } from '~/src/models/forms/editor-v2/email-actions.js'
 * @import { FormDefinition, Output, OutputAudience } from '@defra/forms-model'
 * @import Boom from '@hapi/boom'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 * @import { Yar } from '@hapi/yar'
 */
