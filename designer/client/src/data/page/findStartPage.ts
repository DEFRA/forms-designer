import { type FormDefinition } from '@defra/forms-model'

/**
 * Find correct start page for form definition
 * @param data - Form definition
 */
export function findStartPage(data: FormDefinition) {
  const { pages } = data

  // Return page to first page
  return pages[0]?.path
}
