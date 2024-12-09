import { type ComponentDef } from '~/src/components/types.js'
import {
  type Link,
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
  const nameOrPath = page?.controller ?? ControllerType.Question
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
  if (!page || !('components' in page)) {
    return false
  }

  const controller = controllerNameFromPath(page.controller)

  return (
    !controller ||
    controller === ControllerType.Content ||
    controller === ControllerType.Start ||
    controller === ControllerType.Question ||
    controller === ControllerType.FileUpload ||
    controller === ControllerType.Repeat
  )
}

/**
 * Check page has form components
 */
export function hasFormComponents(
  page?: Partial<Page>
): page is PageQuestion | PageFileUpload {
  const controller = controllerNameFromPath(page?.controller)
  return (
    hasComponents(page) &&
    controller !== ControllerType.Content &&
    controller !== ControllerType.Start
  )
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
    controller === ControllerType.Question ||
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

  const options = ControllerTypes.find(({ aliases, path }) => {
    return nameOrPath && (path === nameOrPath || aliases?.includes(nameOrPath))
  })

  return options?.name
}
