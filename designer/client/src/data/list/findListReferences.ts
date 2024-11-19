import {
  hasComponents,
  hasListField,
  type FormDefinition,
  type List
} from '@defra/forms-model'

/**
 * Find references to a list
 */
export function findListReferences(data: FormDefinition, list: List) {
  // Find all components in the form that use the list
  const components = data.pages
    .filter((page) => hasComponents(page))
    .flatMap((page) => page.components.filter(hasListField))
    .filter((component) => component.list === list.name)

  return { components }
}
