import { findStartPage, type FormDefinition } from '@defra/forms-model'

/**
 * Update start page when pages are modified
 * @param data - Form definition
 */
export function fixupPages(data: FormDefinition) {
  const startPage = findStartPage(data)

  // Update start page if incorrect
  if (startPage && (!data.startPage || data.startPage !== startPage)) {
    return { ...structuredClone(data), startPage }
  }

  // Remove start page if no pages exist
  if (!startPage && 'startPage' in data) {
    const definition = structuredClone(data)

    // Remove without modifying original
    delete definition.startPage
    return definition
  }

  return data
}
