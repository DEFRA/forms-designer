import { createServer } from '~/src/createServer.js'
import * as file from '~/src/lib/file.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/file.js')

describe('File routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should show file download page', async () => {
    jest.mocked(file.checkFileStatus).mockResolvedValueOnce(200)

    const options = {
      method: 'GET',
      url: '/file-download/1234',
      auth
    }

    const { document } = await renderResponse(server, options)

    const html = document.documentElement.innerHTML

    expect(html).toContain('You have a file to download')
    expect(html).toContain('Email address')
  })

  test('GET - should show link expired page', async () => {
    jest.mocked(file.checkFileStatus).mockResolvedValueOnce(410)

    const options = {
      method: 'GET',
      url: '/file-download/1234',
      auth
    }

    const { document } = await renderResponse(server, options)

    const html = document.documentElement.innerHTML

    expect(html).toContain('The link has expired')
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
