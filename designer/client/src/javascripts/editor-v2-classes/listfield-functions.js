import {
  REORDERABLE_LIST_ITEM_CLASS,
  applyHighlight,
  getHtmlElement,
  getHtmlInputElement
} from '~/src/javascripts/editor-v2-classes//listfield-helper.js'

/**
 * @param {ListField} local
 * @param {string} baseClassName
 */
export function addOptionButtonFn(local, baseClassName) {
  const addOptionForm = getHtmlElement(document, '#add-option-form')
  const addOptionButton = getHtmlElement(document, '#add-option-button')
  const newOptionLabel = getHtmlInputElement(document, '#radioText')
  const optionsContainer = getHtmlElement(document, '#options-container')
  const radioList = getHtmlElement(
    document,
    `#question-preview-content .${baseClassName}`
  )
  const addOptionHeading = getHtmlElement(document, '#add-option-heading')
  const currentOptions = optionsContainer.querySelectorAll(
    REORDERABLE_LIST_ITEM_CLASS
  )
  const nextItemNumber = currentOptions.length + 1
  addOptionHeading.textContent = `Item ${nextItemNumber}`
  addOptionForm.style.display = 'block'
  addOptionButton.style.display = 'none'
  newOptionLabel.focus()

  // Show initial preview immediately
  const radioListElement = document.querySelector(
    `#radio-list .${baseClassName}`
  )
  if (radioListElement) {
    radioListElement.innerHTML = local.getInitialPreviewHtml()
    applyHighlight('label', radioList, baseClassName)
  }
}

/**
 * @import {ListField} from '~/src/javascripts/editor-v2-classes//listfield.js'
 */
