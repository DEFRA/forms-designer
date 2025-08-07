import { Scopes } from '@defra/forms-model'

import { signInViewModel } from '~/src/models/account/auth.js'
import { formsLibraryPath } from '~/src/models/links.js'

export default /** @satisfies {ServerRoute} */ ({
  method: 'GET',
  path: '/',
  handler(request, h) {
    const { auth } = request
    const { isAuthenticated, isAuthorized } = auth

    if (isAuthenticated && isAuthorized) {
      return h.redirect(formsLibraryPath)
    }

    const model = signInViewModel({
      hasFailedAuthorisation: isAuthenticated && !isAuthorized
    })

    return h.view('account/sign-in', model)
  },
  options: {
    auth: {
      mode: 'try',
      access: {
        entity: 'user',
        scope: [`+${Scopes.FormRead}`]
      }
    }
  }
})

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
