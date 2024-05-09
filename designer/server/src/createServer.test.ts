import { type Server } from '@hapi/hapi'

import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

describe('Server tests', () => {
  const OLD_ENV = { ...process.env }

  const startServer = async (): Promise<Server> => {
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    await server.initialize()
    return server
  }

  let server: Server

  afterEach(async () => {
    process.env = OLD_ENV
    await server.stop()
  })

  test('accessibility statement page is served', async () => {
    server = await startServer()

    const options = {
      method: 'GET',
      url: '/help/accessibility-statement',
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
    server = await startServer()

    const options = {
      method: 'GET',
      url: '/help/cookies',
      auth
    }

    const { document } = await renderResponse(server, options)
    const $heading = document.querySelector('h1')

    expect($heading).toHaveClass('govuk-heading-xl')
    expect($heading).toHaveTextContent('Cookies')
  })

  test.each([
    {
      phase: 'alpha',
      phaseText: 'Alpha'
    },
    {
      phase: 'beta',
      phaseText: 'Beta'
    }
  ])('Phase banner is present (alpha, beta)', async ({ phase, phaseText }) => {
    process.env.PHASE = phase
    server = await startServer()

    const options = {
      method: 'get',
      url: '/help/cookies',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $phaseBanner = document.querySelector('.govuk-phase-banner')
    const $phaseBannerTag = $phaseBanner?.querySelector('.govuk-tag')

    expect($phaseBanner).toBeInTheDocument()
    expect($phaseBannerTag).toHaveTextContent(phaseText)
  })

  test('Phase banner is not present (live)', async () => {
    process.env.PHASE = 'live'
    server = await startServer()

    const options = {
      method: 'get',
      url: '/help/cookies',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $phaseBanner = document.querySelector('.govuk-phase-banner')
    expect($phaseBanner).not.toBeInTheDocument()
  })

  test('security headers are present', async () => {
    server = await startServer()

    const options = {
      method: 'get',
      url: '/help/cookies',
      auth
    }

    const { headers, statusCode } = await server.inject(options)

    expect(statusCode).toBe(200)
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-xss-protection']).toBe('1; mode=block')
  })
})
