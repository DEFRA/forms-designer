/**
 * @param {{items: CheckboxOrRadioItem[]}} elem
 * @param {string} itemValue - the radio or checkbox value of the option for which the dynamic content is to be inserted
 * @param {string} conditionalHtml
 */
export function setConditionalAttribute(elem, itemValue, conditionalHtml) {
  const newElement = {
    ...elem
  }
  const itemPos = newElement.items.findIndex((x) => x.value === itemValue)
  if (itemPos !== -1) {
    newElement.items[itemPos] = {
      ...newElement.items[itemPos],
      conditional: {
        html: conditionalHtml
      }
    }
  }

  return newElement
}

/**
 * @import { CheckboxOrRadioItem } from '@defra/forms-model'
 */
