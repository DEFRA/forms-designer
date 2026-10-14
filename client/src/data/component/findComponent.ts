import { hasComponents, type Page } from '@defra/forms-model'

/**
 * Find component by name
 */
export function findComponent(page: Page, componentName?: string) {
  const component = hasComponents(page)
    ? page.components.find(({ name }) => name === componentName)
    : undefined

  if (!component) {
    throw Error(
      `Component not found with name '${componentName}' for path '${page.path}'`
    )
  }

  return component
}
