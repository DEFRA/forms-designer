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
  // here we're splitting the path e.g. .../preview-components/autocompletefield.njk
  const pathArray = resourcePath.split(path.sep)
  // ['preview-components', 'autocompletefield.njk']
  // Next we pop the nth term of the sequence and start a new sequence with this as a_1
  const paths = [pathArray.pop()]
  // pathArray = [...,'preview-components'], paths = ['autocompletefield.njk']
  // Then we pop n_{-1} and prepend this to the paths sequence
  paths.unshift(pathArray.pop())
  // pathArray = [..., 'preview-components'], paths = ['preview-components','autocompletefield.njk']

  // Finally we return the sequence as a path
  const name = paths.join('/')
  // name = 'preview-components/autocompletefield.njk'

  return precompileString(source, {
    env,
    name
  })
}
