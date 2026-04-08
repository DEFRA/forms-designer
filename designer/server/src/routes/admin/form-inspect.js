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
  }),

  {
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/versions`,
    async handler(request, h) {
      const { auth, params, query } = request
      const { token } = auth.credentials
      const { id } = params
      const versionId = /** @type {string | undefined} */ (query.versionId)

      if (versionId) {
        return h
          .redirect(`${ROUTE_FULL_PATH}/${id}/versions/${versionId}`)
          .code(StatusCodes.SEE_OTHER)
      }

      const navigation = buildAdminNavigation(ADMIN_TOOLS)
      const versions = await forms.listFormVersions(id, token)

      const versionItems = [
        { value: '', text: 'Select a version' },
        ...versions
          .slice()
          .sort((a, b) => b.versionNumber - a.versionNumber)
          .map((v) => ({
            value: String(v.versionNumber),
            text: `Version ${v.versionNumber} — ${new Date(v.createdAt).toLocaleString('en-GB')}`
          }))
      ]

      return h.view('admin/form-inspect-versions', {
        pageTitle: `${ADMIN_TOOLS} - form inspect - versions`,
        pageHeading: { text: ADMIN_TOOLS },
        backLink: {
          text: 'Back to form inspect',
          href: ROUTE_FULL_PATH
        },
        navigation,
        formId: id,
        tabItems: buildTabItems(id, 'versions'),
        versionItems
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  },

  {
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/versions/{versionId}`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { id, versionId } = params

      const navigation = buildAdminNavigation(ADMIN_TOOLS)
      const definition = await forms.getFormDefinitionVersion(
        id,
        Number(versionId),
        token
      )

      return h.view('admin/form-inspect-version-detail', {
        pageTitle: `${ADMIN_TOOLS} - form inspect - version ${versionId}`,
        pageHeading: { text: ADMIN_TOOLS },
        backLink: {
          text: 'Back to versions',
          href: `${ROUTE_FULL_PATH}/${id}/versions`
        },
        navigation,
        formId: id,
        versionId,
        tabItems: buildTabItems(id, 'versions'),
        definition
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  },

  {
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/definition/live`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { id } = params
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      let definition = null
      try {
        definition = await forms.getLiveFormDefinition(id, token)
      } catch (err) {
        if (
          !(
            /** @type {any} */ (
              err.isBoom &&
                /** @type {any} */ (err).output.statusCode ===
                  StatusCodes.NOT_FOUND
            )
          )
        ) {
          throw err
        }
      }

      return h.view('admin/form-inspect-detail', {
        pageTitle: `${ADMIN_TOOLS} - form inspect - live definition`,
        pageHeading: { text: ADMIN_TOOLS },
        backLink: {
          text: 'Back to form inspect',
          href: ROUTE_FULL_PATH
        },
        navigation,
        formId: id,
        tabItems: buildTabItems(id, 'live'),
        document: definition,
        inconsistencies: [],
        noDocumentMessage: 'No live definition exists for this form.'
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  },

  {
    method: 'GET',
    path: `${ROUTE_FULL_PATH}/{id}/definition/draft`,
    async handler(request, h) {
      const { auth, params } = request
      const { token } = auth.credentials
      const { id } = params
      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      let definition = null
      try {
        definition = await forms.getDraftFormDefinition(id, token)
      } catch (err) {
        if (
          !(
            /** @type {any} */ (
              err.isBoom &&
                /** @type {any} */ (err).output.statusCode ===
                  StatusCodes.NOT_FOUND
            )
          )
        ) {
          throw err
        }
      }

      return h.view('admin/form-inspect-detail', {
        pageTitle: `${ADMIN_TOOLS} - form inspect - draft definition`,
        pageHeading: { text: ADMIN_TOOLS },
        backLink: {
          text: 'Back to form inspect',
          href: ROUTE_FULL_PATH
        },
        navigation,
        formId: id,
        tabItems: buildTabItems(id, 'draft'),
        document: definition,
        inconsistencies: [],
        noDocumentMessage: 'No draft definition exists for this form.'
      })
    },
    options: {
      auth: {
        mode: 'required',
        access: { entity: 'user', scope: [`+${Scopes.FormsInspect}`] }
      }
    }
  },

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

      const navigation = buildAdminNavigation(ADMIN_TOOLS)

      const [metadata, versions] = await Promise.all([
        forms.getFormById(id, token),
        forms.listFormVersions(id, token)
      ])

      const versionNumbersInDocs = new Set(versions.map((v) => v.versionNumber))
      const inconsistencies = (metadata.versions ?? [])
        .filter((v) => !versionNumbersInDocs.has(v.versionNumber))
        .map(
          (v) =>
            `Version ${v.versionNumber} is listed in metadata but has no matching document in the versions collection`
        )

      return h.view('admin/form-inspect-detail', {
        pageTitle: `${ADMIN_TOOLS} - form inspect - metadata`,
        pageHeading: { text: ADMIN_TOOLS },
        backLink: {
          text: 'Back to form inspect',
          href: ROUTE_FULL_PATH
        },
        navigation,
        formId: id,
        activeTab: 'metadata',
        tabItems: buildTabItems(id, 'metadata'),
        document: metadata,
        inconsistencies,
        noDocumentMessage: null
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
