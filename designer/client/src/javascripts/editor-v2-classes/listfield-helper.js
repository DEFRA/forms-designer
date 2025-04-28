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
