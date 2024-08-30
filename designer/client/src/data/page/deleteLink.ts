import { type FormDefinition, type Page } from '@defra/forms-model'

import { findLink } from '~/src/data/page/findLink.js'
import { findPage } from '~/src/data/page/findPage.js'
import { hasNext } from '~/src/data/page/hasNext.js'

/**
 * Delete link from page
 */
export function deleteLink(
  data: FormDefinition,
  pageFrom: Page,
  pageTo: Pick<Page, 'path'>
) {
  const definition = structuredClone(data)

  // Confirm pages exist
  const pageFromCopy = findPage(definition, pageFrom.path)
  const pageToCopy = findPage(definition, pageTo.path)

  if (!hasNext(pageFromCopy)) {
    throw Error(`Links not found for path '${pageFrom.path}'`)
  }

  // Find link
  const link = findLink(pageFromCopy, pageToCopy)
  const index = pageFromCopy.next.indexOf(link)

  // Delete link from page
  pageFromCopy.next.splice(index, 1)

  return definition
}
