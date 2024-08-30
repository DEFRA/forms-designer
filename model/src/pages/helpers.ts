import {
  ControllerNames,
  ControllerTypes
} from '~/src/pages/controller-types.js'

/**
 * Check for known page controller names
 */
export function isControllerName(nameOrPath?: string) {
  return !!nameOrPath && ControllerNames.includes(nameOrPath)
}

/**
 * Check and optionally replace legacy path with controller name
 * @param {string} [nameOrPath] - Controller name or legacy controller path
 */
export function controllerNameFromPath(nameOrPath?: string) {
  if (!nameOrPath || isControllerName(nameOrPath)) {
    return nameOrPath
  }

  const options = ControllerTypes.find(({ path }) => path === nameOrPath)
  return options?.name
}
