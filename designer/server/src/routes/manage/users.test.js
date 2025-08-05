import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import { allRoles } from '~/src/lib/__stubs__/roles.js'
import { getRoles, getUsers } from '~/src/lib/manage.js'
import { auth } from '~/test/fixtures/auth.js'
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
    expect($rows[1].textContent).toContain('John Smith')
    expect($rows[1].textContent).toContain('Admin')
    expect($rows[1].textContent).toContain('Manage')
    expect($rows[2].textContent).toContain('Peter Jones')
    expect($rows[2].textContent).toContain('Form creator')
    expect($rows[2].textContent).toContain('Manage')
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
