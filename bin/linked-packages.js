import { existsSync, realpathSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { join, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Development only: resolve the dependencies of a linked `@defra/forms-model`
 * (npm link) from this project's node_modules first, as a registry install
 * would. This stops the linked package loading its own development copies of
 * shared packages such as `joi`, which cannot be mixed with this project's copy
 */
const appDir = join(import.meta.dirname, '..')
const appURL = pathToFileURL(join(appDir, 'package.json')).href
const linkedPath = join(appDir, 'node_modules/@defra/forms-model')

// Match the package by both its symlink path and its real path
const linkedDirs = [...new Set([linkedPath, realpathSync(linkedPath)])].map(
  (dir) => dir + sep
)

/**
 * Check a bare specifier (e.g. `joi` or `@joi/date/lib`) names a package
 * installed in this project
 * @param {string} specifier
 */
function isInstalledInApp(specifier) {
  if (/^(?:[./#]|[a-z][a-z\d+.-]*:)/i.test(specifier)) {
    return false
  }

  const segments = specifier.split('/')
  const packageName = segments
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/')

  return existsSync(join(appDir, 'node_modules', packageName, 'package.json'))
}

/**
 * @param {string | undefined} parentURL
 */
function isInLinkedPackage(parentURL) {
  if (!parentURL?.startsWith('file:')) {
    return false
  }

  const parentPath = fileURLToPath(parentURL)

  return linkedDirs.some(
    (dir) =>
      parentPath.startsWith(dir) &&
      !parentPath.startsWith(join(dir, 'node_modules') + sep)
  )
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (isInLinkedPackage(context.parentURL) && isInstalledInApp(specifier)) {
      return nextResolve(specifier, { ...context, parentURL: appURL })
    }

    return nextResolve(specifier, context)
  }
})
