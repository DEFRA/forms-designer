import Boom from '@hapi/boom'
import { v4 as uuidv4 } from 'uuid'

import { createUserSession } from '~/src/common/helpers/auth/user-session'

const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.boomify(Boom.unauthorized())
    }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const sessionId = uuidv4()

      await createUserSession(request, sessionId)

      request.cookieAuth.set({ sessionId })
    }

    const redirect = request.yar.flash('referrer')?.at(0) ?? '/forms-designer'

    return h.redirect(redirect)
  }
}

export { authCallbackController }
