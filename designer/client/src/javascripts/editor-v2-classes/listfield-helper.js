export const GOVUK_HINT_CLASS = '.govuk-hint'
export const REORDERABLE_LIST_ITEM_CLASS = '.gem-c-reorderable-list__item'
export const RADIO_OPTION_DATA = 'radio-options-data'
export const OPTION_LABEL_DISPLAY = '.option-label-display'
export const INLINE_BLOCK = 'inline-block'
export const ERROR_HTML = '<p>error</p>'
export const JS_REORDERABLE_LIST_UP = 'js-reorderable-list-up'
export const JS_REORDERABLE_LIST_DOWN = 'js-reorderable-list-down'

/**
 *
 * @param {HTMLElement} listItem
 * @param {string} baseClassName
 * @returns { Element | null }
 */
export function getClosestLabel(listItem, baseClassName) {
  const indexStr = listItem.dataset.index ?? '0'
  const index = parseInt(indexStr) - 1
  const previewItem = document
    .querySelector(`#listPreview-option${index}`)
    ?.closest(`.${baseClassName}__item`)
  if (previewItem) {
    const labelElement = previewItem.querySelector(`.${baseClassName}__label`)
    return labelElement
  }
  return null
}

/**
 * @param {Document} document
 * @returns {{ listItemsData: HTMLInputElement, listItems: ListItem[] }}
 */
export function getListItemsFromHidden(document) {
  const listItemsData = /** @type {HTMLInputElement} */ (
    document.getElementById(RADIO_OPTION_DATA)
  )
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const listItems = /** @type {ListItem[]} */ (JSON.parse(listItemsData.value))
  return {
    listItemsData,
    listItems
  }
}

/**
 * Function to add a single row in the hidden input with all current options
 * @param {Document} document
 * @param {string} id
 * @param {string} text - label
 * @param {string} hint
 * @param {string} value
 */
export function addItemToHiddenOptionsData(document, id, text, hint, value) {
  const { listItemsData, listItems } = getListItemsFromHidden(document)

  const hintObj = hint.length ? { hint: { text: hint } } : undefined

  listItems.push({
    id,
    text,
    ...hintObj,
    value
  })

  listItemsData.value = JSON.stringify(listItems)
}
