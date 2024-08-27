import { type FormDefinition, type Section } from '@defra/forms-model'

/**
 * Remove section and update associated pages
 */
export function removeSection(data: FormDefinition, section: Section) {
  const index = data.sections.indexOf(section)

  if (index < 0) {
    throw Error(`Section not found with name '${section.name}'`)
  }

  const definition = structuredClone(data)
  const { pages, sections } = definition

  // Remove section
  sections.splice(index, 1)

  // Find pages with previous section name
  const pagesToUpdate = pages.filter((page) => page.section === section.name)

  // Remove previous page section name
  for (const page of pagesToUpdate) {
    delete page.section
  }

  return definition
}
