import { type ComponentDef } from '~/src/components/types.js'
import { type Link, type Page } from '~/src/form/form-definition/types.js'
import {
  ControllerNames,
  ControllerTypes
} from '~/src/pages/controller-types.js'

/**
 * Check page has components
 */
export function hasComponents(
  page?: Page
): page is Extract<Page, { components: ComponentDef[] }> {
  return !!page && 'components' in page
}

/**
 * Check page has next link
 */
export function hasNext(page?: Page): page is Extract<Page, { next: Link[] }> {
  return !!page && 'next' in page
}

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
