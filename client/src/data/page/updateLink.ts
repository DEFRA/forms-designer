import { type FormDefinition, type Link, type Page } from '@defra/forms-model'

import { findLink, findLinkIndex } from '~/src/data/page/findLink.js'
import { findPage } from '~/src/data/page/findPage.js'

/**
 * Update link to page
 */
export function updateLink(
  data: FormDefinition,
  pageFrom: Page,
  pageTo: Pick<Page, 'path'>,
  options?: Partial<Link>
) {
  // Prevent linking to same page
  if (pageFrom.path === (options?.path ?? pageTo.path)) {
    throw new Error('Link must be between different pages')
  }

  // Confirm link exists
  const link = findLink(pageFrom, pageTo)

  // Skip unnecessary updates
  if (!options || link === options) {
    return data
  }

  const definition = structuredClone(data)

  // Confirm pages exist
  const pageFromCopy = findPage(definition, pageFrom.path)
  const pageToCopy = findPage(definition, pageTo.path)

  // Confirm updated page exists (optional)
  const pageToMoved =
    !!options.path && options.path !== pageTo.path
      ? findPage(data, options.path)
      : undefined

  // Throw when changes clash with existing link
  if (pageToMoved && findLinkIndex(pageFrom, pageToMoved) > -1) {
    throw new Error(
      `Link already exists for path '${pageFrom.path}' to '${options.path}'`
    )
  }

  // Find existing link
  const linkCopy = findLink(pageFromCopy, pageToCopy)

  // Reset link properties
  delete linkCopy.condition
  delete linkCopy.redirect

  // Update link properties
  Object.assign(linkCopy, options)

  return definition
}
