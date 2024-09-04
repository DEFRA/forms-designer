import { type ComponentDef } from '~/src/components/types.js'
import {
  type Link,
  type Page,
  type PageQuestion,
  type PageStart,
  type RequiredField
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
export function getPageDefaults(page: Pick<Page, 'controller'>) {
  const controller = controllerNameFromPath(page.controller)

  const defaults = PageTypes.find(
    (pageType) => pageType.controller === controller
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
  page?: Partial<Page>
): page is Extract<Page, { components: ComponentDef[] }> {
  return isLinkablePage(page) && Array.isArray(page.components)
}

/**
 * Check page has form components
 */
export function hasFormComponents(
  page?: Partial<Page>
): page is Extract<Page, { components: ComponentDef[] }> {
  return isLinkablePage(page) && Array.isArray(page.components)
}

/**
 * Check page has sections
 */
export function hasSection(
  page?: Partial<Page>
): page is RequiredField<PageStart | PageQuestion, 'section'> {
  return isLinkablePage(page) && typeof page.section === 'string'
}

/**
 * Check page has next link
 */
export function hasNext(page?: Partial<Page>) {
  return isLinkablePage(page)
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
 * Check page is linkable
 */
export function isLinkablePage(
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
    controller === ControllerType.FileUpload
  )
}

/**
 * Check page supports questions
 */
export function isQuestionPage(page?: Partial<Page>): page is PageQuestion {
  const controller = controllerNameFromPath(page?.controller)

  return (
    !controller ||
    controller === ControllerType.Page ||
    controller === ControllerType.FileUpload
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
