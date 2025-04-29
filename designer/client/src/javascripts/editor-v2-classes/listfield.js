import Sortable from 'sortablejs'
import { v4 as uuidV4 } from 'uuid'

import { ComponentBase } from '~/src/javascripts/editor-v2-classes/component-base.js'
import {
  ERROR_HTML,
  GOVUK_HINT_CLASS,
  INLINE_BLOCK,
  JS_REORDERABLE_LIST_DOWN,
  JS_REORDERABLE_LIST_UP,
  OPTION_LABEL_DISPLAY,
  REORDERABLE_LIST_ITEM_CLASS,
  addClassIfExists,
  addItemToHiddenOptionsData,
  addOrRemoveHint,
  applyHighlight,
  createEditHtml,
  focusIfExists,
  getClosestLabel,
  getHtmlElement,
  getHtmlInputElement,
  getListItemsFromHidden,
  hideIfExists,
  removeClassIfExists,
  removeHighlight,
  removeHintPlaceholder,
  restoreItemDisplay,
  showHintPlaceholder,
  updateHiddenOptionsData
} from '~/src/javascripts/editor-v2-classes/listfield-helper'

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
   * @param {number} _newIndex
   * @param {string} _newId
   * @param {string} _labelValue
   * @param {string} _hintValue
   * @param {string} _valueValue
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNewOptionHtml(_newIndex, _newId, _labelValue, _hintValue, _valueValue) {
    return ERROR_HTML
  }

  /**
   * @param {number} _index
   * @param { string | undefined } _label
   * @param { string | undefined } _hint
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSingleOptionHtml(_index, _label, _hint) {
    return ERROR_HTML
  }

  /**
   * @param {string} _labelValue
   * @param { string | undefined } _hintValue
   * @param {string} _valueAttr
   * @param {Element} _newOptionHint
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNewOptionPreview(_labelValue, _hintValue, _valueAttr, _newOptionHint) {
    return ERROR_HTML
  }

  /**
   * @returns {string}
   */
  getBaseClassName() {
    return 'unknown'
  }

  /**
   * @param {number} _index
   * @param { string | undefined } _label
   * @param { string | undefined } _hint
   * @returns {string}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHtmlForInsert(_index, _label, _hint) {
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
      const addOptionForm = getHtmlElement(document, '#add-option-form')
      const addOptionButton = getHtmlElement(document, '#add-option-button')
      const saveItemButton = getHtmlElement(document, '#save-new-option')
      const cancelItemButton = getHtmlElement(document, '#cancel-add-option')
      const newOptionLabel = getHtmlInputElement(document, '#radioText')
      const newOptionHint = getHtmlInputElement(document, '#radioHint')
      const newOptionValue = getHtmlInputElement(document, '#radioValue')
      const optionsContainer = getHtmlElement(document, '#options-container')
      const radioList = getHtmlElement(
        document,
        `#question-preview-content .${baseClassName}`
      )
      const addOptionHeading = getHtmlElement(document, '#add-option-heading')

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
        const radioListElement = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (radioListElement) {
          radioListElement.innerHTML = local.getInitialPreviewHtml()
          applyHighlight('label', radioList, baseClassName)
        }
        updatePreview() // Update preview for any existing items
      })

      // Cancel button click
      cancelItemButton.addEventListener('click', function (e) {
        e.preventDefault()
        hideForm()
      })

      // Add live preview event listeners
      newOptionLabel.addEventListener('input', updatePreview)
      newOptionHint.addEventListener('input', updatePreview)
      newOptionValue.addEventListener('input', updatePreview)

      // Add focus/blur event listeners for highlighting
      newOptionLabel.addEventListener('focus', () =>
        applyHighlight('label', radioList, baseClassName)
      )
      newOptionLabel.addEventListener('blur', () =>
        removeHighlight('label', radioList, baseClassName, newOptionHint)
      )
      newOptionHint.addEventListener('focus', () => {
        applyHighlight('hint', radioList, baseClassName)
        showHintPlaceholder(newOptionHint, radioList, baseClassName)
      })
      newOptionHint.addEventListener('blur', () => {
        removeHighlight('hint', radioList, baseClassName, newOptionHint)
        removeHintPlaceholder(newOptionHint, radioList, baseClassName)
      })

      // Save new item button click
      saveItemButton.addEventListener('click', function (e) {
        e.preventDefault()
        const labelValue = newOptionLabel.value.trim()
        const hintValue = newOptionHint.value.trim()
        const valueValue = newOptionValue.value.trim()
        const valueEnforced = valueValue.length
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
        addItemToHiddenOptionsData(
          document,
          newId,
          labelValue,
          hintValue,
          valueEnforced
        )
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
        newOptionValue.value = ''
        removeHighlight('label', radioList, baseClassName, newOptionHint)
        removeHighlight('hint', radioList, baseClassName, newOptionHint)
        updateAllOptionsPreview()
        updateEditOptionsButtonVisibility()
        addOptionButton.focus()
      }

      // Function to update the live preview of the option being added
      function updatePreview() {
        const radioListElement = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioListElement) {
          return
        }

        const labelValue = newOptionLabel.value.trim()
        const hintValue = newOptionHint.value.trim()
          ? newOptionHint.value.trim()
          : undefined
        const valueAttr = newOptionValue.value.trim()
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
                .querySelector(OPTION_LABEL_DISPLAY)
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

        radioListElement.innerHTML = allOptionsHTML

        // Reapply highlights if needed
        if (document.activeElement === newOptionLabel) {
          applyHighlight('label', radioList, baseClassName)
        }
        if (document.activeElement === newOptionHint) {
          applyHighlight('hint', radioList, baseClassName)
        }
      }

      // Function to update the preview of all existing options
      function updateAllOptionsPreview() {
        const radioListElement = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioListElement) {
          return
        }

        const items = optionsContainer.querySelectorAll(
          REORDERABLE_LIST_ITEM_CLASS
        )
        radioListElement.innerHTML = ''

        if (items.length === 0) {
          radioListElement.innerHTML = `
            <div class="govuk-inset-text">
              <p class="govuk-body">No items added yet.</p>
            </div>
          `
          return
        }

        items.forEach((item, index) => {
          const label = item
            .querySelector(OPTION_LABEL_DISPLAY)
            ?.textContent?.trim()
          const hint = item.querySelector(GOVUK_HINT_CLASS)?.textContent?.trim()
          const radioHTML = local.getHtmlForInsert(index, label, hint)
          radioListElement.insertAdjacentHTML('beforeend', radioHTML)
        })
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
              .querySelector(`#listPreview-option${parseInt(optionIndex) - 1}`)
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
              .querySelector(`#listPreview-option${parseInt(optionIndex) - 1}`)
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

        const radioListElement = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioListElement) {
          return
        }

        // Remove any existing highlights
        removePreviewHighlights()

        // Add highlight to the corresponding preview item
        const previewItem = radioListElement.querySelector(
          `.${baseClassName}__item:nth-child(${index + 1})`
        )
        addClassIfExists(previewItem, 'highlight')
      }

      // Function to remove all preview highlights
      function removePreviewHighlights() {
        const radioListElement = document.querySelector(
          `#radio-list .${baseClassName}`
        )
        if (!radioListElement) {
          return
        }

        const items = radioListElement.querySelectorAll(
          `.${baseClassName}__item`
        )
        items.forEach((item) => item.classList.remove('highlight'))
      }

      // Add focus/blur handlers for list items in edit mode
      document.addEventListener('focusin', function (e) {
        const targetElem = /** @type {Element} */ (e.target)
        if (
          targetElem.classList.contains(JS_REORDERABLE_LIST_UP) ||
          targetElem.classList.contains(JS_REORDERABLE_LIST_DOWN)
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
          targetElem.classList.contains(JS_REORDERABLE_LIST_UP) ||
          targetElem.classList.contains(JS_REORDERABLE_LIST_DOWN)
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
        if (targetElem.classList.contains(JS_REORDERABLE_LIST_UP)) {
          const item = targetElem.closest(REORDERABLE_LIST_ITEM_CLASS)
          const prevItem = item?.previousElementSibling
          if (prevItem && item.parentNode) {
            item.parentNode.insertBefore(item, prevItem)
            updateAllOptionsPreview()
            updateHiddenOptionsData()
            updateMoveButtons()
          }
          return
        }

        if (targetElem.classList.contains(JS_REORDERABLE_LIST_DOWN)) {
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

        const { listItemsData, listItems } = getListItemsFromHidden(document)

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
       * @param {FormDetails} formDetails
       */
      function setupSaveChangesButtonExistingItem(formDetails) {
        // Save changes of existing item being edited
        formDetails.saveButton.addEventListener('click', () => {
          const newLabel = formDetails.editLabelInput.value.trim()
          const newHint = formDetails.editHintInput.value.trim()
          const newValue = formDetails.editValueInput.value.trim()
          const valueEnforced = newValue.length
            ? newValue
            : newLabel.toLowerCase().replace(/\s+/g, '-')

          // Update the values
          formDetails.labelDisplay.textContent = newLabel
          formDetails.hintDisplay.textContent = newHint

          // Update hidden data list
          formDetails.currentListItem.text = newLabel
          formDetails.currentListItem.hint = { text: newHint }
          formDetails.currentListItem.value = valueEnforced

          formDetails.listItemsData.value = JSON.stringify(
            formDetails.listItems
          )

          // Add/remove hint
          const listOption = formDetails.listItem.querySelector(
            '.gem-c-reorderable-list__content'
          )
          const origHintElement = listOption?.querySelector(GOVUK_HINT_CLASS)

          addOrRemoveHint(newHint, origHintElement, listOption)

          // Restore the display
          restoreItemDisplay(formDetails.listItem)

          // Update the preview
          updateAllOptionsPreview()
        })
      }

      /**
       * @param {FormDetails} formDetails
       */
      function addEditableEventListeners(formDetails) {
        // Cancel editing
        formDetails.cancelButton.addEventListener('click', (e) => {
          e.preventDefault()
          restoreItemDisplay(formDetails.listItem)
        })

        // Add preview updating on input
        formDetails.editHintInput.addEventListener('input', () => {
          updateEditPreview(
            formDetails.listItem,
            formDetails.editLabelInput.value,
            formDetails.editHintInput.value
          )
        })

        formDetails.editLabelInput.addEventListener('input', () => {
          updateEditPreview(
            formDetails.listItem,
            formDetails.editLabelInput.value,
            formDetails.editHintInput.value
          )
        })

        // Add focus/blur event listeners for highlighting
        formDetails.editLabelInput.addEventListener('focus', () => {
          const labelElement = getClosestLabel(
            formDetails.listItem,
            formDetails.baseClassName
          )
          addClassIfExists(labelElement, 'highlight')
        })

        formDetails.editLabelInput.addEventListener('blur', () => {
          const labelElement = getClosestLabel(
            formDetails.listItem,
            baseClassName
          )
          removeClassIfExists(labelElement, 'highlight')
        })
      }

      /**
       * Function to convert a list item to editable form
       * @param {HTMLElement} listItem
       */
      function makeItemEditable(listItem) {
        const { listItemsData, listItems } = getListItemsFromHidden(document)

        const currentListItem = listItems.find(
          (x) => x.id === listItem.dataset.id
        )

        const labelDisplayText = currentListItem?.text ?? ''
        const hintDisplayText = currentListItem?.hint?.text ?? ''
        const labelDisplay = getHtmlElement(listItem, OPTION_LABEL_DISPLAY)
        const hintDisplay = getHtmlElement(listItem, GOVUK_HINT_CLASS)
        const editLink = getHtmlElement(listItem, '.edit-item a')
        const deleteOptionLink = getHtmlElement(listItem, '.delete-option-link')
        const valueDisplayText = currentListItem?.value ?? ''

        // Create the edit form HTML
        const editFormHTML = createEditHtml(
          labelDisplayText,
          hintDisplayText,
          valueDisplayText
        )

        // Hide the display elements
        hideIfExists(labelDisplay)
        hideIfExists(deleteOptionLink)
        hideIfExists(editLink)

        // Insert the edit form
        const listArea = listItem.querySelector(
          '.gem-c-reorderable-list__content'
        )
        if (listArea) {
          listArea.insertAdjacentHTML('beforeend', editFormHTML)
        }

        // Add event listeners for the new form
        const editForm = listItem.querySelector('.edit-option-form')
        const saveButton = getHtmlElement(editForm, '.save-edit-button')
        const cancelButton = editForm?.querySelector('.cancel-edit-link')
        const editLabelInput = getHtmlInputElement(
          editForm,
          '#edit-option-label'
        )
        const editHintInput = getHtmlInputElement(editForm, '#edit-option-hint')
        const editValueInput = getHtmlInputElement(
          editForm,
          '#edit-option-value'
        )

        // Focus the label input
        focusIfExists(editLabelInput)

        // Save changes
        const formDetails = /** @type {FormDetails} */ ({
          saveButton,
          editLabelInput,
          editHintInput,
          editValueInput,
          labelDisplay,
          hintDisplay,
          currentListItem,
          listItemsData,
          listItems,
          listItem,
          cancelButton,
          baseClassName
        })
        setupSaveChangesButtonExistingItem(formDetails)
        addEditableEventListeners(formDetails)

        // Update preview immediately to show current state
        updateEditPreview(listItem, editLabelInput.value, editHintInput.value)

        // If label input is already focused, apply highlight immediately
        if (document.activeElement === editLabelInput) {
          const labelElement = getClosestLabel(listItem, baseClassName)
          addClassIfExists(labelElement, 'highlight')
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
          .querySelector(`#listPreview-option${index}`)
          ?.closest(`.${baseClassName}__item`)

        if (previewItem) {
          const label = /** @type { HTMLElement | null } */ (
            previewItem.querySelector(`.${baseClassName}__label`)
          )
          const origHint = previewItem.querySelector(`.${baseClassName}__hint`)

          if (!hintValue && origHint) {
            origHint.remove()
          }

          if (label) {
            label.textContent = labelValue ?? 'Item text'
          }

          if (hintValue) {
            if (!origHint) {
              const newHint = document.createElement('div')
              newHint.className = `govuk-hint ${baseClassName}__hint`
              newHint.textContent = hintValue
              previewItem.appendChild(newHint)
            } else {
              origHint.textContent = hintValue
            }
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
