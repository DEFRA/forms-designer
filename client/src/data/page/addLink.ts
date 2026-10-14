import {
  hasNext,
  type FormDefinition,
  type Link,
  type Page
} from '@defra/forms-model'

import { findLink } from '~/src/data/page/findLink.js'
import { findPage } from '~/src/data/page/findPage.js'

/**
 * Add link to page
 */
export function addLink(
  data: FormDefinition,
  pageFrom: Page,
  pageTo: Pick<Page, 'path'>,
  options?: Omit<Link, 'path'>
) {
  // Prevent linking to same page
  if (pageFrom.path === pageTo.path) {
    throw new Error('Link must be between different pages')
  }

  const definition = structuredClone(data)

  // Confirm pages exist
  const pageFromCopy = findPage(definition, pageFrom.path)
  const pageToCopy = findPage(definition, pageTo.path)

  if (!hasNext(pageFromCopy)) {
    throw Error(`Links not found for path '${pageFromCopy.path}'`)
  }

  try {
    // Throw for missing link
    findLink(pageFrom, pageTo)
  } catch {
    // Add link to page
    pageFromCopy.next.push({
      path: pageToCopy.path,
      ...options
    })

    return definition
  }

  return data
}
