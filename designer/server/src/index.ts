import { dirname } from 'node:path'
import { chdir } from 'node:process'

// Move working directory to build output
chdir(dirname(__filename))

import('~/src/server')
  .then((server) => server.listen())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
