import { token } from '@hapi/jwt'

import {
  azureOidc,
  azureOidcNoop,
  scope
} from '~/src/common/helpers/auth/azure-oidc.js'
import * as oidc from '~/src/lib/oidc.js'

jest.mock('@hapi/jwt', () => ({
  token: {
    decode: jest.fn(),
    verifyPayload: jest.fn(),
    verifyTime: jest.fn()
  }
}))
jest.mock('~/src/lib/oidc.js')

// Cast as any to avoid union narrowing issues with ServerRegisterPluginObject
const azureOidcAny = /** @type {any} */ (azureOidc)
const azureOidcNoopAny = /** @type {any} */ (azureOidcNoop)

const mockWellKnownConfig = /** @type {any} */ ({
  authorization_endpoint: 'https://auth.example.com/auth',
  token_endpoint: 'https://auth.example.com/token'
})

function createMockServer() {
  return {
    register: jest.fn(),
    auth: {
      strategy: jest.fn()
    }
  }
}

describe('azure-oidc', () => {
  describe('scope', () => {
    it('should contain required OAuth scopes', () => {
      expect(scope).toEqual(
        expect.arrayContaining(['openid', 'profile', 'email', 'offline_access'])
      )
    })

    it('should contain a forms.user API scope', () => {
      expect(scope.some((s) => s.endsWith('/forms.user'))).toBe(true)
    })
  })

  describe('azureOidc', () => {
    it('should have plugin name azure-oidc', () => {
      expect(azureOidcAny.plugin.name).toBe('azure-oidc')
    })

    it('should register Bell plugin on the server', async () => {
      const server = createMockServer()
      jest
        .mocked(oidc.getWellKnownConfiguration)
        .mockResolvedValue(mockWellKnownConfig)

      await azureOidcAny.plugin.register(server)

      expect(server.register).toHaveBeenCalledTimes(1)
    })

    it('should fetch well-known configuration', async () => {
      const server = createMockServer()
      jest
        .mocked(oidc.getWellKnownConfiguration)
        .mockResolvedValue(mockWellKnownConfig)

      await azureOidcAny.plugin.register(server)

      expect(oidc.getWellKnownConfiguration).toHaveBeenCalled()
    })

    it('should register azure-oidc bell strategy with well-known endpoints', async () => {
      const server = createMockServer()
      jest
        .mocked(oidc.getWellKnownConfiguration)
        .mockResolvedValue(mockWellKnownConfig)

      await azureOidcAny.plugin.register(server)

      expect(server.auth.strategy).toHaveBeenCalledWith(
        'azure-oidc',
        'bell',
        expect.objectContaining({
          provider: expect.objectContaining({
            name: 'azure-oidc',
            protocol: 'oauth2',
            auth: mockWellKnownConfig.authorization_endpoint,
            token: mockWellKnownConfig.token_endpoint
          }),
          cookie: 'bell-azure-oidc'
        })
      )
    })

    describe('location', () => {
      it('should return the auth callback URL', async () => {
        const server = createMockServer()
        jest
          .mocked(oidc.getWellKnownConfiguration)
          .mockResolvedValue(mockWellKnownConfig)

        await azureOidcAny.plugin.register(server)

        const [, , options] = server.auth.strategy.mock.calls[0]
        expect(options.location()).toContain('/auth/callback')
      })
    })

    describe('profile', () => {
      it('should decode and verify both tokens', async () => {
        const server = createMockServer()
        jest
          .mocked(oidc.getWellKnownConfiguration)
          .mockResolvedValue(mockWellKnownConfig)
        jest.mocked(token.decode).mockReturnValue(/** @type {any} */ ({}))

        await azureOidcAny.plugin.register(server)

        const [, , options] = server.auth.strategy.mock.calls[0]
        await options.provider.profile(
          { token: 'access-token' },
          { id_token: 'id-token' }
        )

        expect(token.decode).toHaveBeenCalledWith('access-token')
        expect(token.decode).toHaveBeenCalledWith('id-token')
        expect(token.verifyTime).toHaveBeenCalledTimes(2)
        expect(token.verifyPayload).toHaveBeenCalledTimes(2)
      })

      it('should resolve with no value', async () => {
        const server = createMockServer()
        jest
          .mocked(oidc.getWellKnownConfiguration)
          .mockResolvedValue(mockWellKnownConfig)
        jest.mocked(token.decode).mockReturnValue(/** @type {any} */ ({}))

        await azureOidcAny.plugin.register(server)

        const [, , options] = server.auth.strategy.mock.calls[0]
        const result = await options.provider.profile(
          { token: 'access-token' },
          { id_token: 'id-token' }
        )

        expect(result).toBeUndefined()
      })
    })
  })

  describe('azureOidcNoop', () => {
    it('should have plugin name azure-oidc', () => {
      expect(azureOidcNoopAny.plugin.name).toBe('azure-oidc')
    })

    it('should register Basic plugin on the server', async () => {
      const server = createMockServer()

      await azureOidcNoopAny.plugin.register(server)

      expect(server.register).toHaveBeenCalledTimes(1)
    })

    it('should register azure-oidc strategy using basic auth', async () => {
      const server = createMockServer()

      await azureOidcNoopAny.plugin.register(server)

      expect(server.auth.strategy).toHaveBeenCalledWith(
        'azure-oidc',
        'basic',
        expect.objectContaining({ validate: expect.any(Function) })
      )
    })

    describe('validate', () => {
      async function getValidateFn() {
        const server = createMockServer()
        await azureOidcNoopAny.plugin.register(server)
        const [, , options] = server.auth.strategy.mock.calls[0]
        return options.validate
      }

      it('should return isValid false for an unknown username', async () => {
        const validate = await getValidateFn()
        const result = await validate({}, 'unknown', 'password')
        expect(result).toEqual({ isValid: false })
      })

      it('should return isValid false for a wrong password', async () => {
        const validate = await getValidateFn()
        const result = await validate({}, 'defra', 'wrong-password')
        expect(result).toEqual({ isValid: false })
      })

      it('should return valid credentials for the correct username and password', async () => {
        const validate = await getValidateFn()
        const result = await validate({}, 'defra', 'testing')

        expect(result).toMatchObject({
          isValid: true,
          credentials: {
            user: {
              displayName: 'John Smith',
              email: 'dummy@defra.gov.uk',
              id: 'dummy-id'
            }
          }
        })
      })

      it('should include issuedAt and expiresAt timestamps in valid credentials', async () => {
        const validate = await getValidateFn()
        const result = await validate({}, 'defra', 'testing')

        expect(result.credentials.user).toHaveProperty('issuedAt')
        expect(result.credentials.user).toHaveProperty('expiresAt')
      })
    })
  })
})
