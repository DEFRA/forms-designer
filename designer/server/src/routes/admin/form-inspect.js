import { Scopes } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { create } from 'jsondiffpatch'
import { format as formatDiffHtml } from 'jsondiffpatch/formatters/html'

import { sessionNames } from '~/src/common/constants/session-names.js'
import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { buildAdminNavigation } from '~/src/common/nunjucks/context/build-navigation.js'
import { createJoiError } from '~/src/lib/error-boom-helper.js'
import * as forms from '~/src/lib/forms.js'
import { redirectWithErrors } from '~/src/lib/redirect-helper.js'

/**
 * Use `id` as the primary key for object comparison where available.
 * Falls back to `path` (used on page objects) and then `name` (used on
 * components and lists). This is necessary for backwards compatibility
 * with legacy forms where `id` is optional, and because pages and
 * components share different identifying attributes.
 */
const jdp = create({
  objectHash(obj) {
    if (typeof obj === 'object') {
      const o = /** @type {Record<string, unknown>} */ (obj)
      if (o.id !== undefined) {
        return JSON.stringify(o.id)
      }
      if (typeof o.path === 'string') {
        return o.path
      }
      if (typeof o.name === 'string') {
        return o.name
      }
    }
    return JSON.stringify(obj)
  }
})

export const ROUTE_FULL_PATH = '/admin/form-inspect'

const ADMIN_TOOLS = 'Admin tools'
const BACK_TO_FORM_INSPECT = 'Back to form inspect'
const FORM_INSPECT_DETAIL = 'admin/form-inspect-detail'
const TAB_VERSION_DIFF = 'version-diff'

/**
 * Build the common view model for form inspect sub-pages.
 * Panel-specific content is passed as the second argument and merged in.
 * @param {object} common
 * @param {string} common.pageTitle
 * @param {string} common.formId
 * @param {string} common.activeTab
 * @param {{ text: string, href: string }} common.backLink
 * @param {Record<string, unknown>} [panelContent]
 */
