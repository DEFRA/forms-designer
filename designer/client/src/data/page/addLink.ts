import { type FormDefinition, type Link } from '@defra/forms-model'

import { findPage } from '~/src/data/page/findPage.js'
import { type Path } from '~/src/data/types.js'

/**
 * @param data - Data from DataContext
 * @param from - path to link from
 * @param to - path to link to
 * @param condition - condition for path branching
 * @throws Error - if a page has been linked to itself
 */
export function addLink(
  data: FormDefinition,
  from: Path,
  to: Path,
  condition?: string
): FormDefinition {
  if (from === to) {
    throw Error('cannot link a page to itself')
  }
  const [fromPage, index] = findPage(data, from)
  findPage(data, to)
  const pages = [...data.pages]

  const existingLink = fromPage.next?.find((page) => page.path === to)

  if (!existingLink) {
    const link: Link = {
      path: to
    }

    if (condition) {
      link.condition = condition
    }

    const updatedPage = {
      ...fromPage,
      next: [...(fromPage.next ?? []), link]
    }

    return {
      ...data,
      pages: pages.map((page, i) => (i === index ? updatedPage : page))
    }
  } else {
    return data
  }
}
