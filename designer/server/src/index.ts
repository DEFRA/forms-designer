import { chdir } from 'node:process'

import { getErrorMessage } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

// Move working directory to build output
chdir(import.meta.dirname)

import('~/src/server.js')
  .then((server) => server.listen())
  .catch((error: unknown) => {
    logger.error(
      error,
      `[serverStartup] Server failed to start: ${getErrorMessage(error)}`
    )
    throw error
  })
