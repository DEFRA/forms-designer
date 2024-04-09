import boom from '@hapi/boom'
import { v4 as uuidv4 } from 'uuid'
import { createUserSession } from '../common/helpers/auth/user-session.js'

export default {
  method: ['GET', 'POST'],
  path: '/auth/callback',
  async handler(request, h) {
    if (request.auth.isAuthenticated) {
      const sessionId = uuidv4()

      await createUserSession(request, sessionId)

      request.cookieAuth.set({ sessionId })
    }

    const redirect = request.yar.flash('referrer')?.at(0) ?? '/forms-designer'

    return h.redirect(redirect)
  },
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => boom.boomify(boom.unauthorized())
    }
  }
}
