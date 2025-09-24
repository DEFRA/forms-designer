import { Scopes } from '@defra/forms-model'
import Boom from '@hapi/boom'

import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'

/**
 * Pre-handler to check if user management features are available
 */
export const checkUserManagementAccess = [
  {
    method: /** @param {Request} _request */ (_request) => {
      if (!config.featureFlagUseEntitlementApi) {
        throw Boom.forbidden('User management is not available')
      }
      return true
    }
  }
]

/**
 * @param {string} slug
 * @param {FormMetadata} metadata
 * @param {string} headingText
 * @param {string} [contentHtml]
 */
export function createErrorPageModel(
  slug,
  metadata,
  headingText,
  contentHtml = undefined
) {
  return {
    pageHeading: {
      classes: 'govuk-heading-xl',
      text: headingText
    },
    pageTitle: `${headingText} - ${metadata.title}`,
    contentHtml,
    backLink: {
      text: 'Back to form overview',
      href: `/library/${slug}`
    }
  }
}

/**
 * Pre-handler to check if user has permission to change metadata on form
 */
export const protectMetadataEditOfLiveForm = [
  {
    method:
      /**
       * @param {Request<{ Params: { slug: string }, Payload: any }> | Request<{ Params: FormBySlugInput }>} request
       * @param {ResponseToolkit | ResponseToolkit<{ Params: FormBySlugInput }> | ResponseToolkit<{ Params: { slug: string; }; Payload: any }>} h
       */
      async (request, h) => {
        const { credentials } = request.auth
        const { auth } = request
        const { token } = auth.credentials

        const slug = request.params.slug
        const metadata = await forms.get(slug, token)

        if (
          !credentials.scope?.includes(Scopes.FormPublish) &&
          metadata.live?.updatedAt
        ) {
          if (!request.url.pathname.endsWith('make-draft-live')) {
            return h
              .view(
                'generic-error',
                createErrorPageModel(
                  slug,
                  metadata,
                  'You cannot change these answers',
                  '<p class="govuk-body">Changes go straight to the live form. Only certain roles, like admin or publisher, can make changes.</p>'
                )
              )
              .takeover()
          }

          return h
            .view(
              'generic-error',
              createErrorPageModel(slug, metadata, 'You cannot publish a form')
            )
            .takeover()
        }
        return true
      }
  }
]

/**
 * @import { FormBySlugInput, FormMetadata } from '@defra/forms-model'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
