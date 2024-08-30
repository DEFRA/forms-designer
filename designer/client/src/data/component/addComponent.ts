import {
  hasComponents,
  type ComponentDef,
  type FormDefinition,
  type Page
} from '@defra/forms-model'

import { findComponent } from '~/src/data/component/findComponent.js'

export function addComponent(
  data: FormDefinition,
  page: Page,
  component: ComponentDef
) {
  const index = data.pages.indexOf(page)

  try {
    // Throw for missing component
    findComponent(page, component.name)
  } catch {
    // Copy page
    const pageCopy = structuredClone(page)

    if (!hasComponents(pageCopy)) {
      throw Error(`Components not found for path '${pageCopy.path}'`)
    }

    // Add component to page
    pageCopy.components.push(component)

    // Copy form definition, update page
    const definition = structuredClone(data)
    definition.pages[index] = pageCopy

    return definition
  }

  return data
}
