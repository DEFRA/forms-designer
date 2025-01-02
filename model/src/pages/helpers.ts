import { type ComponentDef } from '~/src/components/types.js'
import {
  type Page,
  type PageFileUpload,
  type PageQuestion,
  type PageRepeat
} from '~/src/form/form-definition/types.js'
import {
  ControllerNames,
  ControllerTypes
} from '~/src/pages/controller-types.js'
import { ControllerType } from '~/src/pages/enums.js'
import { PageTypes } from '~/src/pages/page-types.js'

/**
 * Return component defaults by type
 */
export function getPageDefaults<PageType extends Page>(
  page?: Pick<PageType, 'controller'>
) {
  const nameOrPath = page?.controller ?? ControllerType.Page
  const controller = controllerNameFromPath(nameOrPath)

  const defaults = PageTypes.find(
    (pageType) => pageType.controller === controller
  )

  if (!defaults) {
    throw new Error(`Defaults not found for page type '${nameOrPath}'`)
  }

  return structuredClone(defaults) as PageType
}

/**
 * Check page has components
 */
export function hasComponents(
  page?: Partial<Page>
): page is Extract<Page, { components: ComponentDef[] }> {
  return !!page && 'components' in page && Array.isArray(page.components)
}

/**
 * Check page has form components
 */
export function hasFormComponents(
  page?: Partial<Page>
): page is PageQuestion | PageFileUpload {
  const controller = controllerNameFromPath(page?.controller)
  return hasComponents(page) && controller !== ControllerType.Start
}

/**
 * Check page has repeater
 */
export function hasRepeater(page?: Partial<Page>): page is PageRepeat {
  return controllerNameFromPath(page?.controller) === ControllerType.Repeat
}

/**
 * Check for known page controller names
 */
export function isControllerName(
  nameOrPath?: ControllerType | string
): nameOrPath is ControllerType {
  return !!nameOrPath && ControllerNames.map(String).includes(nameOrPath)
}

/**
 * Check and optionally replace legacy path with controller name
 * @param {string} [nameOrPath] - Controller name or legacy controller path
 */
export function controllerNameFromPath(nameOrPath?: ControllerType | string) {
  if (isControllerName(nameOrPath)) {
    return nameOrPath
  }

  const options = ControllerTypes.find(({ path }) => path === nameOrPath)
  return options?.name
}
