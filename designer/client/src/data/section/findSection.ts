import { type FormDefinition } from '@defra/forms-model'

/**
 * Find section by name
 */
export function findSection(
  { sections }: Pick<FormDefinition, 'sections'>,
  sectionName?: string
) {
  const section = sections.find(({ name }) => name === sectionName)

  if (!section) {
    throw Error(`Section not found with name '${sectionName}'`)
  }

  return section
}
