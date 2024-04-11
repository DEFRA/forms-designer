import { type Server } from '@hapi/hapi'

import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'

describe('Server tests', () => {
  const startServer = async (): Promise<Server> => {
    const server = await createServer()
    await server.initialize()
    return server
  }

  let server: Server

  beforeAll(async () => {
    server = await startServer()
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test.skip('accessibility statement page is served', async () => {
    const options = {
      method: 'GET',
      url: '/forms-designer/help/accessibility-statement',
      auth
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(res.result).toContain(
      '<h1 class="govuk-heading-xl">Accessibility Statement</h1>'
    )
  })

  test.skip('cookies page is served', async () => {
    const options = {
      method: 'GET',
      url: '/forms-designer/help/cookies',
      auth
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(res.result).toContain('<h1 class="govuk-heading-xl">Cookies</h1>')
  })

  test.skip('terms and conditions page is served', async () => {
    const options = {
      method: 'GET',
      url: '/forms-designer/help/terms-and-conditions',
      auth
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(res.result).toContain(
      '<h1 class="govuk-heading-xl">Terms and conditions</h1>'
    )
  })

  test.skip('Phase banner is present', async () => {
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }

    const options = {
      method: 'get',
      url: '/forms-designer/app',
      auth
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(res.result).toContain(
      '<strong class="govuk-tag govuk-phase-banner__content__tag">'
    )
  })

  test.skip('Phase banner is present', async () => {
    const options = {
      method: 'get',
      url: '/forms-designer/app',
      auth
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(res.result).toContain(
      '<strong class="govuk-tag govuk-phase-banner__content__tag">'
    )
  })

  test('Feature toggles api contains data', async () => {
    const options = {
      method: 'get',
      url: '/forms-designer/feature-toggles',
      auth
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(res.result).toContain('{"featureEditPageDuplicateButton":false}')
  })

  test('security headers are present', async () => {
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }

    const options = {
      method: 'get',
      url: '/forms-designer/app',
      auth
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(res.headers['x-frame-options']).not.toBeNull()
    expect(res.headers['x-content-type-options']).not.toBeNull()
    expect(res.headers['x-frame-options']).not.toBeNull()
  })
})
