import { type Server } from '@hapi/hapi'
import { JSDOM } from 'jsdom'

import { auth } from '~/test/fixtures/auth.js'

describe('Footer', () => {
  const OLD_ENV = { ...process.env }

  const startServer = async (): Promise<Server> => {
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    await server.initialize()
    return server
  }

  let server: Server

  afterAll(async () => {
    process.env = OLD_ENV
    await server.stop()
  })

  test('footer set is set by environmental variable', async () => {
    process.env.FOOTER_TEXT = 'Footer Text Test'

    server = await startServer()

    const options = {
      method: 'GET',
      url: '/forms-designer/app',
      auth
    }

    const { result } = await server.inject<string>(options)
    const { document } = new JSDOM(result).window

    const $footerMessage = document.querySelector('.footer-message')
    expect($footerMessage).toContainHTML('<p>Footer Text Test</p>')
  })
})
