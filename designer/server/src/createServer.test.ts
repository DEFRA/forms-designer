import { type Server } from '@hapi/hapi'
import { StatusCodes } from 'http-status-codes'

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

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', {
      name: 'Accessibility statement for [website name]',
      level: 1
    })

    expect($heading).toBeInTheDocument()
    expect($heading).toHaveClass('govuk-heading-xl')
  })

  test('cookies page is served', async () => {
    server = await startServer()

    const options = {
      method: 'GET',
      url: '/help/cookies',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', {
      name: 'Cookies',
      level: 1
    })

    expect($heading).toBeInTheDocument()
    expect($heading).toHaveClass('govuk-heading-xl')
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

    await renderResponse(server, options)

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

    await renderResponse(server, options)

    const $phaseBanner = document.querySelector('.govuk-phase-banner')
    expect($phaseBanner).not.toBeInTheDocument()
  })

  test('Phase banner is not present by default', async () => {
    server = await startServer()

    const options = {
      method: 'get',
      url: '/help/cookies',
      auth
    }

    await renderResponse(server, options)

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

  describe('redirect tests', () => {
    test('accepts requests targetting the correct hostname', async () => {
      process.env.APP_BASE_URL = 'https://correct.forms.defra.gov.uk'

      server = await startServer()

      const options = {
        method: 'get',
        url: '/hello/world',
        headers: {
          Host: 'CORRECT.forms.defra.gov.uk' // case insensitive
        }
      }

      const { statusCode } = await server.inject(options)

      expect(statusCode).toBe(StatusCodes.NOT_FOUND) // dummy URL, that's fine since it's not a redirect
    })

    test('accepts requests targetting the correct hostname respecting port', async () => {
      process.env.APP_BASE_URL = 'https://correct.forms.defra.gov.uk'

      server = await startServer()

      const options = {
        method: 'get',
        url: '/hello/world',
        headers: {
          Host: 'correct.forms.defra.gov.uk:3000'
        }
      }

      const { statusCode } = await server.inject(options)

      expect(statusCode).toBe(StatusCodes.NOT_FOUND) // dummy URL, that's fine since it's not a redirect
    })

    test('redirects requests targetting the wrong hostname', async () => {
      process.env.APP_BASE_URL = 'http://correct.forms.defra.gov.uk'

      server = await startServer()

      const options = {
        method: 'get',
        url: '/hello/world',
        headers: {
          Host: 'incorrect.forms.defra.gov.uk'
        }
      }

      const { headers, statusCode } = await server.inject(options)

      expect(statusCode).toBe(StatusCodes.MOVED_PERMANENTLY)
      expect(headers.location).toBe(
        'http://correct.forms.defra.gov.uk/hello/world' // local tests are http
      )
    })

    test('redirects requests targetting the wrong hostname respecting port', async () => {
      process.env.APP_BASE_URL = 'http://correct.forms.defra.gov.uk'

      server = await startServer()

      const options = {
        method: 'get',
        url: '/hello/world',
        headers: {
          Host: 'incorrect.forms.defra.gov.uk:3000'
        }
      }

      const { headers, statusCode } = await server.inject(options)

      expect(statusCode).toBe(StatusCodes.MOVED_PERMANENTLY)
      expect(headers.location).toBe(
        'http://correct.forms.defra.gov.uk:3000/hello/world' // local tests are http
      )
    })

    test('ignores redirects for localhost', async () => {
      process.env.APP_BASE_URL = 'http://correct.forms.defra.gov.uk'

      server = await startServer()

      const options = {
        method: 'get',
        url: '/hello/world',
        headers: {
          Host: 'localhost:3000'
        }
      }

      const { statusCode } = await server.inject(options)

      expect(statusCode).toBe(StatusCodes.NOT_FOUND) // dummy URL, that's fine since it's not a redirect
    })
  })
})
