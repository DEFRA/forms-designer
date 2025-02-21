/**
 * @param {{items: any[]}} elem
 * @param {number} itemPos
 * @param {string} conditionalHtml
 */
export function setConditionalAttribute(elem, itemPos, conditionalHtml) {
  const newElement = {
    ...elem
  }
  newElement.items[itemPos] = {
    ...newElement.items[itemPos],
    conditional: {
      html: conditionalHtml
    }
  }

  return newElement
}

/**
 * @import { Item } from '@types/govuk-frontend'
 */
