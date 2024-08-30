import { type Page } from '@defra/forms-model'

import { hasNext } from '~/src/data/page/hasNext.js'

/**
 * Find link by path
 */
export function findLink(pageFrom: Page, pageTo: Pick<Page, 'path'>) {
  const index = findLinkIndex(pageFrom, pageTo)
  const link = hasNext(pageFrom) ? pageFrom.next[index] : undefined

  if (index < 0 || !link) {
    throw Error(
      `Link not found for path '${pageFrom.path}' to '${pageTo.path}'`
    )
  }

  return link
}

/**
 * Find link index by path
 */
export function findLinkIndex(pageFrom: Page, pageTo: Pick<Page, 'path'>) {
  if (!hasNext(pageFrom)) {
    return -1
  }

  return pageFrom.next.findIndex(({ path }) => path === pageTo.path)
}
