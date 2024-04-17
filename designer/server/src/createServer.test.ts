import { type Server } from '@hapi/hapi'

import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

describe('Server tests', () => {
  const startServer = async (): Promise<Server> => {
    const { createServer } = await import('~/src/createServer.js')

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

  test('accessibility statement page is served', async () => {
    const options = {
      method: 'GET',
      url: '/forms-designer/help/accessibility-statement',
      auth
    }

    const { document } = await renderResponse(server, options)
    const $heading = document.querySelector('h1')

    expect($heading).toHaveClass('govuk-heading-xl')
    expect($heading).toHaveTextContent(
      'Accessibility statement for [website name]'
    )
  })

  test('cookies page is served', async () => {
    const options = {
      method: 'GET',
      url: '/forms-designer/help/cookies',
      auth
    }

    const { document } = await renderResponse(server, options)
    const $heading = document.querySelector('h1')

    expect($heading).toHaveClass('govuk-heading-xl')
    expect($heading).toHaveTextContent('Cookies')
  })

  test.skip('Phase banner is present', async () => {
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }

    const options = {
      method: 'get',
      url: '/forms-designer/editor/dummy-id-for-demo',
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
      url: '/forms-designer/editor/dummy-id-for-demo',
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

    const { result } = await server.inject(options)
    expect(result).toContain('{"featureEditPageDuplicateButton":false}')
  })

  test('security headers are present', async () => {
    const { persistenceService } = server.services()
    persistenceService.listAllConfigurations = () => {
      return Promise.resolve([])
    }

    const options = {
      method: 'get',
      url: '/forms-designer/editor/dummy-id-for-demo',
      auth
    }

    const { headers, statusCode } = await server.inject(options)

    expect(statusCode).toBe(200)
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-xss-protection']).toBe('1; mode=block')
  })
})
