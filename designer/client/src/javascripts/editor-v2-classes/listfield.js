import Sortable from 'sortablejs'
import { v4 as uuidV4 } from 'uuid'

import { ComponentBase } from '~/src/javascripts/editor-v2-classes/component-base.js'

const GOVUK_HINT_CLASS = '.govuk-hint'
const REORDERABLE_LIST_ITEM_CLASS = '.gem-c-reorderable-list__item'
const RADIO_OPTION_DATA = 'radio-options-data'
const INLINE_BLOCK = 'inline-block'
const ERROR_HTML = '<p>error</p>'

export class ListField extends ComponentBase {
  /**
   * @param {Document} document
   */
  constructor(document) {
    super(document)
    this.initialiseSpecifics()
  }

  setupDomElements() {
    this.baseDomElements = {
      questionLabelInput: this.document.getElementById('question'),
      questionLabelOutput: /** @type { HTMLElement | null } */ (
        this.document
          .getElementById('question-label-output')
          ?.querySelector('h1')
      ),
      hintTextInput: this.document.getElementById('hintText'),
      hintTextOutput: /** @type { HTMLElement | null } */ (
        this.document
          .getElementById('question-label-output')
          ?.querySelector(GOVUK_HINT_CLASS)
      ),
      makeOptionInput: this.document.getElementById('questionOptional')
    }
  }

  /**
   * @returns {string}
   */
  getInitialPreviewHtml() {
    return ERROR_HTML
  }

  /**
   * @param {number} newIndex
   * @param {string} newId
   * @param {string} labelValue
   * @param {string} hintValue
   * @param {string} valueValue
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNewOptionHtml(newIndex, newId, labelValue, hintValue, valueValue) {
    return ERROR_HTML
  }

  /**
   * @param {number} index
   * @param { string | undefined } label
   * @param { string | undefined } hint
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSingleOptionHtml(index, label, hint) {
    return ERROR_HTML
  }

  /**
   * @param {string} labelValue
   * @param { string | undefined } hintValue
   * @param {string} valueAttr
   * @param {Element} newOptionHint
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNewOptionPreview(labelValue, hintValue, valueAttr, newOptionHint) {
    return ERROR_HTML
  }

  /**
   * @returns {string}
   */
  getBaseClassName() {
    return 'unknown'
  }

