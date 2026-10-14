import yar from '@hapi/yar'

import config from '~/src/config.js'

const sessionManager = {
  plugin: yar,
  options: {
    name: 'formsSession',
    maxCookieSize: 0, // Always use server-side storage
    cache: { cache: 'session' },
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: config.sessionCookiePassword,
      isSecure: config.isSecure
    }
  }
}

export { sessionManager }
