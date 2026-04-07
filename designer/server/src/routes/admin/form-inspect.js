import { Scopes } from '@defra/forms-model'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'

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
  })
]

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
