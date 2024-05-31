import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'

import { createServer } from '~/src/createServer.js'
import {
  auth,
  authScopesEmpty,
  authGroupsInvalid
} from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')

describe('Authentiation', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('With valid scopes', () => {
    /** @type {ServerInjectResponse} */
    let response

    beforeAll(async () => {
      const options = {
        method: 'get',
        url: '/auth/callback',
        auth
      }

      response = await server.inject(options)
    })

    it('should redirect to library', () => {
      const { headers } = response
      expect(headers.location).toBe('/library')
    })

    it('should set the user session cookie', () => {
      const { headers } = response
      expect(headers['set-cookie']).toMatchObject(
        expect.arrayContaining([
          expect.stringMatching(/^userSession=[a-z]/i),
          expect.not.stringContaining('userSession=;')
        ])
      )
    })
  })

  describe('With empty scopes', () => {
    /** @type {ServerInjectResponse} */
    let response

    beforeAll(async () => {
      const options = {
        method: 'get',
        url: '/auth/callback',
        auth: authScopesEmpty
      }

      response = await server.inject(options)
    })

    it('should redirect to home', () => {
      const { headers } = response
      expect(headers.location).toBe('/')
    })

    it('should clear the user session cookie', () => {
      const { headers } = response
      expect(headers['set-cookie']).toMatchObject(
        expect.arrayContaining([expect.stringContaining('userSession=;')])
      )
    })
  })

  describe('With invalid groups', () => {
    /** @type {ServerInjectResponse} */
    let response

    beforeAll(async () => {
      const options = {
        method: 'get',
        url: '/auth/callback',
        auth: authGroupsInvalid
      }

      response = await server.inject(options)
    })

    it('should redirect to home', () => {
      const { headers } = response
      expect(headers.location).toBe('/')
    })

    it('should clear the user session cookie', () => {
      const { headers } = response
      expect(headers['set-cookie']).toMatchObject(
        expect.arrayContaining([expect.stringContaining('userSession=;')])
      )
    })
  })
})

/**
 * @template {object} [Result={}]
 * @typedef {import('@hapi/hapi').ServerInjectResponse<Result>} ServerInjectResponse
 */
