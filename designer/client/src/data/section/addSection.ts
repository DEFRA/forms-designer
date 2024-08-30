import { type FormDefinition, type Section } from '@defra/forms-model'

import { findSection } from '~/src/data/section/findSection.js'

/**
 * Add section
 */
export function addSection(data: FormDefinition, section: Section) {
  try {
    // Throw for missing section
    findSection(data, section.name)
  } catch {
    // Copy form definition
    const definition = structuredClone(data)

    // Add new section
    definition.sections.push(section)

    return definition
  }

  return data
}
