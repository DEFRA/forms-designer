import cheerio from 'cheerio'

import { auth } from '~/test/fixtures/auth.js'

describe('Footer', () => {
  const OLD_ENV = process.env

  const startServer = async (): Promise<any> => {
    const { createServer } = await import('~/src/createServer.js')
    const server = await createServer()
    await server.start()
    return server
  }

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('footer set is set by environmental variable', async () => {
    process.env = {
      ...OLD_ENV,
      FOOTER_TEXT: 'Footer Text Test'
    }

    await import('~/src/config.js')
    await import('~/src/plugins/designer.js')

    const options = {
      method: 'GET',
      url: '/app',
      auth
    }

    const server = await startServer()
    const res = await server.inject(options)
    server.stop()

    const $ = cheerio.load(res.result)
    const footerText = $('.footer-message').find('p').text()
    expect(footerText).toBe('Footer Text Test')
  })
})
