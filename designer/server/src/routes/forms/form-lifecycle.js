import {
  Scopes,
  getErrorMessage,
  hasPaymentQuestionInForm
} from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import * as notifications from '~/src/common/constants/notifications.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildSimpleErrorList } from '~/src/common/helpers/build-error-details.js'
import { logger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import {
  PAYMENT_LIVE_API_KEY,
  deletePaymentSecret,
  existsSecret
} from '~/src/lib/secrets.js'
import * as formLifecycle from '~/src/models/forms/form-lifecycle.js'
import { formOverviewPath, formsLibraryPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

/**
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @param {(formId: string, token: string) => Promise<unknown>} operation
 * @param {string} successMessage
 * @param {string} failureMessage
 * @param {string} notificationText
 */
async function genericFormAction(
  request,
  h,
  operation,
  successMessage,
  failureMessage,
  notificationText
) {
  const { token } = request.auth.credentials
  const { yar } = request
  const { slug } = request.params
  const form = await forms.get(slug, token)

  try {
    await operation(form.id, token)

    logger.info(`${successMessage} - form '${slug}' - formId: ${form.id}`)

    yar.flash(sessionNames.successNotification, notificationText)

    return h.redirect(formOverviewPath(slug))
  } catch (err) {
    logger.error(
      err,
      `${failureMessage} - form '${slug}' - ${getErrorMessage(err)} - formId: ${form.id}`
    )
    throw err
  }
}

export default [
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/manage-form/make-draft-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials
      const form = await forms.get(request.params.slug, token)
      const formDefinition = await forms.getDraftFormDefinition(form.id, token)

      const formPromotionValidationFailure = yar.flash(sessionNames.errorList)

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        formLifecycle.makeDraftLiveConfirmationPageViewModel(
          form,
          formDefinition,
          formPromotionValidationFailure
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
      },
      pre: [protectMetadataEditOfLiveForm]
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/manage-form/make-draft-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials

      const form = await forms.get(request.params.slug, token)

      try {
        await forms.makeDraftFormLive(form.id, token)

        // Delete payment secret if no longer in live form
        const liveKey = await existsSecret(form.id, PAYMENT_LIVE_API_KEY, token)
        if (liveKey.exists) {
          const definition = await forms.getLiveFormDefinition(form.id, token)
          if (!hasPaymentQuestionInForm(definition)) {
            await deletePaymentSecret(form.id, PAYMENT_LIVE_API_KEY, token)
          }
        }

        logger.info(
          `[formPublished] Form '${form.slug}' (${form.title}) successfully made live - formId: ${form.id}`
        )

        yar.flash(
          sessionNames.successNotification,
          notifications.FORM_LIVE_CREATED
        )

        return h.redirect(formOverviewPath(form.slug))
      } catch (err) {
        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.BAD_REQUEST.valueOf()
        ) {
          logger.info(
            `[formPublishValidationFailed] Form '${form.slug}' failed validation checks for publishing - ${err.message} - formId: ${form.id}`
          )

          yar.flash(sessionNames.errorList, buildSimpleErrorList([err.message]))

          return h.redirect(
            `${formOverviewPath(form.slug)}/manage-form/make-draft-live`
          )
        }

        logger.error(
          err,
          `[formPublishFailed] Unexpected error while making form '${form.slug}' live - ${getErrorMessage(err)} - formId: ${form.id}`
        )

        throw err
      }
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormPublish}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/manage-form/take-offline',
    async handler(request, h) {
      const { token } = request.auth.credentials
      const { slug } = request.params
      const form = await forms.get(slug, token)
      const formDefinition = await forms.getLiveFormDefinition(form.id, token)

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        formLifecycle.takeFormOfflineConfirmationPageViewModel(
          form,
          formDefinition,
          []
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormPublish}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/manage-form/make-online',
    handler(request, h) {
      return genericFormAction(
        request,
        h,
        forms.makeOnlineAgain,
        '[makeOnlineAgain] Successfully made offline form online again',
        '[makeOnlineAgainFailed] Failed to make offline form online again',
        notifications.FORM_REPUBLISH_OFFLINE
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormPublish}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/manage-form/take-offline',
    handler(request, h) {
      return genericFormAction(
        request,
        h,
        forms.takeOffline,
        '[takeOffline] Successfully took form offline',
        '[takeOfflineFailed] Failed to take form offline',
        notifications.FORM_TAKEN_OFFLINE
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormPublish}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/manage-form/create-draft-from-live',
    async handler(request, h) {
      return genericFormAction(
        request,
        h,
        forms.createDraft,
        '[draftCreated] Draft successfully created from live form',
        '[draftCreationFailed] Failed to create draft from live form',
        notifications.FORM_DRAFT_CREATED
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
  }),
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/delete-draft',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials
      const form = await forms.get(request.params.slug, token)
      const formDefinition = await forms.getDraftFormDefinition(form.id, token)

      const deletionValidationFailure = yar.flash(sessionNames.errorList)

      return h.view(
        CONFIRMATION_PAGE_VIEW,
        formLifecycle.deleteDraftConfirmationPageViewModel(
          form,
          formDefinition,
          deletionValidationFailure
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormDelete}`]
        }
      }
    }
  }),
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'POST',
    path: '/library/{slug}/delete-draft',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials

      const form = await forms.get(request.params.slug, token)
      const formDefinition = await forms.getDraftFormDefinition(form.id, token)

      try {
        // DRAFT but no LIVE
        if (!form.live) {
          // Currently we don't support leaving the metadata widowed with no form definitions.
          // Deleting a draft also deletes the form itself (as long as the form hasn't gone live).
          await forms.deleteForm(form.id, token)

          logger.info(
            `[formDeleted] Form '${form.slug}' (${form.title}) successfully deleted - formId: ${form.id}`
          )
        } else {
          // LIVE exists so only delete the DRAFT definition, not the whole form
          await forms.deleteDraftOnly(form.id, token)

          logger.info(
            `[draftDeleted] Draft for Form '${form.slug}' (${form.title}) successfully deleted - formId: ${form.id}`
          )
        }

        yar.flash(
          sessionNames.successNotification,
          notifications.FORM_DELETED_DRAFT
        )

        return h.redirect(formsLibraryPath)
      } catch (err) {
        if (
          Boom.isBoom(err) &&
          err.output.statusCode === StatusCodes.BAD_REQUEST.valueOf()
        ) {
          logger.info(
            `[formDeleteValidationFailed] Form '${form.slug}' failed validation checks for deletion - ${err.message} - formId: ${form.id}`
          )

          const errorList = buildSimpleErrorList([err.message])

          return h.view(
            CONFIRMATION_PAGE_VIEW,
            formLifecycle.deleteDraftConfirmationPageViewModel(
              form,
              formDefinition,
              errorList
            )
          )
        }

        logger.error(
          err,
          `[formDeleteFailed] Unexpected error while deleting form '${form.slug}' - ${getErrorMessage(err)} - formId: ${form.id}`
        )

        throw err
      }
    },
    options: {
      auth: {
        mode: 'required',
        access: {
          entity: 'user',
          scope: [`+${Scopes.FormDelete}`]
        }
      }
    }
  })
]

/**
 * @import { FormBySlugInput, FormMetadata } from '@defra/forms-model'
 * @import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
 */
