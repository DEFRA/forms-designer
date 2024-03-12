import { dirname, normalize } from 'node:path'
import { chdir } from 'node:process'

// Move working directory to build output
if (__dirname.endsWith(normalize('dist/server'))) {
  chdir(dirname(__dirname))
}

import('./server')
  .then((server) => server.listen())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
