import { type Page, type PageWithNext } from '@defra/forms-model'

/**
 * Check page has next link
 */
export function hasNext(page: Page): page is PageWithNext {
  const { next = [] } = page
  return next.length > 0
}
