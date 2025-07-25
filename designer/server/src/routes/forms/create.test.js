import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'

describe('Form create routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const routes = ['/create/title', '/create/organisation', '/create/team']

  test.each(routes)(`GET '%p' matches test snapshot`, async (route) => {
    const response = await server.inject({
      method: 'get',
      url: route,
      auth
    })

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.result).toMatchSnapshot()
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
