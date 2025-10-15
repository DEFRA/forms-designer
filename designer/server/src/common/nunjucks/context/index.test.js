import { context } from '~/src/common/nunjucks/context/index.js'
import config from '~/src/config.js'
import {
  requestAuth,
  requestAuthScopesEmpty,
  requestSignedOut
} from '~/test/fixtures/request.js'

describe('Nunjucks context', () => {
  describe('Asset path', () => {
    it("should include 'assetPath' for GOV.UK Frontend icons", async () => {
      const { assetPath } = await context(null)
      expect(assetPath).toBe('/assets')
    })
  })

  describe('Asset helper', () => {
    it("should locate 'assets-manifest.json' assets", async () => {
      const { getAssetPath } = await context(null)

      expect(getAssetPath('example.scss')).toBe(
        '/stylesheets/example.xxxxxxx.min.css'
      )

      expect(getAssetPath('example.mjs')).toBe(
        '/javascripts/example.xxxxxxx.min.js'
      )
    })

    it('should return path to unknown assets', async () => {
      const { getAssetPath } = await context(null)

      expect(getAssetPath('example.jpg')).toBe('/example.jpg')
      expect(getAssetPath('example.gif')).toBe('/example.gif')
    })
  })

  describe('Authentication', () => {
    it.each([
      {
        example: 'signed in (authorized)',
        request: requestAuth,
        expected: {
          isAuthenticated: true,
          isAuthorized: true
        }
      },
      {
        example: 'signed in (authenticated)',
        request: requestAuthScopesEmpty,
        expected: {
          isAuthenticated: true,
          isAuthorized: false
        }
      },
      {
        example: 'signed out',
        request: requestSignedOut,
        expected: {
          isAuthenticated: false,
          isAuthorized: false
        }
      }
    ])(
      'should include user context when $example',
      async ({ request, expected }) => {
        const { authedUser, isAuthenticated, isAuthorized } =
          await context(request)

        expect(authedUser).toEqual(request.auth?.credentials.user)
        expect(isAuthenticated).toBe(expected.isAuthenticated)
        expect(isAuthorized).toBe(expected.isAuthorized)
      }
    )
  })

  describe('Config', () => {
    it('should include phase and service name', async () => {
      const ctx = await context(null)

      expect(ctx.config).toEqual({
        cdpEnvironment: config.cdpEnvironment,
        phase: config.phase,
        serviceName: config.serviceName,
        serviceVersion: config.serviceVersion,
        featureFlagUseEntitlementApi: config.featureFlagUseEntitlementApi
      })
    })
  })

  describe('Navigation', () => {
    it('should include navigation array', async () => {
      const { navigation } = await context(null)

      expect(navigation).toHaveLength(7)
      expect(navigation[0]).toMatchObject({
        text: 'Forms library'
      })
      expect(navigation[1]).toMatchObject({
        text: 'Services'
      })
      expect(navigation[2]).toMatchObject({
        text: 'About'
      })
      expect(navigation[3]).toMatchObject({
        text: 'Get started'
      })
      expect(navigation[4]).toMatchObject({
        text: 'Features'
      })
      expect(navigation[5]).toMatchObject({
        text: 'Resources'
      })
      expect(navigation[6]).toMatchObject({
        text: 'Support'
      })
    })

    it('should include breadcrumbs array', async () => {
      const { breadcrumbs } = await context(null)

      expect(breadcrumbs).toHaveLength(0)
      expect(breadcrumbs).toEqual([])
    })
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 */
