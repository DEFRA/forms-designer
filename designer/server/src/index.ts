import { chdir } from 'node:process'

import { getErrorMessage } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

// Move working directory to build output
chdir(import.meta.dirname)

try {
  const server = await import('~/src/server.js')
  await server.listen()
} catch (err) {
  logger.info('Server failed to start :(')
  logger.error(
    err,
    `[serverStartup] Server failed to start - ${getErrorMessage(err)}`
  )
  throw err
}
