import { type Server } from '@hapi/hapi'
import { StatusCodes } from 'http-status-codes'

import {
  handleGdsDateFields,
  leftPadDateIfSupplied
} from '~/src/createServer.js'
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

  describe('leftPadDate', () => {
    test('should perform left pad', () => {
      expect(leftPadDateIfSupplied(undefined)).toBe('')
      expect(leftPadDateIfSupplied('0')).toBe('00')
      expect(leftPadDateIfSupplied('1')).toBe('01')
      expect(leftPadDateIfSupplied('9')).toBe('09')
      expect(leftPadDateIfSupplied('10')).toBe('10')
      expect(leftPadDateIfSupplied('99')).toBe('99')
    })
  })

  describe('handleGdsDateFields', () => {
    test('should handle empty date fields', () => {
      const payload = {
        itemAbsDates: [
          { day: '', month: '', year: '' },
          { day: '', month: '', year: '' },
          { day: '', month: '', year: '' }
        ],
        items: [
          { value: 'something1' },
          { value: 'something2' },
          { value: 'something3' }
        ]
      } as unknown as {
        itemAbsDates?: { day?: string; month?: string; year?: string }[]
        items: []
      }
      handleGdsDateFields(payload)
      expect(payload).toEqual({
        items: [{ value: '--' }, { value: '--' }, { value: '--' }]
      })
    })

    test('should handle partial date fields', () => {
      const payload = {
        itemAbsDates: [
          { day: '', month: '12', year: '2021' },
          { day: '22', month: '', year: '2024' },
          { day: '', month: '5', year: '' }
        ],
        items: [
          { value: 'something1' },
          { value: 'something2' },
          { value: 'something3' }
        ]
      } as unknown as {
        itemAbsDates?: { day?: string; month?: string; year?: string }[]
        items: []
      }
      handleGdsDateFields(payload)
      expect(payload).toEqual({
        items: [{ value: '2021-12-' }, { value: '2024--22' }, { value: '-05-' }]
      })
    })

    test('should handle completed date fields', () => {
      const payload = {
        itemAbsDates: [
          { day: '7', month: '12', year: '2021' },
          { day: '22', month: '1', year: '2024' },
          { day: '02', month: '5', year: '2025' }
        ],
        items: [
          { value: 'something1' },
          { value: 'something2' },
          { value: 'something3' }
        ]
      } as unknown as {
        itemAbsDates?: { day?: string; month?: string; year?: string }[]
        items: []
      }
      handleGdsDateFields(payload)
      expect(payload).toEqual({
        items: [
          { value: '2021-12-07' },
          { value: '2024-01-22' },
          { value: '2025-05-02' }
        ]
      })
    })
  })
})
