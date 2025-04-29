export const GOVUK_HINT_CLASS = '.govuk-hint'
export const REORDERABLE_LIST_ITEM_CLASS = '.gem-c-reorderable-list__item'
export const RADIO_OPTION_DATA = 'radio-options-data'
export const OPTION_LABEL_DISPLAY = '.option-label-display'
export const INLINE_BLOCK = 'inline-block'
export const ERROR_HTML = '<p>error</p>'
export const JS_REORDERABLE_LIST_UP = 'js-reorderable-list-up'
export const JS_REORDERABLE_LIST_DOWN = 'js-reorderable-list-down'

/**
 * @param {Document | Element } rootElement
 * @param {string} selector
 * @returns {HTMLInputElement}
 */
export function getHtmlInputElement(rootElement, selector) {
  return /** @type {HTMLInputElement} */ (rootElement.querySelector(selector))
}

/**
 * @param {Document | Element } rootElement
 * @param {string} selector
 * @returns {HTMLElement}
 */
export function getHtmlElement(rootElement, selector) {
  return /** @type {HTMLElement} */ (rootElement.querySelector(selector))
}

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
 * Function to restore item to display mode
 * @param {Element} listItem
 */
export function restoreItemDisplay(listItem) {
  const labelDisplay = /** @type { HTMLElement | null } */ (
    listItem.querySelector(OPTION_LABEL_DISPLAY)
  )
  const editLink = /** @type { HTMLElement | null } */ (
    listItem.querySelector('.edit-item a')
  )
  const deleteLink = /** @type { HTMLElement | null } */ (
    listItem.querySelector('.delete-option-link')
  )
  const editForm = listItem.querySelector('.edit-option-form')

  if (editForm) {
    editForm.remove()
  }

  if (labelDisplay) {
    labelDisplay.style.display = 'block'
  }
  if (editLink) {
    editLink.style.display = INLINE_BLOCK
  }
  if (deleteLink) {
    deleteLink.style.display = INLINE_BLOCK
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

/**
 * @param {string} newHint
 * @param { Element | null | undefined } origHintElement
 * @param { Element | null } listOption
 */
export function addOrRemoveHint(newHint, origHintElement, listOption) {
  if (!newHint.length && origHintElement) {
    origHintElement.remove()
  }

  if (newHint.length) {
    if (!origHintElement) {
      const newHintElement = document.createElement('p')
      newHintElement.className = `govuk-hint govuk-!-margin-top-0 govuk-!-margin-bottom-0`
      newHintElement.textContent = newHint
      if (listOption) {
        listOption.appendChild(newHintElement)
      }
    } else {
      origHintElement.textContent = newHint
    }
  }
}

/**
 * Function to apply highlight to the preview
 * @param {string} type
 * @param {Element} radioList
 * @param {string} baseClassName
 */
export function applyHighlight(type, radioList, baseClassName) {
  const lastOption = radioList.querySelector(
    `.${baseClassName}__item:last-child`
  )
  if (!lastOption) {
    return
  }

  const elementToHighlight =
    type === 'label'
      ? lastOption.querySelector(`.${baseClassName}__label`)
      : lastOption.querySelector(`.${baseClassName}__hint`)

  if (elementToHighlight) {
    elementToHighlight.classList.add('highlight')
    return
  }
  if (type === 'hint') {
    // If hint element doesn't exist, create it
    const hintElement = document.createElement('div')
    hintElement.className = `govuk-hint ${baseClassName}__hint highlight`
    hintElement.textContent = 'Hint text'
    lastOption.appendChild(hintElement)
  }
}

/**
 * Function to remove highlight from the preview
 * @param {string} type
 * @param {Element} radioList
 * @param {string} baseClassName
 * @param {HTMLInputElement} newOptionHint
 */
export function removeHighlight(type, radioList, baseClassName, newOptionHint) {
  const lastOption = radioList.querySelector(
    `.${baseClassName}__item:last-child`
  )
  if (!lastOption) {
    return
  }

  const elementToUnhighlight =
    type === 'label'
      ? lastOption.querySelector(`.${baseClassName}__label`)
      : lastOption.querySelector(`.${baseClassName}__hint`)

  if (elementToUnhighlight) {
    elementToUnhighlight.classList.remove('highlight')
    // Remove empty hint element if it was just a placeholder
    if (
      type === 'hint' &&
      !newOptionHint.value.trim() &&
      elementToUnhighlight.textContent === 'Hint text'
    ) {
      elementToUnhighlight.remove()
    }
  }
}

/**
 * Function to show hint placeholder
 * @param {HTMLInputElement} newOptionHint
 * @param {Element} radioList
 * @param {string} baseClassName
 */
export function showHintPlaceholder(newOptionHint, radioList, baseClassName) {
  if (newOptionHint.value.trim()) {
    return
  }
  const lastOption = radioList.querySelector(
    `.${baseClassName}__item:last-child`
  )
  if (!lastOption) {
    return
  }

  let hintElement = lastOption.querySelector(`.${baseClassName}__hint`)
  if (!hintElement) {
    hintElement = document.createElement('div')
    hintElement.className = `govuk-hint ${baseClassName}__hint highlight`
    lastOption.appendChild(hintElement)
  }
  hintElement.textContent = 'Hint text'
}

/**
 * Function to remove hint placeholder
 * @param {HTMLInputElement} newOptionHint
 * @param {Element} radioList
 * @param {string} baseClassName
 */
export function removeHintPlaceholder(newOptionHint, radioList, baseClassName) {
  if (newOptionHint.value.trim()) {
    return
  }
  const lastOption = radioList.querySelector(
    `.${baseClassName}__item:last-child`
  )
  if (!lastOption) {
    return
  }

  const hintElement = lastOption.querySelector(`.${baseClassName}__hint`)
  if (hintElement && !newOptionHint.value.trim()) {
    hintElement.remove()
  }
}

// Function to update the hidden input with all current options
export function updateHiddenOptionsData() {
  const optionsContainer = getHtmlElement(document, '#options-container')
  const options = /** @type {ListItem[]} */ ([])
  const optionItems = optionsContainer.querySelectorAll(
    REORDERABLE_LIST_ITEM_CLASS
  )

  optionItems.forEach((item) => {
    const labelInput = item.querySelector(OPTION_LABEL_DISPLAY)
    const hintInput = item.querySelector(GOVUK_HINT_CLASS)
    const val = /** @type {HTMLElement} */ (item).dataset.val ?? ''
    const id = /** @type {HTMLElement} */ (item).dataset.id

    if (labelInput) {
      const label = labelInput.textContent?.replace(/\n/g, '').trim() ?? ''
      const hint = hintInput
        ? hintInput.textContent?.replace(/\n/g, '').trim()
        : ''
      const value = val.length ? val : label.toLowerCase().replace(/\s+/g, '-')

      const hintObj = hint?.length ? { hint: { text: hint } } : undefined

      options.push({
        text: label,
        ...hintObj,
        value,
        id
      })
    }
  })

  const radioOptionsData = /** @type {HTMLInputElement} */ (
    document.getElementById(RADIO_OPTION_DATA)
  )
  radioOptionsData.value = JSON.stringify(options)
}

/**
 * @param { HTMLElement | null } elem
 */
export function hideIfExists(elem) {
  if (elem) {
    elem.style.display = 'none'
  }
}

/**
 * @param { HTMLElement | null } elem
 */
export function focusIfExists(elem) {
  if (elem) {
    elem.focus()
  }
}

/**
 * @param { HTMLElement | Element | null } elem
 * @param {string} className
 */
export function addClassIfExists(elem, className) {
  if (elem) {
    elem.classList.add(className)
  }
}

/**
 * @param { HTMLElement | Element | null } elem
 * @param {string} className
 */
export function removeClassIfExists(elem, className) {
  if (elem) {
    elem.classList.remove(className)
  }
}

/**
 * @param {string} labelDisplayText
 * @param {string} hintDisplayText
 * @param {string} valueDisplayText
 * @returns {string}
 */
export function createEditHtml(
  labelDisplayText,
  hintDisplayText,
  valueDisplayText
) {
  // Create the edit form HTML
  return `
  <div class="edit-option-form govuk-!-margin-bottom-6">
    <h2 class="govuk-heading-m">Edit option</h2>

    <!-- Option Value (Label) -->
    <div class="govuk-form-group">
      <label class="govuk-label govuk-label--m" for="edit-option-label">Item</label>
      <input class="govuk-input" id="edit-option-label" name="edit-label" type="text"
        value="${labelDisplayText}">
    </div>

    <!-- Hint Text -->
    <div class="govuk-form-group">
      <label class="govuk-label govuk-label--m" for="edit-option-hint">Hint text (optional)</label>
      <div class="govuk-hint">Use single short sentence without a full stop</div>
      <input class="govuk-input" id="edit-option-hint" name="edit-hint" type="text"
        value="${hintDisplayText}">
    </div>

    <!-- Advanced Features Section -->
    <details class="govuk-details" data-module="govuk-details">
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">Advanced features</span>
      </summary>
      <div class="govuk-details__text">
        <!-- Additional Value -->
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="edit-option-value">Unique identifier (optional)</label>
          <div class="govuk-hint">Used in databases to identify the item</div>
          <input class="govuk-input" id="edit-option-value" name="edit-value" type="text"
            value="${valueDisplayText}">
        </div>
      </div>
    </details>

    <div class="govuk-button-group">
      <button type="button" class="govuk-button save-edit-button">Save changes</button>
      <a class="govuk-link cancel-edit-link" href="#">Cancel</a>
    </div>
</div>
`
}
