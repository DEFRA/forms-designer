import { type FormDefinition } from '~/src/form/form-definition/types.js'

/**
 * Find correct start page for form definition
 *
 * Computed by counting the next paths in a form definition and returning page
 * that doesn't have a reference, meaning it must be a start page / root node
 *
 * It's possibe for forms to be malformed and have multiple start pages while
 * they're being developed. This may be valid during development, but in this
 * scenario we can't detect the real start page and we require the user to fix
 * this themselves
 * @param data - Form definition
 */
export function findStartPage(data: FormDefinition) {
  const { pages } = data

  return pages[0]
}
