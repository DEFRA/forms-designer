import { type FormDefinition } from '~/src/form/form-definition/types.js'
import { findStartPage } from '~/src/form/utils/find-start-page.js'

/**
 * Update start page when pages are modified
 * @param data - Form definition
 */
export function updateStartPage(data: FormDefinition) {
  const startPage = findStartPage(data)

  // Update start page if incorrect
  if (startPage && (!data.startPage || data.startPage !== startPage)) {
    return { ...data, startPage }
  }

  // Remove start page if no pages exist
  if (!startPage && 'startPage' in data) {
    const updated = { ...data }

    // Remove without modifying original
    delete updated.startPage
    return updated
  }

  return data
}