  /**
   * @param {number} index
   * @param { string | undefined } label
   * @param { string | undefined } hint
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHtmlForInsert(index, label, hint) {
    return ERROR_HTML
  }

  initialiseSpecifics() {
    const baseClassName = this.getBaseClassName()

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const local = this
    /** @type { Sortable | undefined } */
    let sortableInstance
    document.addEventListener('DOMContentLoaded', function () {
      // Get form elements
      const addOptionForm = /** @type {HTMLElement} */ (
        document.querySelector('#add-option-form')
      )
      const addOptionButton = /** @type {HTMLElement} */ (
        document.querySelector('#add-option-button')
      )
      const saveItemButton = /** @type {HTMLElement} */ (
        document.querySelector('#save-new-option')
      )
      const cancelButton = /** @type {HTMLElement} */ (
        document.querySelector('#cancel-add-option')
      )
      const newOptionLabel = /** @type {HTMLInputElement} */ (
        document.querySelector('#radioText')
      )
      const newOptionHint = /** @type {HTMLInputElement} */ (
        document.querySelector('#radioHint')
      )
      const newOptionValue = /** @type { HTMLInputElement | null } */ (
        document.querySelector('#radioValue')
      )
      const optionsContainer = /** @type {HTMLElement} */ (
        document.querySelector('#options-container')
      )
      const radioList = /** @type { HTMLElement | null } */ (
        document.querySelector(`#question-preview-content .${baseClassName}`)
      )
      const questionForm = /** @type {HTMLElement} */ (
        document.getElementById('question-form')
      )
      const addOptionHeading = /** @type {HTMLElement} */ (
        document.querySelector('#add-option-heading')
      )

      // Add option button click
      addOptionButton.addEventListener('click', function (e) {
        e.preventDefault()
        const currentOptions = optionsContainer.querySelectorAll(
          REORDERABLE_LIST_ITEM_CLASS
        )
        const nextItemNumber = currentOptions.length + 1
        addOptionHeading.textContent = `Item ${nextItemNumber}`
        addOptionForm.style.display = 'block'
        addOptionButton.style.display = 'none'
        newOptionLabel.focus()

        // Show initial preview immediately
        const radioList = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (radioList) {
          radioList.innerHTML = local.getInitialPreviewHtml()
          applyHighlight('label')
        }
        updatePreview() // Update preview for any existing items
      })

      // Cancel button click
      cancelButton.addEventListener('click', function (e) {
        e.preventDefault()
        hideForm()
      })

      // Add live preview event listeners
      newOptionLabel.addEventListener('input', updatePreview)
      newOptionHint.addEventListener('input', updatePreview)
      if (newOptionValue) {
        newOptionValue.addEventListener('input', updatePreview)
      }

      // Add focus/blur event listeners for highlighting
      newOptionLabel.addEventListener('focus', () => applyHighlight('label'))
      newOptionLabel.addEventListener('blur', () => removeHighlight('label'))
      newOptionHint.addEventListener('focus', () => {
        applyHighlight('hint')
        showHintPlaceholder()
      })
      newOptionHint.addEventListener('blur', () => {
        removeHighlight('hint')
        removeHintPlaceholder()
      })

      // Save new item button click
      saveItemButton.addEventListener('click', function (e) {
        e.preventDefault()
        const labelValue = newOptionLabel.value.trim()
        const hintValue = newOptionHint.value.trim()
        const valueValue = newOptionValue?.value.trim()
        const valueEnforced = valueValue?.length
          ? valueValue
          : labelValue.toLowerCase().replace(/\s+/g, '-')

        // Add the new option with conditions
        const currentOptions = optionsContainer.querySelectorAll(
          REORDERABLE_LIST_ITEM_CLASS
        )
        const newIndex = currentOptions.length

        const newId = uuidV4()
        const newOptionHTML = local.getNewOptionHtml(
          newIndex,
          newId,
          labelValue,
          hintValue,
          valueEnforced
        )

        optionsContainer.insertAdjacentHTML('beforeend', newOptionHTML)
        hideForm()
        updateAllOptionsPreview()
        addItemToHiddenOptionsData(newId, labelValue, hintValue, valueEnforced)
        updateEditOptionsButtonVisibility()
      })

      // Function to update the edit button visibility
      function updateEditOptionsButtonVisibility() {
        const editButton = document.getElementById('edit-options-button')
        const optionItems = optionsContainer.querySelectorAll(
          REORDERABLE_LIST_ITEM_CLASS
        )
        if (editButton) {
          editButton.style.display =
            optionItems.length > 1 ? INLINE_BLOCK : 'none'
        }
      }

      // Initialize edit button visibility on page load
      document.addEventListener(
        'DOMContentLoaded',
        updateEditOptionsButtonVisibility
      )

      function hideForm() {
        addOptionForm.style.display = 'none'
        addOptionButton.style.display = INLINE_BLOCK
        newOptionLabel.value = ''
        newOptionHint.value = ''
        if (newOptionValue) {
          newOptionValue.value = ''
        }
        removeHighlight('label')
        removeHighlight('hint')
        updateAllOptionsPreview()
        updateEditOptionsButtonVisibility()
        addOptionButton.focus()
      }

      // Function to update the live preview of the option being added
      function updatePreview() {
        const radioList = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioList) {
          return
        }

        const labelValue = newOptionLabel.value.trim()
        const hintValue = newOptionHint.value.trim()
          ? newOptionHint.value.trim()
          : undefined
        const valueAttr = newOptionValue?.value.trim()
          ? newOptionValue.value.trim()
          : labelValue

        // Get existing options
        const existingOptions = Array.from(
          optionsContainer.querySelectorAll(REORDERABLE_LIST_ITEM_CLASS)
        )

        // Start with existing options HTML
        let allOptionsHTML = ''

        // Always show either existing options or the new option being added
        if (
          existingOptions.length === 0 &&
          addOptionForm.style.display === 'none'
        ) {
          allOptionsHTML = `
            <div class="govuk-inset-text">
              <p class="govuk-body">No items added yet.</p>
            </div>
          `
        } else {
          // Add existing options
          allOptionsHTML = existingOptions
            .map((item, index) => {
              const label = item
                .querySelector('.option-label-display')
                ?.textContent?.trim()
              const hint = item
                .querySelector('.govuk_hint')
                ?.textContent?.trim()
              return local.getSingleOptionHtml(index, label, hint)
            })
            .join('')

          // Add the new option preview if the form is visible
          if (addOptionForm.style.display === 'block') {
            const newOptionPreview = local.getNewOptionPreview(
              labelValue,
              hintValue,
              valueAttr,
              newOptionHint
            )
            allOptionsHTML += newOptionPreview
          }
        }

        radioList.innerHTML = allOptionsHTML

        // Reapply highlights if needed
        if (document.activeElement === newOptionLabel) {
          applyHighlight('label')
        } else if (document.activeElement === newOptionHint) {
          applyHighlight('hint')
        }
      }

      // Function to update the preview of all existing options
      function updateAllOptionsPreview() {
        const radioList = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioList) {
          return
        }

        const items = optionsContainer.querySelectorAll(
          REORDERABLE_LIST_ITEM_CLASS
        )
        radioList.innerHTML = ''

        if (items.length === 0) {
          radioList.innerHTML = `
            <div class="govuk-inset-text">
              <p class="govuk-body">No items added yet.</p>
            </div>
          `
          return
        }

        items.forEach((item, index) => {
          const label = item
            .querySelector('.option-label-display')
            ?.textContent?.trim()
          const hint = item.querySelector(GOVUK_HINT_CLASS)?.textContent?.trim()
          const radioHTML = local.getHtmlForInsert(index, label, hint)
          radioList.insertAdjacentHTML('beforeend', radioHTML)
        })
      }

