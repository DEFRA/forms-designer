import {
  hasComponents,
  type FormDefinition,
  type Section
} from '@defra/forms-model'

import { findSection } from '~/src/data/section/findSection.js'

/**
 * Update section and associated pages
 */
export function updateSection(
  data: FormDefinition,
  sectionName: string,
  sectionUpdate: Section
) {
  try {
    // Throw for missing section
    findSection(data, sectionName)
  } catch {
    // Copy form definition
    const definition = structuredClone(data)
    const { pages, sections } = definition

    // Find section
    const sectionEdit = findSection({ sections }, sectionName)

    // Update pages with previous section name
    if (sectionEdit.name !== sectionUpdate.name) {
      const pagesToUpdate = pages
        .filter(hasComponents)
        .filter((page) => page.section === sectionName)

      // Update page section
      for (const page of pagesToUpdate) {
        page.section = sectionUpdate.name
      }
    }

    // Update section properties
    Object.assign(sectionEdit, sectionUpdate)

    return definition
  }

  return data
}
