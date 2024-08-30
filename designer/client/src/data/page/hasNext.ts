import { type Link, type Page } from '@defra/forms-model'

/**
 * Check page has next link
 */
export function hasNext(page?: Page): page is Extract<Page, { next: Link[] }> {
  return !!page && 'next' in page
}
