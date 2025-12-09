import { Scopes, getErrorMessage } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import * as notifications from '~/src/common/constants/notifications.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildSimpleErrorList } from '~/src/common/helpers/build-error-details.js'
import { createLogger } from '~/src/common/helpers/logging/logger.js'
import * as forms from '~/src/lib/forms.js'
import * as formLifecycle from '~/src/models/forms/form-lifecycle.js'
import { formOverviewPath, formsLibraryPath } from '~/src/models/links.js'
import { protectMetadataEditOfLiveForm } from '~/src/routes/forms/route-helpers.js'

const logger = createLogger()
const CONFIRMATION_PAGE_VIEW = 'forms/confirmation-page'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: FormBySlugInput }>}
   */
  ({
    method: 'GET',
    path: '/library/{slug}/make-draft-live',
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
    path: '/library/{slug}/make-draft-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials

      const form = await forms.get(request.params.slug, token)

      try {
        await forms.makeDraftFormLive(form.id, token)

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

          return h.redirect(`${formOverviewPath(form.slug)}/make-draft-live`)
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
    method: 'POST',
    path: '/library/{slug}/create-draft-from-live',
    async handler(request, h) {
      const { yar } = request
      const { token } = request.auth.credentials
      const { slug } = request.params

      const form = await forms.get(slug, token)

      try {
        await forms.createDraft(form.id, token)

        logger.info(
          `[draftCreated] Draft successfully created from live form '${slug}' - formId: ${form.id}`
        )

        yar.flash(
          sessionNames.successNotification,
          notifications.FORM_DRAFT_CREATED
        )

        return h.redirect(formOverviewPath(slug))
      } catch (err) {
        logger.error(
          err,
          `[draftCreationFailed] Failed to create draft from live form '${slug}' - ${getErrorMessage(err)} - formId: ${form.id}`
        )
        throw err
      }
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
 * @import { FormBySlugInput } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
