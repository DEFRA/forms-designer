import { Scopes } from '@defra/forms-model'

import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import { allRoles } from '~/src/lib/__stubs__/roles.js'
import { getRoles, getUsers } from '~/src/lib/manage.js'
import { Roles } from '~/src/models/account/role-mapper.js'
import {
  artifacts,
  auth,
  credentials,
  profile,
  user
} from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/manage.js')
jest.mock('~/src/config.ts')

describe('Manage users route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getRoles).mockResolvedValueOnce(allRoles)
    jest.mocked(config).featureFlagUseEntitlementApi = true
  })

  const userList = [
    {
      userId: 'id1',
      displayName: 'John Smith',
      email: 'john.smith@here.com',
      roles: ['admin'],
      scopes: []
    },
    {
      userId: 'id2',
      displayName: 'Peter Jones',
      email: 'peter.jones@email.com',
      roles: ['form-creator'],
      scopes: []
    }
  ]

  test('GET - should show no rows', async () => {
    jest.mocked(getUsers).mockResolvedValueOnce([])

    const options = {
      method: 'get',
      url: '/manage/users',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    expect($mainHeading).toHaveTextContent('Manage users')

    const $noRowsText = container.getAllByText(
      'No rows available. Add a new user.'
    )
    expect($noRowsText).toBeDefined()
  })

  test('GET - should show list of users', async () => {
    jest.mocked(getUsers).mockResolvedValueOnce(userList)

    const options = {
      method: 'get',
      url: '/manage/users',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    expect($mainHeading).toHaveTextContent('Manage users')
    const $rows = container.getAllByRole('row')
    expect($rows).toHaveLength(3)
    expect($rows[0].textContent).toContain('Name')
    expect($rows[0].textContent).toContain('Role')
    expect($rows[0].textContent).toContain('Actions')
    expect($rows[1].textContent).toContain('Peter Jones')
    expect($rows[1].textContent).toContain('Form creator')
    expect($rows[1].textContent).toContain('Manage')
    expect($rows[2].textContent).toContain('John Smith')
    expect($rows[2].textContent).toContain('Admin')
    expect($rows[2].textContent).toContain('Manage')
  })

  test('GET - should return 403 when feature flag is disabled', async () => {
    jest.mocked(config).featureFlagUseEntitlementApi = false

    const options = {
      method: 'get',
      url: '/manage/users',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(403)

    expect(response.result).toContain('You do not have access to this service')
  })

  test('GET - should return 403 when user does not have admin role', async () => {
    const claims = {
      token: profile({ groups: ['valid-test-group'], login_hint: 'foo' }),
      idToken: profile()
    }

    const nonAdminAuth = {
      strategy: 'azure-oidc',
      artifacts: artifacts(claims),
      credentials: credentials({
        claims,
        user: user(claims.token, [Roles.FormCreator]),
        scope: [Scopes.FormRead, Scopes.FormEdit]
      })
    }

    const options = {
      method: 'get',
      url: '/manage/users',
      auth: nonAdminAuth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(403)

    expect(response.result).toContain('You do not have access to this service')
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
