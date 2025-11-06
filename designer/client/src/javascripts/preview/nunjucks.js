/* eslint-disable */
// @ts-expect-error
import * as njk from 'nunjucks/browser/nunjucks-slim'
// @ts-expect-error
import * as path from 'path-webpack'

import { markdownToHtml as markdown } from '@defra/forms-model'

// @ts-expect-error
njk.PrecompiledLoader.prototype.resolve = function patchedResolve(from, to) {
  return path.resolve(path.dirname(from), to).replace(/^\//, '')
}

// Add any filters required by client-side Nunjucks templates i.e. JS component previews
const env = new njk.Environment()
env.addFilter('markdown', markdown)

// @ts-expect-error
window.nunjucks = env

/**
 * @typedef {(
 *    name: string,
 *    ctx: RenderContext
 * ) => string} NJKRender
 */

/**
 * @typedef {{
 *   render: NJKRender
 * }} NJK
 */

export const NJK = /** @type {NJK} */ (env)

/**
 * @import {RenderContext} from '@defra/forms-model'
 */
