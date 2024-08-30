import { type ComponentDef } from '~/src/components/types.js'
import { type Link, type Page } from '~/src/form/form-definition/types.js'
import {
  ControllerNames,
  ControllerTypes
} from '~/src/pages/controller-types.js'
import { ControllerType } from '~/src/pages/enums.js'
import { PageTypes } from '~/src/pages/page-types.js'

/**
 * Return component defaults by type
 */
export function getPageDefaults(page: Pick<Page, 'controller'>) {
  const defaults = PageTypes.find(
    ({ controller }) => controller === (page.controller ?? ControllerType.Page)
  )

  if (!defaults) {
    throw new Error(`Defaults not found for ${page.controller}`)
  }

  return structuredClone(defaults)
}

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
export function isControllerName(
  nameOrPath?: ControllerType | string
): nameOrPath is ControllerType {
  return !!nameOrPath && ControllerNames.includes(nameOrPath)
}

/**
 * Check and optionally replace legacy path with controller name
 * @param {string} [nameOrPath] - Controller name or legacy controller path
 */
export function controllerNameFromPath(nameOrPath?: ControllerType | string) {
  if (!nameOrPath || isControllerName(nameOrPath)) {
    return nameOrPath
  }

  const options = ControllerTypes.find(({ path }) => path === nameOrPath)
  return options?.name
}
