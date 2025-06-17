import nunjucks from 'nunjucks'
import fs from 'fs'
const { precompile, Environment } = nunjucks
import { minify_sync } from 'terser'

const env = new Environment([])

/**
 * @param {string} cmdpath
 * @param {string} output
 */
export function precompileFn(cmdpath, output) {
  const preCompiled = precompile(cmdpath, {
    env: env,
    include: ['\\.njk$'],
    exclude: []
  })

  fs.writeFileSync(output, minify_sync(preCompiled).code)
}
