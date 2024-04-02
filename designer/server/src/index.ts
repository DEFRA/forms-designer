import { chdir } from 'node:process'

// Move working directory to build output
chdir(import.meta.dirname)

import('~/src/server.js')
  .then((server) => server.listen())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
