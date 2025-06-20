/* eslint-disable */
import path from 'node:path'

import nunjucks from 'nunjucks'
import { markdownToHtml as markdown } from '@defra/forms-model'

const { Environment, precompileString } = nunjucks

const env = new Environment([])
env.addFilter('markdown', markdown)

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
