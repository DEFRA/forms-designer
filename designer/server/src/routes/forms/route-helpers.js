import { Scopes } from '@defra/forms-model'
import Boom from '@hapi/boom'

import { hasAdminRole } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import * as forms from '~/src/lib/forms.js'

/**
 * Pre-handler to check if user management features are available
 */
export const checkUserManagementAccess = [
  {
    method: /** @param {Request} request */ (request) => {
      if (!config.featureFlagUseEntitlementApi) {
        throw Boom.forbidden('User management is not available')
      }

      const { credentials } = request.auth
      if (!hasAdminRole(credentials.user)) {
        throw Boom.forbidden('Admin access required')
      }
      return true
    }
  }
]

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

        const [, , slug] = request.url.pathname.split('/')
        const metadata = await forms.get(slug, token)

        if (
          !credentials.scope?.includes(Scopes.FormPublish) &&
          metadata.live?.updatedAt
        ) {
          if (!request.url.pathname.endsWith('make-draft-live')) {
            throw Boom.forbidden('FormPublish access required')
          }

          return h
            .view('generic-error', {
              pageHeading: {
                classes: 'govuk-heading-xl',
                text: 'You cannot publish a form'
              },
              pageTitle: `You cannot publish a form - ${metadata.title}`,
              backLink: {
                text: 'Back to form overview',
                href: `/library/${slug}`
              }
            })
            .takeover()
        }
        return true
      }
  }
]

/**
 * @import { FormBySlugInput } from '@defra/forms-model'
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