      /**
       * Function to apply highlight to the preview
       * @param {string} type
       */
      function applyHighlight(type) {
        if (!radioList) {
          return
        }
        const lastOption = radioList.querySelector(
          `.${baseClassName}__item:last-child`
        )
        if (!lastOption) return

        const elementToHighlight =
          type === 'label'
            ? lastOption.querySelector(`.${baseClassName}__label`)
            : lastOption.querySelector(`.${baseClassName}__hint`)

        if (elementToHighlight) {
          elementToHighlight.classList.add('highlight')
        } else if (type === 'hint') {
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
       */
      function removeHighlight(type) {
        if (!radioList) {
          return
        }
        const lastOption = radioList.querySelector(
          `.${baseClassName}__item:last-child`
        )
        if (!lastOption) return

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

      // Function to show hint placeholder
      function showHintPlaceholder() {
        if (!radioList || newOptionHint.value.trim()) {
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

      // Function to remove hint placeholder
      function removeHintPlaceholder() {
        if (!radioList || newOptionHint.value.trim()) {
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

      // Initialize the preview
      updateAllOptionsPreview()

      // Add event delegation for edit form hint text inputs
      document.addEventListener(
        'focus',
        function (e) {
          const targetElem = /** @type {Element} */ (e.target)
          if (targetElem.classList.contains('option-hint-input')) {
            const closestElem = /** @type {HTMLElement} */ (
              targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
            )
            const optionIndex = closestElem.dataset.index ?? '0'
            const previewOption = radioList
              ?.querySelector(`#listPreview-option${parseInt(optionIndex) - 1}`)
              ?.closest(`.${baseClassName}__item`)
            let hintElement = previewOption?.querySelector(
              `.${baseClassName}__hint`
            )

            if (!hintElement) {
              hintElement = document.createElement('div')
              hintElement.className = `govuk-hint ${baseClassName}__hint highlight`
              hintElement.textContent = 'Hint text'
              if (previewOption) {
                previewOption.appendChild(hintElement)
              }
            } else {
              hintElement.classList.add('highlight')
            }
          }
        },
        true
      )

      document.addEventListener(
        'blur',
        function (e) {
          const targetElem = /** @type {Element} */ (e.target)
          if (targetElem.classList.contains('option-hint-input')) {
            const closestElem = /** @type {HTMLElement} */ (
              targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
            )
            const optionIndex = closestElem.dataset.index ?? '0'
            const previewOption = radioList
              ?.querySelector(`#listPreview-option${parseInt(optionIndex) - 1}`)
              ?.closest(`.${baseClassName}__item`)
            const hintElement = previewOption?.querySelector(
              `.${baseClassName}__hint`
            )

            if (hintElement) {
              hintElement.classList.remove('highlight')
              const targetInputElem = /** @type {HTMLInputElement} */ (
                targetElem
              )
              if (
                !targetInputElem.value.trim() &&
                hintElement.textContent === 'Hint text'
              ) {
                hintElement.remove()
              }
            }
          }
        },
        true
      )

      /**
       * Function to add a single row in the hidden input with all current options
       * @param {string} id
       * @param {string} text - label
       * @param {string} hint
       * @param {string} value
       */
      function addItemToHiddenOptionsData(id, text, hint, value) {
        const listItemsData = /** @type {HTMLInputElement} */ (
          document.getElementById(RADIO_OPTION_DATA)
        )
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const listItems =
          /** @type {{ text?: string, hint?: { text?: string }, value?: string, id?: string }[]} */ (
            JSON.parse(listItemsData.value)
          )

        const hintObj = hint.length ? { hint: { text: hint } } : undefined

        listItems.push({
          id,
          text,
          ...hintObj,
          value
        })

        listItemsData.value = JSON.stringify(listItems)
      }

      // Function to update the hidden input with all current options
      function updateHiddenOptionsData() {
        const options =
          /** @type {{ text?: string, hint?: { text?: string, id?: string }, value?: string, id?: string }[]} */ ([])
        const optionItems = optionsContainer.querySelectorAll(
          REORDERABLE_LIST_ITEM_CLASS
        )

        optionItems.forEach((item) => {
          const labelInput = item.querySelector('.option-label-display')
          const hintInput = item.querySelector(GOVUK_HINT_CLASS)
          const val = /** @type {HTMLElement} */ (item).dataset.val ?? ''
          const id = /** @type {HTMLElement} */ (item).dataset.id

          if (labelInput) {
            const label =
              labelInput.textContent?.replace(/\n/g, '').trim() ?? ''
            const hint = hintInput
              ? hintInput.textContent?.replace(/\n/g, '').trim()
              : ''
            const value = val.length
              ? val
              : label.toLowerCase().replace(/\s+/g, '-')

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

      // Form submission handler
      questionForm.addEventListener('submit', function () {
        updateHiddenOptionsData() // Ensure options are up to date before submitting
        return true
      })

      // Initialize Sortable for the options container
      const sortableContainer = document.getElementById('options-container')
      if (sortableContainer) {
        sortableInstance = Sortable.create(sortableContainer, {
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'highlight-dragging',
          onStart: function (evt) {
            const index = evt.oldIndex
            highlightPreviewItem(index)
          },
          onEnd: function () {
            updateAllOptionsPreview()
            updateHiddenOptionsData()
            updateMoveButtons()
            removePreviewHighlights()
          },
          disabled: true
        })
      }

      // Function to highlight preview item
      /**
       * @param { number | undefined } index
       */
      function highlightPreviewItem(index) {
        if (index === undefined || index === -1) {
          return
        }

        const radioList = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioList) {
          return
        }

        // Remove any existing highlights
        removePreviewHighlights()

        // Add highlight to the corresponding preview item
        const previewItem = radioList.querySelector(
          `.${baseClassName}__item:nth-child(${index + 1})`
        )
        if (previewItem) {
          previewItem.classList.add('highlight')
        }
      }

      // Function to remove all preview highlights
      function removePreviewHighlights() {
        const radioList = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioList) {
          return
        }

        const items = radioList.querySelectorAll(`.${baseClassName}__item`)
        items.forEach((item) => item.classList.remove('highlight'))
      }

      // Add focus/blur handlers for list items in edit mode
      document.addEventListener('focusin', function (e) {
        const targetElem = /** @type {Element} */ (e.target)
        if (
          targetElem.classList.contains('js-reorderable-list-up') ||
          targetElem.classList.contains('js-reorderable-list-down')
        ) {
          const listItem = targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
          if (listItem?.parentNode) {
            const index = Array.from(listItem.parentNode.children).indexOf(
              listItem
            )
            highlightPreviewItem(index)
          }
        }
      })

      document.addEventListener('focusout', function (e) {
        const targetElem = /** @type {Element} */ (e.target)
        if (
          targetElem.classList.contains('js-reorderable-list-up') ||
          targetElem.classList.contains('js-reorderable-list-down')
        ) {
          removePreviewHighlights()
        }
      })

      const editOptionsButton = document.getElementById('edit-options-button')

      // Add hover handlers for list items in edit mode
      document.addEventListener('mouseover', function (e) {
        const targetElem = /** @type {Element} */ (e.target)
        const listItem = targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
        if (
          listItem &&
          editOptionsButton?.textContent?.trim() === 'Re-order' &&
          listItem.parentNode
        ) {
          const index = Array.from(listItem.parentNode.children).indexOf(
            listItem
          )
          highlightPreviewItem(index)
        }
      })

      document.addEventListener('mouseout', function (e) {
        const targetElem = /** @type {Element} */ (e.target)
        const listItem = targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
        if (listItem && editOptionsButton?.textContent?.trim() === 'Re-order') {
          removePreviewHighlights()
        }
      })

      // Add edit options button functionality
      if (editOptionsButton) {
        editOptionsButton.addEventListener('click', function (e) {
          e.preventDefault()
          const listItems = /** @type {NodeListOf<HTMLElement>} */ (
            document.querySelectorAll(REORDERABLE_LIST_ITEM_CLASS)
          )
          const actionButtons = /** @type {NodeListOf<HTMLElement>} */ (
            document.querySelectorAll('.gem-c-reorderable-list__actions')
          )
          const editDeleteLinks = /** @type {NodeListOf<HTMLElement>} */ (
            document.querySelectorAll('.edit-item')
          )
          const addButton = document.getElementById('add-option-button')

          // Toggle button text and state
          const isReordering = editOptionsButton.textContent?.trim() !== 'Done'
          editOptionsButton.textContent = isReordering ? 'Done' : 'Re-order'

          // Toggle button style - add inverse when NOT editing (showing "Re-order")
          if (isReordering) {
            editOptionsButton.classList.remove('govuk-button--inverse')
          } else {
            editOptionsButton.classList.add('govuk-button--inverse')
          }

          // Show/hide add button based on edit state
          if (addButton) {
            addButton.style.display = isReordering ? 'none' : INLINE_BLOCK
          }

          // Toggle action buttons visibility
          actionButtons.forEach((actions) => {
            actions.style.display = isReordering ? 'flex' : 'none'
          })

          // Toggle edit/delete links visibility
          editDeleteLinks.forEach((links) => {
            links.style.display = isReordering ? 'none' : 'block'
          })

          // Update cursor style and hover effect
          listItems.forEach((item) => {
            if (isReordering) {
              item.style.cursor = 'move'
              item.classList.add('sortable-enabled')
            } else {
              item.style.cursor = 'default'
              item.classList.remove('sortable-enabled')
            }
          })

          // Enable/disable sorting
          if (sortableInstance) {
            sortableInstance.option('disabled', !isReordering)
          }

          // Update button visibility and focus when entering edit mode
          if (isReordering) {
            updateMoveButtons()
            const firstItem = listItems[0]
            // if (firstItem) {
            const firstDownButton = /** @type { HTMLElement | null } */ (
              firstItem.querySelector('.js-reorderable-list-down')
            )
            if (firstDownButton) {
              firstDownButton.focus()
            }
          }
        })
      }

      // Function to update the visibility of Up/Down buttons
      function updateMoveButtons() {
        const items = optionsContainer.querySelectorAll(
          REORDERABLE_LIST_ITEM_CLASS
        )
        items.forEach((item, index) => {
          const upButton = /** @type { HTMLElement | null } */ (
            item.querySelector('.js-reorderable-list-up')
          )
          const downButton = /** @type { HTMLElement | null } */ (
            item.querySelector('.js-reorderable-list-down')
          )

          if (upButton && downButton) {
            // First item - only show Down
            if (index === 0) {
              upButton.style.display = 'none'
              downButton.style.display = INLINE_BLOCK
            }
            // Last item - only show Up
            else if (index === items.length - 1) {
              upButton.style.display = INLINE_BLOCK
              downButton.style.display = 'none'
            }
            // Middle items - show both
            else {
              upButton.style.display = INLINE_BLOCK
              downButton.style.display = INLINE_BLOCK
            }
          }
        })
      }

      // Add Up/Down button functionality
      document.addEventListener('click', function (e) {
        const targetElem = /** @type {Element} */ (e.target)
        if (targetElem.classList.contains('js-reorderable-list-up')) {
          const item = targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
          const prevItem = item?.previousElementSibling
          if (prevItem && item.parentNode) {
            item.parentNode.insertBefore(item, prevItem)
            updateAllOptionsPreview()
            updateHiddenOptionsData()
            updateMoveButtons()
          }
        } else if (targetElem.classList.contains('js-reorderable-list-down')) {
          const item = targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
          const nextItem = item?.nextElementSibling
          if (nextItem && item.parentNode) {
            item.parentNode.insertBefore(nextItem, item)
            updateAllOptionsPreview()
            updateHiddenOptionsData()
            updateMoveButtons()
          }
        }
      })

      /**
       * Function to delete an item
       * @param { HTMLElement | null } listItem
       */
      function deleteItem(listItem) {
        if (!listItem) {
          return
        }

        const listItemsData = /** @type {HTMLInputElement} */ (
          document.getElementById(RADIO_OPTION_DATA)
        )
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const listItems =
          /** @type {{ text?: string, hint?: { text?: string }, value?: string, id?: string }[]} */ (
            JSON.parse(listItemsData.value)
          )
        const newListItems = listItems.filter(
          (x) => x.id !== listItem.dataset.id
        )
        listItemsData.value = JSON.stringify(newListItems)

        // Remove the radio
        listItem.remove()

        updateEditOptionsButtonVisibility()

        // Update the preview
        updateAllOptionsPreview()
      }

      /**
       * Function to convert a list item to editable form
       * @param { HTMLElement | null } listItem
       */
      function makeItemEditable(listItem) {
        if (!listItem) {
          return
        }

        const listItemsData = /** @type {HTMLInputElement} */ (
          document.getElementById(RADIO_OPTION_DATA)
        )
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const listItems =
          /** @type {{ text?: string, hint?: { text?: string }, value?: string, id?: string }[]} */ (
            JSON.parse(listItemsData.value)
          )

        const currentListItem = listItems.find(
          (x) => x.id === listItem.dataset.id
        )

        const labelDisplayText = currentListItem?.text ?? ''
        const labelDisplay = /** @type { HTMLElement | null } */ (
          listItem.querySelector('.option-label-display')
        )
        const hintDisplay = /** @type { HTMLElement | null } */ (
          listItem.querySelector(GOVUK_HINT_CLASS)
        )
        const hintDisplayText = currentListItem?.hint?.text ?? ''
        const editLink = /** @type { HTMLElement | null } */ (
          listItem.querySelector('.edit-item a')
        )
        const valueDisplayText = currentListItem?.value ?? ''

        // Create the edit form HTML
        const editFormHTML = `
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

        // Hide the display elements
        if (labelDisplay) {
          labelDisplay.style.display = 'none'
        }
        if (editLink) {
          editLink.style.display = 'none'
        }
        const deleteOptionLink = /** @type { HTMLElement | null } */ (
          listItem.querySelector('.delete-option-link')
        )
        if (deleteOptionLink) {
          deleteOptionLink.style.display = 'none'
        }

        // Insert the edit form
        const listArea = listItem.querySelector(
          '.gem-c-reorderable-list__content'
        )
        if (listArea) {
          listArea.insertAdjacentHTML('beforeend', editFormHTML)
        }

        // Add event listeners for the new form
        const editForm = listItem.querySelector('.edit-option-form')
        const saveButton = /** @type { HTMLElement | null } */ (
          editForm?.querySelector('.save-edit-button')
        )
        const cancelButton = editForm?.querySelector('.cancel-edit-link')
        const editLabelInput = /** @type { HTMLInputElement | null } */ (
          editForm?.querySelector('#edit-option-label')
        )
        const editHintInput = /** @type { HTMLInputElement | null } */ (
          editForm?.querySelector('#edit-option-hint')
        )
        const editValueInput = /** @type { HTMLInputElement | null } */ (
          editForm?.querySelector('#edit-option-value')
        )

        // Focus the label input
        if (editLabelInput) {
          editLabelInput.focus()
        }

        // Save changes
        if (!saveButton) {
          return
        }
        // Save changes of existing item being edited
        saveButton.addEventListener('click', () => {
          const newLabel = editLabelInput?.value.trim() ?? ''
          const newHint = editHintInput?.value.trim() ?? ''
          const newValue = editValueInput?.value.trim() ?? ''
          const valueEnforced = newValue.length
            ? newValue
            : newLabel.toLowerCase().replace(/\s+/g, '-')

          // Update the values
          if (labelDisplay) {
            labelDisplay.textContent = newLabel
          }
          if (hintDisplay) {
            hintDisplay.textContent = newHint
          }

          // Update hidden data list
          if (currentListItem) {
            currentListItem.text = newLabel
            currentListItem.hint = { text: newHint }
            currentListItem.value = valueEnforced
          }

          listItemsData.value = JSON.stringify(listItems)

          // Add/remove hint
          const listOption = listItem.querySelector(
            '.gem-c-reorderable-list__content'
          )
          let hintElement = listOption?.querySelector(GOVUK_HINT_CLASS)
          if (newHint.length) {
            if (!hintElement) {
              hintElement = document.createElement('p')
              hintElement.className = `govuk-hint govuk-!-margin-top-0 govuk-!-margin-bottom-0`
              if (listOption) {
                listOption.appendChild(hintElement)
              }
            }
            hintElement.textContent = newHint
          } else if (hintElement) {
            hintElement.remove()
          }

          // Restore the display
          restoreItemDisplay(listItem)

          // Update the preview
          updateAllOptionsPreview()
        })

        // Cancel editing
        if (cancelButton) {
          cancelButton.addEventListener('click', (e) => {
            e.preventDefault()
            restoreItemDisplay(listItem)
          })
        }

        // Add preview updating on input
        if (editHintInput) {
          editHintInput.addEventListener('input', () => {
            updateEditPreview(
              listItem,
              editLabelInput?.value,
              editHintInput.value
            )
          })
        }

        if (editLabelInput) {
          editLabelInput.addEventListener('input', () => {
            updateEditPreview(
              listItem,
              editLabelInput.value,
              editHintInput?.value
            )
          })

          // Add focus/blur event listeners for highlighting
          editLabelInput.addEventListener('focus', () => {
            const indexStr = listItem.dataset.index ?? '0'
            const index = parseInt(indexStr) - 1
            const previewItem = document
              .querySelector(`#listPreview-option${index - 1}`)
              ?.closest(`.${baseClassName}__item`)
            if (previewItem) {
              const labelElement = previewItem.querySelector(
                `.${baseClassName}__label`
              )
              if (labelElement) {
                labelElement.classList.add('highlight')
              }
            }
          })

          editLabelInput.addEventListener('blur', () => {
            const indexStr = listItem.dataset.index ?? '0'
            const index = parseInt(indexStr) - 1
            const previewItem = document
              .querySelector(`#listPreview-option${index - 1}`)
              ?.closest(`.${baseClassName}__item`)
            if (previewItem) {
              const labelElement = previewItem.querySelector(
                `.${baseClassName}__label`
              )
              if (labelElement) {
                labelElement.classList.remove('highlight')
              }
            }
          })
        }

        // Update preview immediately to show current state
        updateEditPreview(listItem, editLabelInput?.value, editHintInput?.value)

        // If label input is already focused, apply highlight immediately
        if (document.activeElement === editLabelInput) {
          const indexStr = listItem.dataset.index ?? '0'
          const index = parseInt(indexStr) - 1
          const previewItem = document
            .querySelector(`#listPreview-option${index - 1}`)
            ?.closest(`.${baseClassName}__item`)
          if (previewItem) {
            const labelElement = previewItem.querySelector(
              `.${baseClassName}__label`
            )
            if (labelElement) {
              labelElement.classList.add('highlight')
            }
          }
        }
      }

      /**
       * Function to restore item to display mode
       * @param {Element} listItem
       */
      function restoreItemDisplay(listItem) {
        const labelDisplay = /** @type { HTMLElement | null } */ (
          listItem.querySelector('.option-label-display')
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
       * Function to update preview while editing
       * @param {HTMLElement} listItem
       * @param { string | undefined } labelValue
       * @param { string | undefined } hintValue
       */
      function updateEditPreview(listItem, labelValue, hintValue) {
        const indexStr = listItem.dataset.index ?? '0'
        const index = parseInt(indexStr) - 1
        const previewItem = radioList
          ?.querySelector(`#listPreview-option${index}`)
          ?.closest(`.${baseClassName}__item`)

        if (previewItem) {
          const label = /** @type { HTMLElement | null } */ (
            previewItem.querySelector(`.${baseClassName}__label`)
          )
          let hint = previewItem.querySelector(`.${baseClassName}__hint`)

          if (label) {
            label.textContent = labelValue ?? 'Item text'
          }

          if (hintValue) {
            if (!hint) {
              hint = document.createElement('div')
              hint.className = `govuk-hint ${baseClassName}__hint`
              previewItem.appendChild(hint)
            }
            hint.textContent = hintValue
          } else if (hint) {
            hint.remove()
          }
        }
      }

      // Add click handler for edit and delete links
      document.addEventListener('click', function (e) {
        const targetElem = /** @type {Element} */ (e.target)
        const isEdit = targetElem.classList.contains('edit-option-link')
        const isDelete = targetElem.classList.contains('delete-option-link')
        if (isEdit || isDelete) {
          e.preventDefault()
          const listItem = /** @type { HTMLElement | null } */ (
            targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
          )
          if (listItem) {
            if (isEdit) {
              makeItemEditable(listItem)
            } else {
              deleteItem(listItem)
            }
          }
        }
      })
    })
  }
}
