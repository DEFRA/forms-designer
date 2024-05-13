import { token } from '@hapi/jwt'
import { DateTime, Duration } from 'luxon'

/**
 * @satisfies {ServerInjectOptions['auth']}
 */
export const auth = {
  strategy: 'azure-oidc',
  credentials: {
    provider: 'azure-oidc',
    query: {},
    refreshToken: 'dummy-refresh-token',
    token: 'dummy-token',
    expiresIn: Duration.fromObject({ minutes: 30 }).as('seconds'),
    user: {
      id: 'dummy-id',
      email: 'dummy@defra.gov.uk',
      displayName: 'John Smith',
      issuedAt: DateTime.now().minus({ minutes: 30 }).toUTC().toISO(),
      expiresAt: DateTime.now().plus({ minutes: 30 }).toUTC().toISO()
    }
  },
  artifacts: {
    id_token: token.generate(
      {
        groups: ['valid-test-group']
      },
      'testSecret'
    )
  }
}

/**
 * @satisfies {ServerInjectOptions['auth']}
 */
export const authNoScopes = {
  strategy: 'azure-oidc',
  credentials: {
    provider: 'azure-oidc',
    query: {},
    refreshToken: 'dummy-refresh-token',
    token: 'dummy-token',
    expiresIn: Duration.fromObject({ minutes: 30 }).as('seconds'),
    user: {
      id: 'dummy-id',
      email: 'dummy@defra.gov.uk',
      displayName: 'John Smith',
      issuedAt: DateTime.now().minus({ minutes: 30 }).toUTC().toISO(),
      expiresAt: DateTime.now().plus({ minutes: 30 }).toUTC().toISO()
    }
  },
  artifacts: {
    id_token: token.generate(
      {
        groups: []
      },
      'testSecret'
    )
  }
}

/**
 * @typedef {import('@hapi/hapi').ServerInjectOptions} ServerInjectOptions
 */
