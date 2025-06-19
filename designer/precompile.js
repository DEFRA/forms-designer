import { markdownToHtml as markdown } from '@defra/forms-model'
import nunjucks from 'nunjucks'
import fs from 'fs'
import { join } from 'node:path'
const { precompile, Environment } = nunjucks

const paths = [
  {
    cmdpath: join(
      import.meta.dirname,
      'node_modules/govuk-frontend/dist/govuk'
    ),
    output: join(
      import.meta.dirname,
      'client/src/assets/nunjucks/govuk-components.js'
    )
  },
  {
    cmdpath: join(import.meta.dirname, 'client/src/views/components'),
    output: join(
      import.meta.dirname,
      'client/src/assets/nunjucks/components.js'
    )
  }
]

const env = new Environment([])
env.addFilter('markdown', markdown)

for (const { cmdpath, output } of paths) {
  const compiled = precompile(cmdpath, {
    env: env,
    include: ['\\.njk$'],
    exclude: []
  })

  fs.writeFileSync(output, compiled)
}
