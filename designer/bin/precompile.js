import nunjucks from 'nunjucks'
import fs from 'fs'
const { precompile, Environment } = nunjucks

const env = new Environment([])

/**
 * @param {string} cmdpath
 * @param {string} output
 */
export function precompileFn(cmdpath, output) {
  const compiled = precompile(cmdpath, {
    env: env,
    include: ['\\.njk$'],
    exclude: []
  })

  fs.writeFileSync(output, compiled)
}
