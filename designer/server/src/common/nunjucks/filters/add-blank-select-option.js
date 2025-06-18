const blankOptionId = '__0__'

/**
 * @param {{items: CheckboxOrRadioItem[]}} elem
 */
export function addBlankSelectOption(elem) {
  if (!elem.items.length) {
    return elem
  }

  if (elem.items[0].id !== blankOptionId) {
    elem.items.unshift({ id: blankOptionId, text: '', value: '' })
  }

  return elem
}

/**
 * @import { CheckboxOrRadioItem } from '@defra/forms-model'
 */
