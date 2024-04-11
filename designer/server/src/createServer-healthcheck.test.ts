import { auth } from '~/test/fixtures/auth.js'

describe('/health-check Route', () => {
  const OLD_ENV = process.env

  test('/health-check route response is correct', async () => {
    const options = {
      method: 'GET',
      url: '/health-check',
      auth
    }

    process.env = {
      ...OLD_ENV,
      LAST_COMMIT: 'LAST COMMIT',
      LAST_TAG: 'LAST TAG'
    }

    await import('~/src/config.js')
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    const { result } = (await server.inject(options)) as any

    await server.stop()
    process.env = OLD_ENV

    expect(result?.status).toBe('OK')
    expect(result?.lastCommit).toBe('LAST COMMIT')
    expect(result?.lastTag).toBe('LAST TAG')
    expect(typeof result?.time).toBe('string')
  })
})
