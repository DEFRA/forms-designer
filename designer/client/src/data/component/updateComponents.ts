import {
  hasComponents,
  type ComponentDef,
  type FormDefinition,
  type Page
} from '@defra/forms-model'

export function updateComponents(
  data: FormDefinition,
  page: Page,
  componentsUpdate: ComponentDef[]
) {
  const pageIndex = data.pages.indexOf(page)

  if (!hasComponents(page)) {
    throw Error(`Components not found for path '${page.path}'`)
  }

  // Copy page, update components
  const pageCopy = structuredClone(page)
  pageCopy.components = componentsUpdate

  // Copy form definition, update page
  const definition = structuredClone(data)
  definition.pages[pageIndex] = pageCopy

  return definition
}
