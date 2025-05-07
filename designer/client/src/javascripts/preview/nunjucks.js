/* eslint-disable */
// @ts-expect-error
import * as njk from 'nunjucks/browser/nunjucks-slim'
// @ts-expect-error
import * as path from 'path-webpack'

// @ts-expect-error
njk.PrecompiledLoader.prototype.resolve = function patchedResolve(from, to) {
  return path.resolve(path.dirname(from), to).replace(/^\//, '')
}

// @ts-expect-error
window.nunjucks = njk

export default njk
