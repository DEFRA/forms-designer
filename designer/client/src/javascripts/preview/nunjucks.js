/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import * as njk from 'nunjucks/browser/nunjucks-slim'
import * as path from 'path-webpack'

// eslint-disable-next-line
njk.PrecompiledLoader.prototype.resolve = function patchedResolve(from, to) {
  return path.resolve(path.dirname(from), to).replace(/^\//, '')
}

window.nunjucks = njk

export default njk
