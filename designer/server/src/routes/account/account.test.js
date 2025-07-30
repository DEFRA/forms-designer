import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { getUser } from '~/src/lib/manage.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/manage.js')

describe('Account profile route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('/auth/account route displays user profile', async () => {
    jest.mocked(getUser).mockResolvedValue(
      /** @type {EntitlementUser} */ ({
        userId: 'my-user-id',
        email: 'my-email@mail.com',
        roles: ['admin']
      })
    )

    const options = {
      method: 'GET',
      url: '/auth/account',
      auth
    }

    const { container, response } = await renderResponse(server, options)

    expect(response.statusCode).toBe(StatusCodes.OK)

    const $mastheadHeading = container.getByRole('heading', { level: 1 })
    const $rows = container.getAllByRole('definition')
    expect($rows).toHaveLength(2)
    expect($rows[0].textContent).toContain('my-email@mail.com')
    expect($rows[1].textContent).toContain('Admin')

    expect($mastheadHeading.textContent).toContain('My account')
    expect($mastheadHeading.textContent).toContain('John Smith')
    expect(response.result).toMatchSnapshot()
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { EntitlementUser } from '@defra/forms-model'
 */
