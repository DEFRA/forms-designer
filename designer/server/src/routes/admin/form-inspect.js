import { Scopes } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { createJoiError } from '~/src/lib/error-boom-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'

export const ROUTE_FULL_PATH = '/admin/form-inspect'

const ADMIN_TOOLS = 'Admin tools'

export function generateTitling() {
  return {
    pageTitle: `${ADMIN_TOOLS} - form inspect`,
    pageHeading: { text: ADMIN_TOOLS },
    backLink: {
      text: 'Back to admin tools home',
      href: '/admin/index'
    }
  }
}

/**
 * Build tab items for the detail pages
 * @param {string} formId
 * @param {string} activeTab
 */
export function buildTabItems(formId, activeTab) {
  return [
    {
      label: 'Metadata',
      href: `${ROUTE_FULL_PATH}/${formId}/metadata`,
      active: activeTab === 'metadata'
    },
    {
      label: 'Versions',
      href: `${ROUTE_FULL_PATH}/${formId}/versions`,
      active: activeTab === 'versions'
    },
    {
      label: 'Live definition',
      href: `${ROUTE_FULL_PATH}/${formId}/definition/live`,
      active: activeTab === 'live'
    },
    {
      label: 'Draft definition',
      href: `${ROUTE_FULL_PATH}/${formId}/definition/draft`,
      active: activeTab === 'draft'
    }
  ]
}

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: ROUTE_FULL_PATH,
    handler(request, h) {
      const { yar } = request
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const validation = yar
        .flash(sessionNames.validationFailure.formInspect)
        .at(0)

      const { formValues, formErrors } = validation ?? {}

      return h.view('admin/form-inspect', {
        ...generateTitling(),
        navigation,
        errorList: buildErrorList(formErrors, ['id', 'slug']),
        formErrors,
        formValues
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Payload: { type: string, id: string, slug: string } }>}
   */
  ({
    method: 'POST',
    path: ROUTE_FULL_PATH,
    async handler(request, h) {
      const { auth, payload } = request
      const { token } = auth.credentials
      const id = payload.id.trim()
      const slug = payload.slug.trim()

      if (id) {
        return h
          .redirect(`${ROUTE_FULL_PATH}/${id}/metadata`)
          .code(StatusCodes.SEE_OTHER)
      }

      if (slug) {
        try {
          const form = await forms.get(slug, token)
          return h
            .redirect(`${ROUTE_FULL_PATH}/${form.id}/metadata`)
            .code(StatusCodes.SEE_OTHER)
        } catch (err) {
          if (
            /** @type {any} */ (err).isBoom &&
            /** @type {any} */ (err).output.statusCode === StatusCodes.NOT_FOUND
          ) {
            const joiError = createJoiError(
              'slug',
              `No form found with slug '${slug}'`
            )
            return redirectWithErrors(
              request,
              h,
              joiError,
              sessionNames.validationFailure.formInspect
            )
          }
          throw err
        }
      }

      const joiError = createJoiError('id', 'Enter a form ID or slug')
      return redirectWithErrors(
        request,
        h,
        joiError,
        sessionNames.validationFailure.formInspect
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      },
      validate: {
        payload: Joi.object({
          type: Joi.string().allow('').default(''),
          id: Joi.string().allow('').default(''),
          slug: Joi.string().allow('').default('')
        })
      }
    }
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
