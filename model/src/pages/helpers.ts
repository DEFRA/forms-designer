import { ComponentType } from '~/src/components/enums.js'
import { hasFormField, isFormType } from '~/src/components/helpers.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  type Link,
  type Page,
  type PageFileUpload,
  type PageQuestion,
  type PageRepeat
} from '~/src/form/form-definition/types.js'
import { type FormDefinition } from '~/src/index.js'
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

export function includesFileUploadField(components: ComponentDef[]): boolean {
  return components.some(
    (component) => component.type === ComponentType.FileUploadField
  )
}

export function onlyDeclarationComponents(components: ComponentDef[]): boolean {
  return components
    .filter((comp) => isFormType(comp.type))
    .every((component) => component.type === ComponentType.DeclarationField)
}

const SHOW_REPEATER_CONTROLLERS = [ControllerType.Page, ControllerType.Repeat]

export function showRepeaterSettings(page: Page): boolean {
  if (page.controller && !SHOW_REPEATER_CONTROLLERS.includes(page.controller)) {
    return false
  }
  if (hasComponents(page)) {
    if (includesFileUploadField(page.components)) {
      return false
    }
    if (onlyDeclarationComponents(page.components)) {
      return false
    }
  }
  return true
}

/**
 * Gets page title, or title of first question (if no page title set)
 * @param {Page} page
 * @returns {string}
 */
export function getPageTitle(page: Page) {
  if (page.title !== '') {
    return page.title
  }

  if (hasComponentsEvenIfNoNext(page)) {
    const firstComp = page.components.find(hasFormField)
    if (firstComp) {
      return firstComp.title
    }
  }
  return 'Page title unknown'
}

/**
 *
 * @param {FormDefinition} definition
 * @param {string} pageId
 * @returns { Page | undefined }
 */
export function getPageFromDefinition(
  definition: FormDefinition,
  pageId: string
): Page | undefined {
  return definition.pages.find((x) => x.id === pageId)
}

export const summaryPageControllers = [
  ControllerType.Summary,
  ControllerType.SummaryWithConfirmationEmail
]

export function isSummaryPage(page: Page | undefined) {
  return summaryPageControllers.includes(
    page?.controller ?? ControllerType.Page
  )
}

/**
 * Revert any custom controllers to their parent/base class since engine-plugin has no knowledge of them
 * @param {FormDefinition} definition
 * @returns {FormDefinition}
 */
export function replaceCustomControllers(definition: FormDefinition) {
  const standardControllers = Object.values(ControllerType)
    .filter((x) => x !== ControllerType.SummaryWithConfirmationEmail)
    .map((x) => x.toString())

  return {
    ...definition,
    pages: definition.pages.map((page) => {
      if (
        !standardControllers.includes(
          (page.controller ?? ControllerType.Page).toString()
        )
      ) {
        return /** @type {Page} */ {
          ...page,
          controller: ControllerType.Page
        }
      }
      return page
    })
  } as FormDefinition
}
