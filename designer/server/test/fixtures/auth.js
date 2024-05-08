import { DateTime, Duration } from 'luxon'

import * as rbac from '~/src/common/constants/rbac.js'

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
    },
    scope: [rbac.SCOPE_READ, rbac.SCOPE_WRITE]
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
  }
}

/**
 * @typedef {import('@hapi/hapi').ServerInjectOptions} ServerInjectOptions
 */
