import { signInViewModel } from '~/src/models/account/auth.js'

/**
 * @satisfies {ServerRoute['handler']}
 */
export function handler(request, h) {
  const model = signInViewModel({
    hasFailedAuthorisation: isAuthenticated && !isAuthorized
  })

  return h.view('account/sign-in', model)
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
