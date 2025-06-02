import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import * as notifications from '~/src/common/constants/notifications.js'
import * as scopes from '~/src/common/constants/scopes.js'
import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildSimpleErrorList } from '~/src/common/helpers/build-error-details.js'
import * as forms from '~/src/lib/forms.js'
import * as formLifecycle from '~/src/models/forms/form-lifecycle.js'
import { formOverviewPath, formsLibraryPath } from '~/src/models/links.js'

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
          scope: [`+${scopes.SCOPE_WRITE}`]
        }
      }
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
          yar.flash(sessionNames.errorList, buildSimpleErrorList([err.message]))

          return h.redirect(`${formOverviewPath(form.slug)}/make-draft-live`)
        }

        throw err
      }
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
      await forms.createDraft(form.id, token)

      yar.flash(
        sessionNames.successNotification,
        notifications.FORM_DRAFT_CREATED
      )

      return h.redirect(formOverviewPath(slug))
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
          scope: [`+${scopes.SCOPE_WRITE}`]
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
        // Currently we don't support leaving the metadata widowed with no form definitions.
        // Deleting a draft also deletes the form itself (as long as the form hasn't gone live).
        await forms.deleteForm(form.id, token)

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

        throw err
      }
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
  })
]

/**
 * @import { FormBySlugInput } from '@defra/forms-model'
 * @import { ServerRoute } from '@hapi/hapi'
 */
