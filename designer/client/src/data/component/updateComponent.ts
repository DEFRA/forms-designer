import {
  type ComponentDef,
  type FormDefinition,
  type Page
} from '@defra/forms-model'

import { findComponent } from '~/src/data/component/findComponent.js'
import { hasComponents } from '~/src/data/definition/hasComponents.js'

export function updateComponent(
  data: FormDefinition,
  page: Page,
  componentName: string,
  componentUpdate: ComponentDef
) {
  const pageIndex = data.pages.indexOf(page)

  if (!hasComponents(page)) {
    throw Error(`Components not found for path '${page.path}'`)
  }

  const component = findComponent(page, componentName)
  const componentIndex = page.components.indexOf(component)

  // Copy page, update component
  const pageCopy = structuredClone(page)
  pageCopy.components[componentIndex] = componentUpdate

  // Copy form definition, update page
  const definition = structuredClone(data)
  definition.pages[pageIndex] = pageCopy

  return definition
}
