/* eslint-disable */
import path from 'node:path'

import nunjucks from 'nunjucks'

const { Environment, precompileString } = nunjucks

const env = new Environment([])

/**
 * @param {string} source
 * @returns {string}
 */
export default function (source) {
  // @ts-expect-error
  const name = path.basename(this.resourcePath)

  return precompileString(source, {
    env,
    name: 'preview-components/' + name
  })
}
