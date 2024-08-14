import {
  auth,
  authGroupsInvalid,
  authScopesEmpty
} from '~/test/fixtures/auth.js'

// Request auth types require an error property
const error = new Error('Example authentication error')

/**
 * Request when signed in
 * @satisfies {Partial<Request>}
 */
export const requestAuth = {
  auth: {
    ...auth,
    error,
    mode: 'try',
    isAuthenticated: true,
    isAuthorized: true
  }
}

/**
 * Request when signed in with invalid groups
 * @satisfies {Partial<Request>}
 */
export const requestAuthGroupsInvalid = {
  auth: {
    ...authGroupsInvalid,
    error,
    mode: 'try',
    isAuthenticated: true,
    isAuthorized: false
  }
}

/**
 * Request when signed in without scopes
 * @satisfies {Partial<Request>}
 */
export const requestAuthScopesEmpty = {
  auth: {
    ...authScopesEmpty,
    error,
    mode: 'try',
    isAuthenticated: true,
    isAuthorized: false
  }
}

/**
 * Request when signed out
 * @satisfies {Partial<Request>}
 */
export const requestSignedOut = {
  auth: undefined
}

/**
 * @import { Request } from '@hapi/hapi'
 */
