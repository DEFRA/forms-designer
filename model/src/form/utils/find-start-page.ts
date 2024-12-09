import { type FormDefinition } from '~/src/form/form-definition/types.js'
import { ControllerType } from '~/src/pages/enums.js'
import { controllerNameFromPath, hasNext } from '~/src/pages/helpers.js'

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
  const pages = data.pages.filter(hasNext)

  // Check for start pages
  const startPage = pages.find(
    ({ controller }) =>
      controllerNameFromPath(controller) === ControllerType.Start
  )

  if (startPage) {
    return startPage.path
  }

  // Extract all link paths
  const linkPaths = pages
    .filter(hasNext)
    .flatMap(({ next }) => next.map(({ path }) => path))

  // For each page on the form, work out if it's referenced by another page
  // those that aren't referenced must be form pages used as start pages
  const pagesUnlinked = pages.filter(({ path }) => !linkPaths.includes(path))

  // We can only set the start page if there is a single one, else the user has made an error
  if (pagesUnlinked.length === 1) {
    return pagesUnlinked[0].path
  }
}
