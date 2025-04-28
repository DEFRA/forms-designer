import { join } from 'node:path'
import { precompileFn } from './bin/precompile.js'

const inputPath = join(
  import.meta.dirname,
  'node_modules/govuk-frontend/dist/govuk'
)

const outputPath = join(
  import.meta.dirname,
  'client/src/javascripts/preview/govuk-components.js'
)

precompileFn(inputPath, outputPath)
