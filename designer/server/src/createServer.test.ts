import { type Server } from '@hapi/hapi'

import { createServer } from '~/src/createServer.js'

describe('Server tests', () => {
  const startServer = async (): Promise<Server> => {
    const server = await createServer()
    await server.start()
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

  test('accessibility statement page is served', async () => {
    const options = {
      method: 'GET',
      url: `/help/accessibility-statement`
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(
      res.result.indexOf(
        '<h1 class="govuk-heading-xl">Accessibility Statement</h1>'
      ) > -1
    ).toBe(true)
  })

  test('cookies page is served', async () => {
    const options = {
      method: 'GET',
      url: `/help/cookies`
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(
      res.result.indexOf('<h1 class="govuk-heading-xl">Cookies</h1>') > -1
    ).toBe(true)
  })

  test('terms and conditions page is served', async () => {
    const options = {
      method: 'GET',
      url: `/help/terms-and-conditions`
    }

    const res = await server.inject(options)

    expect(res.statusCode).toBe(200)
    expect(
      res.result.indexOf(
        '<h1 class="govuk-heading-xl">Terms and conditions</h1>'
      ) > -1
    ).toBe(true)
  })

  test('Phase banner is present', async () => {
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }

    const options = {
      method: 'get',
      url: '/app'
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(
      res.result.indexOf(
        '<strong class="govuk-tag govuk-phase-banner__content__tag">'
      ) > -1
    ).toBe(true)
  })

  test('Phase banner is present', async () => {
    const options = {
      method: 'get',
      url: '/app'
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(
      res.result.indexOf(
        '<strong class="govuk-tag govuk-phase-banner__content__tag">'
      ) > -1
    ).toBe(true)
  })

  test('Feature toggles api contains data', async () => {
    const options = {
      method: 'get',
      url: '/forms-designer/feature-toggles'
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(
      res.result.indexOf('{"featureEditPageDuplicateButton":false}') > -1
    ).toBe(true)
  })

  test('security headers are present', async () => {
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }

    const options = {
      method: 'get',
      url: '/app'
    }

    const res = await server.inject(options)
    expect(res.statusCode).toBe(200)
    expect(res.headers['x-frame-options']).not.toBeNull()
    expect(res.headers['x-content-type-options']).not.toBeNull()
    expect(res.headers['x-frame-options']).not.toBeNull()
  })
})
