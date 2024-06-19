import { type FormDefinition } from '~/src/form/form-definition/types.js'

/**
 * Find correct start page for form definition
 * @param data - Form definition
 */
export function findStartPage(data: FormDefinition) {
  const { pages } = data

  // Return page to first page
  return pages[0]?.path
}
