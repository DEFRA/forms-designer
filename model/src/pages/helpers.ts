import { type ComponentDef } from '~/src/components/types.js'
import {
  type Link,
  type Page,
  type PageFileUpload,
  type PageQuestion,
  type PageRepeat
} from '~/src/form/form-definition/types.js'
import { ComponentType } from '~/src/index.js'
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
  return hasNext(page) && Array.isArray(page.components)
}

/**
 * Check if the page has components (the page can be any page type e.g. SummaryPage)
 */
export function hasComponentsEvenIfNoNext(
  page?: Partial<Page>
): page is Extract<Page, { components: ComponentDef[] }> {
  return (
    page !== undefined && 'components' in page && Array.isArray(page.components)
  )
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
 * Check page has next link
 */
export function hasNext(
  page?: Partial<Page>
): page is Extract<Page, { next: Link[] }> {
  if (!page || !('next' in page)) {
    return false
  }

  const controller = controllerNameFromPath(page.controller)

  return (
    !controller ||
    controller === ControllerType.Start ||
    controller === ControllerType.Page ||
    controller === ControllerType.Terminal ||
    controller === ControllerType.FileUpload ||
    controller === ControllerType.Repeat
  )
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

function includesFileUploadField(components: ComponentDef[]): boolean {
  return components.some(
    (component) => component.type === ComponentType.FileUploadField
  )
}

const SHOW_REPEATER_CONTROLLERS = [ControllerType.Page, ControllerType.Repeat]

export function showRepeaterSettings(page: Page): boolean {
  if (page.controller && !SHOW_REPEATER_CONTROLLERS.includes(page.controller)) {
    return false
  }
  if (hasComponents(page) && includesFileUploadField(page.components)) {
    return false
  }
  return true
}

/**
 * High level check for whether file upload component should be omitted
 * @param { Page | undefined } page
 * @returns {boolean}
 */
export function omitFileUploadComponent(page: Page | undefined): boolean {
  if (page?.controller === ControllerType.Repeat) {
    return true
  }
  if (!hasComponents(page)) {
    return false
  }
  if (page.components.length > 1) {
    return true
  }
  if (includesFileUploadField(page.components)) {
    return true
  }
  return false
}
