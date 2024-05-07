import boom from '@hapi/boom'
import { v4 as uuidv4 } from 'uuid'

import { createUserSession } from '~/src/common/helpers/auth/user-session.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: ['GET', 'POST'],
    path: '/auth/callback',
    async handler(request, h) {
      const { auth, cookieAuth, yar } = request

      if (auth.isAuthenticated) {
        const sessionId = uuidv4()

        await createUserSession(request, sessionId)

        cookieAuth.set({ sessionId })
      }

      const redirect = yar.flash('referrer').at(0) ?? '/library'

      return h.redirect(redirect)
    },
    options: {
      auth: 'azure-oidc',
      response: {
        failAction: () => boom.boomify(boom.unauthorized())
      }
    }
  })
]

/**
 * @typedef {import('@hapi/hapi').ServerRoute} ServerRoute
 */
