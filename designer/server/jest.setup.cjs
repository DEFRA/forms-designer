const { Duration } = require('luxon')

process.env.APP_BASE_URL = 'http://localhost:3000'
process.env.AZURE_CLIENT_ID = 'dummy'
process.env.AZURE_CLIENT_SECRET = 'dummy'
process.env.MANAGER_URL = 'http://localhost:3001'
process.env.OIDC_WELL_KNOWN_CONFIGURATION_URL = 'dummy'
process.env.PREVIEW_URL = 'http://localhost:3009'
process.env.REDIS_HOST = 'dummy'
process.env.REDIS_HOST = 'dummy'
process.env.REDIS_KEY_PREFIX = 'forms-designer'
process.env.REDIS_PASSWORD = 'dummy'
process.env.REDIS_USERNAME = 'dummy'
process.env.ROLE_EDITOR_GROUP_ID = 'valid-test-group'
process.env.SESSION_COOKIE_PASSWORD = 'test-env-session-cookie-password'
process.env.SESSION_COOKIE_TTL = Duration.fromObject({ days: 1 })
  .as('milliseconds')
  .toString()
process.env.SESSION_TTL = Duration.fromObject({ days: 28 })
  .as('milliseconds')
  .toString()
