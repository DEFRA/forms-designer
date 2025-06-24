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
  const resourcePath = /** @type {string} */ (this.resourcePath)
  const pathArray = resourcePath.split(path.sep)
  const paths = [pathArray.pop()]
  paths.unshift(pathArray.pop())

  const name = paths.join('/')

  return precompileString(source, {
    env,
    name
  })
}
