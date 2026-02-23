import {
  ControllerType,
  hasComponents,
  hasComponentsEvenIfNoNext,
  hasConditionSupport,
  isEndPage
} from '@defra/forms-model'

import { stringHasValue } from '~/src/lib/utils.js'

/**
 * @param {Page} page
 * @param {{ button: string | undefined, itemId: string | undefined } | undefined } focus
 */
export function constructReorderPage(page, focus) {
  if (page.title === '') {
    return {
      ...page,
      title: hasComponents(page) ? page.components[0].title : '',
      isFocus: focus?.itemId === page.id,
      prevFocusDirection: focus?.button
    }
  }
  return {
    ...page,
    isFocus: focus?.itemId === page.id,
    prevFocusDirection: focus?.button
  }
}

/**
 * Removes any summary pages froma  list of pages
 * @param {Page[]} pages
 */
export function excludeEndPages(pages) {
  return pages.filter((page) => !isEndPage(page))
}

/**
 * Repositions a page or question in an array of items
 * @param {string[]} itemOrder
 * @param {string} direction
 * @param {string} itemId
 */
export function repositionItem(itemOrder, direction, itemId) {
  const itemIdx = itemOrder.findIndex((x) => x === itemId)

  const isValidDirection =
    direction === 'down' || (direction === 'up' && itemIdx > 0)

  if (itemIdx === -1 || !isValidDirection) {
    return itemOrder
  }

  const positionIndex = direction === 'down' ? itemIdx + 1 : itemIdx - 1

  return itemOrder.toSpliced(itemIdx, 1).toSpliced(positionIndex, 0, itemId)
}

/**
 * Orders a list of pages (or questions) based on a list of ids
 * @template { Page | ComponentDef | Section } T
 * @param {T[]} orderableItems
 * @param {string} itemOrder
 */
export function orderItems(orderableItems, itemOrder) {
  const itemIdsInOrder = itemOrder.split(',')
  const itemsInOrder = /** @type {T[]} */ ([])
  itemIdsInOrder.forEach((pid) => {
    const foundItem = orderableItems.find((item) => item.id === pid)
    if (foundItem) {
      itemsInOrder.push(foundItem)
    }
  })
  return itemsInOrder
}

/**
 * @param {string} focusStr
 */
export function getFocus(focusStr) {
  const [direction, itemId] = focusStr ? focusStr.split('|') : []
  if (!stringHasValue(direction) || !stringHasValue(itemId)) {
    return undefined
  }

  return {
    itemId,
    button: direction
  }
}

/**
 * @param {Page} page
 * @param {number} index
 */
export function withPageNumbers(page, index) {
  return {
    page,
    number: index + 1
  }
}

/**
 * @param {Page} page
 */
export function hasConditionSupportForPage(page) {
  return (
    hasComponentsEvenIfNoNext(page) &&
    page.components.some(hasConditionSupport) &&
    page.controller !== ControllerType.Repeat
  )
}

/**
 * @import { ComponentDef, Page, Section } from '@defra/forms-model'
 */
