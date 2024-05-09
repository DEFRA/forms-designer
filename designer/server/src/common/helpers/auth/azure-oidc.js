import Basic from '@hapi/basic'
import Bell from '@hapi/bell'
import Boom from '@hapi/boom'
import { token } from '@hapi/jwt'
import { DateTime } from 'luxon'

import * as scopes from '~/src/common/constants/scopes.js'
import config from '~/src/config.js'

const authCallbackUrl = new URL(`/auth/callback`, config.appBaseUrl)

/**
 * Returns the scopes assigned to a user, given their profile with a group assigned.
 * @param {Array<string>} groups - groups the user is a member of
 * @returns {Array<string>} - array of scopes assigned to the user
 */
export function getScopesForUserProfile(groups) {
  let assignedScopes = /** @type {Set<string>} */ (new Set())

  for (const [key, value] of Object.entries(groups)) {
    if (groups.includes(key)) {
      const scopesToAssign = scopes.groupsToScopes[value]

      assignedScopes = new Set([...assignedScopes, ...scopesToAssign])
    }
  }

  return Array.from(assignedScopes)
}

/**
 * @type {ServerRegisterPluginObject}
 */
export const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(Bell)

      if (
        !config.azureClientId ||
        !config.azureClientSecret ||
        !config.oidcWellKnownConfigurationUrl
      ) {
        throw Boom.unauthorized()
      }

      const oidc = await fetch(config.oidcWellKnownConfigurationUrl).then(
        (response) => /** @type {Promise<OidcMetadata>} */ (response.json())
      )

      server.auth.strategy(
        'azure-oidc',
        'bell',
        /** @type {ProviderBell} */ ({
          provider: {
            name: 'azure-oidc',
            protocol: 'oauth2',
            useParamsAuth: true,
            auth: oidc.authorization_endpoint,
            token: oidc.token_endpoint,
            scope: [
              // TODO re-enable
              // `api://${config.azureClientId}/forms.user`,
              'openid',
              'profile',
              'email',
              'offline_access',
              'user.read'
            ],
            profile(credentials, params) {
              const artifacts = token.decode(credentials.token)
              const idToken = params.id_token

              token.verifyTime(artifacts)
              token.verifyPayload(artifacts)

              const idTokenPayload = /** @type {{payload: idTokenPayload}} */ (
                token.decode(idToken).decoded
              ).payload
              const assignedScopes = getScopesForUserProfile(
                idTokenPayload.groups ?? []
              )

              credentials.scope = assignedScopes

              return Promise.resolve()
            }
          },
          location() {
            return authCallbackUrl.href
          },
          password: config.sessionCookiePassword,
          clientId: config.azureClientId,
          clientSecret: config.azureClientSecret,
          providerParams: {
            redirect_uri: authCallbackUrl.href
          },
          cookie: 'bell-azure-oidc',
          isSecure: false
        })
      )
    }
  }
}

/**
 * @type {Partial<Record<string, { password: string, user: UserCredentials }>>}
 */
const dummyUsers = {
  defra: {
    password: 'testing', // 'secret'
    user: {
      id: 'dummy-id',
      email: 'dummy@defra.gov.uk',
      displayName: 'John Smith',
      issuedAt: DateTime.now().minus({ minutes: 30 }).toUTC().toISO(),
      expiresAt: DateTime.now().plus({ minutes: 30 }).toUTC().toISO()
    }
  }
}

/**
 * @type {ServerRegisterPluginObject}
 */
export const azureOidcNoop = {
  plugin: {
    name: 'azure-oidc',
    async register(server) {
      await server.register(Basic)

      server.auth.strategy(
        'azure-oidc',
        'basic',
        /** @type {ProviderBasic} */ ({
          validate(request, username, password) {
            const credentials = dummyUsers[username]

            // No matching user found
            if (!credentials || credentials.password !== password) {
              return Promise.resolve({ isValid: false })
            }

            const { user } = credentials

            return Promise.resolve({
              credentials: { user },
              isValid: true
            })
          }
        })
      )
    }
  }
}

/**
 * @template {object | void} [PluginOptions=void]
 * @typedef {import('@hapi/hapi').ServerRegisterPluginObject<PluginOptions>} ServerRegisterPluginObject
 */

/**
 * @typedef {{ validate: import('@hapi/basic').Validate }} ProviderBasic - Basic provider options
 * @typedef {import('@hapi/bell').BellOptions} ProviderBell - Bell provider options
 * @typedef {import('@hapi/bell').Credentials2} Credentials - Provider OAuth2 credentials
 * @typedef {import('@hapi/hapi').UserCredentials} UserCredentials - User credentials
 * @typedef {import('oidc-client-ts').SigninResponse} SigninResponse - Provider sign in artifacts
 * @typedef {import('oidc-client-ts').OidcMetadata} OidcMetadata - OpenID Connect (OIDC) metadata
 * @typedef {import('oidc-client-ts').UserProfile} UserProfile - User profile
 */

/**
 * @typedef {object} idTokenPayload
 * @property {Array<string> | undefined} groups - list of active directory groups the user is a member of
 */
