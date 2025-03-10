import { ControllerType, hasComponents } from '@defra/forms-model'

/**
 * @param {Page} page
 * @param {number} pageIdx
 * @param {number} numOfPages
 */
export function constructPage(page, pageIdx, numOfPages) {
  const buttonStub =
    '<button type="submit" name="movement" class="govuk-button govuk-button--secondary'
  const actions = [
    {
      html: `${buttonStub} reorder-button${pageIdx === 0 ? '-hidden' : ''}" value="up|${page.id}">Up</button>`
    },
    {
      html: `${buttonStub} reorder-button${pageIdx === numOfPages - 1 ? '-hidden' : ''}" value="down|${page.id}">Down</button>`
    }
  ]

  if (page.title === '') {
    return {
      ...page,
      title: hasComponents(page) ? page.components[0].title : '',
      actions
    }
  }
  return {
    ...page,
    actions
  }
}

/**
 * Removes any summary pages froma  list of pages
 * @param {Page[]} pages
 */
export function excludeEndPages(pages) {
  return pages.filter((page) => page.controller !== ControllerType.Summary)
}

/**
 * Repositions a page in an array of pages
 * @param {string} pageIds
 * @param {string} direction
 * @param {string} pageId
 */
export function repositionPage(pageIds, direction, pageId) {
  const pageOrder = pageIds.split(',')
  const pageIdx = pageOrder.findIndex((x) => x === pageId)

  if (pageIdx === -1) {
    return pageIds
  }

  if (direction === 'down') {
    pageOrder.splice(pageIdx, 1)
    pageOrder.splice(pageIdx + 1, 0, pageId)
  } else if (direction === 'up' && pageIdx > 0) {
    pageOrder.splice(pageIdx, 1)
    pageOrder.splice(pageIdx - 1, 0, pageId)
  } else {
    return pageIds
  }

  return pageOrder.join(',')
}

/**
 * Orders a list of pages based on a list of ids
 * @param {Page[]} orderablePages
 * @param {string} pageOrder
 */
export function orderPages(orderablePages, pageOrder) {
  const pageIdsInOrder = pageOrder.split(',')
  const pagesInOrder = /** @type {Page[]} */ ([])
  pageIdsInOrder.forEach((pid) => {
    const foundPage = orderablePages.find((page) => page.id === pid)
    if (foundPage) {
      pagesInOrder.push(foundPage)
    }
  })
  return pagesInOrder
}

/**
 * @import { Page } from '@defra/forms-model'
 */
