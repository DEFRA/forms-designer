import nock from 'nock'

const oidcWellKnownConfigurationUrl =
  process.env.OIDC_WELL_KNOWN_CONFIGURATION_URL
const auditUrl = process.env.AUDIT_URL
const okStatusCode = 200

const testJwks = {
  keys: [
    {
      kty: 'RSA',
      use: 'sig',
      kid: 'test-jwks-key',
      alg: 'RS256',
      n: 'test-key-modulus',
      e: 'AQAB'
    }
  ]
}

if (oidcWellKnownConfigurationUrl) {
  const { origin, pathname, search } = new URL(oidcWellKnownConfigurationUrl)
  const jwksPath = '/.well-known/openid-configuration/jwks'
  const oidcConfiguration = {
    issuer: origin,
    authorization_endpoint: `${origin}/authorize`,
    token_endpoint: `${origin}/token`,
    end_session_endpoint: `${origin}/logout`,
    jwks_uri: `${origin}${jwksPath}`
  }

  nock.cleanAll()

  nock(origin)
    .persist()
    .get(`${pathname}${search}`)
    .reply(okStatusCode, oidcConfiguration)

  nock(origin).persist().get(jwksPath).reply(okStatusCode, testJwks)

  if (auditUrl) {
    const { origin: auditOrigin } = new URL(auditUrl)

    nock(auditOrigin)
      .persist()
      .get(/\/audit\/forms\/[^?]+(?:\?.*)?$/)
      .reply(okStatusCode, {
        auditRecords: [],
        meta: {}
      })
  }

  // Prevent unmatched network traffic
  nock.disableNetConnect()
}

afterAll(() => {
  nock.enableNetConnect()
  nock.cleanAll()
})
