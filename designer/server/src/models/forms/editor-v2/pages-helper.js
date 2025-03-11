import { ControllerType, hasComponents } from '@defra/forms-model'

import { stringHasValue } from '~/src/lib/utils.js'

/**
 * @param {Page} page
 * @param {number} pageIdx
 * @param {number} numOfPages
 * @param {{ button: string | undefined, pageId: string | undefined} | undefined} focus
 */
export function constructReorderPage(page, pageIdx, numOfPages, focus) {
  const focusUpAttr =
    focus?.pageId === page.id && focus?.button === 'up' ? ' autofocus' : ''
  const focusDownAttr =
    focus?.pageId === page.id && focus?.button === 'down' ? ' autofocus' : ''

  const buttonStub =
    '<button type="submit" name="movement" class="govuk-button govuk-button--secondary'
  const upVisibilityClass = `reorder-button${pageIdx === 0 ? '-hidden' : ''}`
  const downVisibilityClass = `reorder-button${pageIdx === numOfPages - 1 ? '-hidden' : ''}`

  const actions = [
    {
      html: `${buttonStub} ${upVisibilityClass}"${focusUpAttr} value="up|${page.id}">Up</button>`
    },
    {
      html: `${buttonStub} ${downVisibilityClass}"${focusDownAttr} value="down|${page.id}">Down</button>`
    }
  ]

  if (page.title === '') {
    return {
      ...page,
      title: hasComponents(page) ? page.components[0].title : '',
      isFocus: focus?.pageId === page.id,
      actions
    }
  }
  return {
    ...page,
    actions,
    isFocus: focus?.pageId === page.id
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
 * @param {string[]} pageOrder
 * @param {string} direction
 * @param {string} pageId
 */
export function repositionPage(pageOrder, direction, pageId) {
  const pageIdx = pageOrder.findIndex((x) => x === pageId)

  const isValidDirection =
    direction === 'down' || (direction === 'up' && pageIdx > 0)

  if (pageIdx === -1 || !isValidDirection) {
    return pageOrder
  }

  const positionIndex = direction === 'down' ? pageIdx + 1 : pageIdx - 1

  return pageOrder.toSpliced(pageIdx, 1).toSpliced(positionIndex, 0, pageId)
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
 * @param {string} focusStr
 */
export function getFocus(focusStr) {
  const [direction, pageId] = focusStr ? focusStr.split('|') : []
  if (!stringHasValue(direction) || !stringHasValue(pageId)) {
    return undefined
  }

  return {
    pageId,
    button: direction
  }
}

/**
 * @import { Page } from '@defra/forms-model'
 */