export function getViewModel(common, panelContent = {}) {
  const { pageTitle, formId, activeTab, backLink } = common
  return {
    pageTitle,
    pageHeading: { text: ADMIN_TOOLS },
    backLink,
    navigation: buildAdminNavigation(ADMIN_TOOLS),
    formId,
    activeTab,
    tabItems: buildTabItems(formId, activeTab),
    ...panelContent
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
      label: 'Live definition',
      href: `${ROUTE_FULL_PATH}/${formId}/definition/live`,
      active: activeTab === 'live'
    },
    {
      label: 'Draft definition',
      href: `${ROUTE_FULL_PATH}/${formId}/definition/draft`,
      active: activeTab === 'draft'
    },
    {
      label: 'Versions',
      href: `${ROUTE_FULL_PATH}/${formId}/versions`,
      active: activeTab === 'versions'
    },
    {
      label: 'Version diff',
      href: `${ROUTE_FULL_PATH}/${formId}/version-diff`,
      active: activeTab === TAB_VERSION_DIFF
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
        pageTitle: `${ADMIN_TOOLS} - form inspect`,
        pageHeading: { text: ADMIN_TOOLS },
        backLink: {
          text: 'Back to admin tools home',
          href: '/admin/index'
        },
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
      const type = payload.type
      const id = payload.id.trim()
      const slug = payload.slug.trim()

      if (type === 'id' && id) {
        return h
          .redirect(`${ROUTE_FULL_PATH}/${id}/metadata`)
          .code(StatusCodes.SEE_OTHER)
      }

      if (type === 'slug' && slug) {
        try {
          const form = await forms.get(slug, token)
          return h
            .redirect(`${ROUTE_FULL_PATH}/${form.id}/metadata`)
            .code(StatusCodes.SEE_OTHER)
        } catch (err) {
          if (Boom.isBoom(err, StatusCodes.NOT_FOUND)) {
            const slugError = createJoiError(
              'slug',
              `No form found with slug '${slug}'`
            )
            return redirectWithErrors(
              request,
              h,
              slugError,
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
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { id: string }, Query: { versionId?: string } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/versions`,
    async handler(request, h) {
      const { auth, params, query } = request
      const { token } = auth.credentials
      const { id } = params
      const { versionId } = query

      if (versionId) {
        return h
          .redirect(`${ROUTE_FULL_PATH}/${id}/versions/${versionId}`)
          .code(StatusCodes.SEE_OTHER)
      }

      const versions = await forms.listFormVersions(id, token)

      const versionItems = [
        { value: '', text: 'Select a version' },
        ...versions
          .slice()
          .sort((a, b) => b.versionNumber - a.versionNumber)
          .map((v) => ({
            value: v.versionNumber,
            text: `Version ${v.versionNumber} — ${new Date(v.createdAt).toISOString()}`
          }))
      ]

      return h.view(
        'admin/form-inspect-versions',
        getViewModel(
          {
            pageTitle: `${ADMIN_TOOLS} - form inspect - versions`,
            formId: id,
            activeTab: 'versions',
            backLink: {
              text: BACK_TO_FORM_INSPECT,
              href: ROUTE_FULL_PATH
            }
          },
          { versionItems }
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { id: string, versionId: string } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/versions/{versionId}`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { id, versionId } = params

      if (versionId.includes('..')) {
        const [vA, vB] = versionId.split('..')
        const definitionA = await forms.getFormDefinitionVersion(
          id,
          Number(vA),
          token
        )
        const definitionB = await forms.getFormDefinitionVersion(
          id,
          Number(vB),
          token
        )

        const delta = jdp.diff(definitionA, definitionB)
        // Strip any <script> tags injected by jsondiffpatch to prevent XSS
        const diffHtml = formatDiffHtml(delta, definitionA).replaceAll(
          /<script[\s\S]*?<\/script>/g,
          ''
        )

        return h.view(
          'admin/form-inspect-version-diff-detail',
          getViewModel(
            {
              pageTitle: `${ADMIN_TOOLS} - form inspect - diff v${vA} → v${vB}`,
              formId: id,
              activeTab: TAB_VERSION_DIFF,
              backLink: {
                text: 'Back to version diff',
                href: `${ROUTE_FULL_PATH}/${id}/version-diff`
              }
            },
            { versionA: vA, versionB: vB, diffHtml }
          )
        )
      }

      const definition = await forms.getFormDefinitionVersion(
        id,
        Number(versionId),
        token
      )

      return h.view(
        'admin/form-inspect-version-detail',
        getViewModel(
          {
            pageTitle: `${ADMIN_TOOLS} - form inspect - version ${versionId}`,
            formId: id,
            activeTab: 'versions',
            backLink: {
              text: 'Back to versions',
              href: `${ROUTE_FULL_PATH}/${id}/versions`
            }
          },
          { versionId, definition }
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { id: string }, Query: { from?: string, to?: string } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/version-diff`,
    async handler(request, h) {
      const { auth, params, query } = request
      const { token } = auth.credentials
      const { id } = params
      const { from, to } = query

      if (from && to) {
        return h
          .redirect(`${ROUTE_FULL_PATH}/${id}/versions/${from}..${to}`)
          .code(StatusCodes.SEE_OTHER)
      }

      const versions = await forms.listFormVersions(id, token)

      const versionItems = [
        { value: '', text: 'Select a version' },
        ...versions
          .slice()
          .sort((a, b) => b.versionNumber - a.versionNumber)
          .map((v) => ({
            value: v.versionNumber,
            text: `Version ${v.versionNumber} — ${new Date(v.createdAt).toISOString()}`
          }))
      ]

      return h.view(
        'admin/form-inspect-version-diff',
        getViewModel(
          {
            pageTitle: `${ADMIN_TOOLS} - form inspect - version diff`,
            formId: id,
            activeTab: TAB_VERSION_DIFF,
            backLink: {
              text: BACK_TO_FORM_INSPECT,
              href: ROUTE_FULL_PATH
            }
          },
          { versionItems }
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { id: string } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/definition/live`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { id } = params

      let definition = null
      try {
        definition = await forms.getLiveFormDefinition(id, token)
      } catch (err) {
        if (!Boom.isBoom(err, StatusCodes.NOT_FOUND)) {
          throw err
        }
      }

      return h.view(
        FORM_INSPECT_DETAIL,
        getViewModel(
          {
            pageTitle: `${ADMIN_TOOLS} - form inspect - live definition`,
            formId: id,
            activeTab: 'live',
            backLink: {
              text: BACK_TO_FORM_INSPECT,
              href: ROUTE_FULL_PATH
            }
          },
          { document: definition }
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { id: string } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/definition/draft`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { id } = params

      let definition = null
      try {
        definition = await forms.getDraftFormDefinition(id, token)
      } catch (err) {
        if (!Boom.isBoom(err, StatusCodes.NOT_FOUND)) {
          throw err
        }
      }

      return h.view(
        FORM_INSPECT_DETAIL,
        getViewModel(
          {
            pageTitle: `${ADMIN_TOOLS} - form inspect - draft definition`,
            formId: id,
            activeTab: 'draft',
            backLink: {
              text: BACK_TO_FORM_INSPECT,
              href: ROUTE_FULL_PATH
            }
          },
          { document: definition }
        )
      )
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  }),

  /**
   * @satisfies {ServerRoute<{ Params: { id: string } }>}
   */
  ({
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/metadata`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { id } = params

      const metadata = await forms.getFormById(id, token)

      return h.view(
        FORM_INSPECT_DETAIL,
        getViewModel(
          {
            pageTitle: `${ADMIN_TOOLS} - form inspect - metadata`,
            formId: id,
            activeTab: 'metadata',
            backLink: {
              text: BACK_TO_FORM_INSPECT,
              href: ROUTE_FULL_PATH
            }
          },
          { document: metadata }
        )
      )
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
