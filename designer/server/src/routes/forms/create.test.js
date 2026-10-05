import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')

describe('Form create routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
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

  test('POST /create/title returns the interstitial "Before you continue" page', async () => {
    jest
      .mocked(forms.get)
      .mockRejectedValueOnce(Boom.notFound('Form not found'))

    const response = await server.inject({
      method: 'post',
      url: '/create/title',
      auth,
      payload: {
        title: 'Test form title'
      }
    })

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.result).toMatchSnapshot()
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
