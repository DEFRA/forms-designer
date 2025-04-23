import Sortable from 'sortablejs'

import { ComponentBase } from '~/src/javascripts/editor-v2-classes/component-base.js'

export class RadiosField extends ComponentBase {
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
          ?.querySelector('.govuk-hint')
      ),
      makeOptionInput: this.document.getElementById('questionOptional')
    }
  }

  initialiseSpecifics() {
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
        document.querySelector('#question-preview-content .govuk-radios')
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
          '.gem-c-reorderable-list__item'
        )
        const nextItemNumber = currentOptions.length + 1
        addOptionHeading.textContent = `Item ${nextItemNumber}`
        addOptionForm.style.display = 'block'
        addOptionButton.style.display = 'none'
        newOptionLabel.focus()

        // Show initial preview immediately
        const radioList = document.querySelector('#radio-list .govuk-radios')
        if (radioList) {
          radioList.innerHTML = `
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="listPreview-option-new" name="listPreview" type="radio">
              <label class="govuk-label govuk-radios__label" for="listPreview-option-new">Item text</label>
            </div>
          `
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
      newOptionValue.addEventListener('input', updatePreview)

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

      // Save item button click
      saveItemButton.addEventListener('click', function (e) {
        e.preventDefault()
        const labelValue = newOptionLabel.value.trim()

        /*
        // Get conditions data
        const conditions = []
        const conditionName = document
          .getElementById('condition-name')
          ?.value.trim()
        const questionSelect = document.getElementById('condition-question')
        const operatorSelect = document.getElementById('condition-operator')
        const valueContainer = document.getElementById(
          'condition-value-container'
        )

        if (
          conditionName &&
          questionSelect &&
          operatorSelect &&
          valueContainer
        ) {
          // Add first condition
          const firstQuestionText = questionSelect.options[
            questionSelect.selectedIndex
          ].text
            .replace(/\s*\([^)]*\)/, '')
            .trim()
          const firstQuestionType =
            questionSelect.options[questionSelect.selectedIndex].getAttribute(
              'data-type'
            )
          let firstValue = ''

          if (firstQuestionType === 'radios') {
            const selectedRadio = valueContainer.querySelector(
              'input[type="radio"]:checked'
            )
            firstValue = selectedRadio ? selectedRadio.value : ''
          } else if (firstQuestionType === 'checkboxes') {
            const checkedBoxes = valueContainer.querySelectorAll(
              'input[type="checkbox"]:checked'
            )
            firstValue = Array.from(checkedBoxes).map((cb) => cb.value)
          } else {
            const selectElement = valueContainer.querySelector('select')
            firstValue = selectElement ? selectElement.value : ''
          }

          conditions.push({
            conditionName,
            rules: [
              {
                questionText: firstQuestionText,
                operator: operatorSelect.value,
                value: firstValue,
                logicalOperator: null
              }
            ]
          })

          // Get additional conditions
          const additionalConditions = document.querySelectorAll(
            '#additional-conditions .condition-item'
          )
          additionalConditions.forEach((condition) => {
            const logicalOperator =
              condition.querySelector('select[name^="logical-operator"]')
                ?.value ?? 'AND'
            const questionSelect = condition.querySelector(
              '.condition-question'
            )
            const operatorSelect = condition.querySelector(
              'select[id^="condition-operator"]'
            )
            const valueContainer = condition.querySelector(
              '.condition-value-container'
            )

            if (questionSelect && operatorSelect && valueContainer) {
              const questionText = questionSelect.options[
                questionSelect.selectedIndex
              ].text
                .replace(/\s*\([^)]*\)/, '')
                .trim()
              const questionType =
                questionSelect.options[
                  questionSelect.selectedIndex
                ].getAttribute('data-type')
              let value = ''

              if (questionType === 'radios') {
                const selectedRadio = valueContainer.querySelector(
                  'input[type="radio"]:checked'
                )
                value = selectedRadio ? selectedRadio.value : ''
              } else if (questionType === 'checkboxes') {
                const checkedBoxes = valueContainer.querySelectorAll(
                  'input[type="checkbox"]:checked'
                )
                value = Array.from(checkedBoxes).map((cb) => cb.value)
              } else {
                const selectElement = valueContainer.querySelector('select')
                value = selectElement ? selectElement.value : ''
              }

              conditions[0].rules.push({
                questionText,
                operator: operatorSelect.value,
                value,
                logicalOperator
              })
            }
          })
        }
        */
        // Add the new option with conditions
        const currentOptions = optionsContainer.querySelectorAll(
          '.gem-c-reorderable-list__item'
        )
        const newIndex = currentOptions.length

        const newOptionHTML = `
          <li class="gem-c-reorderable-list__item" draggable="true" data-index="${newIndex + 1}">
            <div class="gem-c-reorderable-list__wrapper">
              <div class="gem-c-reorderable-list__content">
                <p class="govuk-body fauxlabel option-label-display" id="option-${newIndex + 1}-label-display">
                  ${labelValue}
                </p>
                ${
                  newOptionHint.value.trim()
                    ? `
                <p class="govuk-body fauxlabel option-label-display" style="color: #505a5f;">
                  ${newOptionHint.value}
                </p>
                `
                    : ''
                }
                <input type="hidden" id="option-${newIndex + 1}-label" class="option-label-input-hidden" 
                  name="option[${newIndex + 1}][option_label]" value="${labelValue}">
                <input type="hidden" id="option-${newIndex + 1}-hint" class="option-hint-input"
                  name="option[${newIndex + 1}][option_hint]" value="${newOptionHint.value}">
              </div>
              <div class="gem-c-reorderable-list__actions">
                <button class="gem-c-button govuk-button govuk-button--secondary js-reorderable-list-up"
                  type="button" aria-label="Move option up">Up</button>
                <button class="gem-c-button govuk-button govuk-button--secondary js-reorderable-list-down"
                  type="button" aria-label="Move option down">Down</button>
              </div>
              <div class="edit-item">
                <ul class="govuk-summary-list__actions-list">
                  <li class="govuk-summary-list__actions-list-item">
                    <a class="govuk-link govuk-link--no-visited-state" href="editoption.html?index=${newIndex + 1}">
                      Edit<span class="govuk-visually-hidden">option ${newIndex + 1}</span>
                    </a>
                  </li>
                  <li class="govuk-summary-list__actions-list-item">
                    <a class="govuk-link govuk-link--destructive delete-option-link" href="delete-option.html?index=${newIndex + 1}&text=${encodeURIComponent(labelValue)}" onclick="return true;">
                      Delete<span class="govuk-visually-hidden"> list item</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        `

        optionsContainer.insertAdjacentHTML('beforeend', newOptionHTML)
        hideForm()
        updateAllOptionsPreview()
        updateHiddenOptionsData()
        updateEditButtonVisibility()
      })

      // Function to update the re-order button visibility
      function updateEditButtonVisibility() {
        const editButton = document.getElementById('edit-options-button')
        const optionItems = optionsContainer.querySelectorAll(
          '.gem-c-reorderable-list__item'
        )
        if (editButton) {
          editButton.style.display =
            optionItems.length > 1 ? 'inline-block' : 'none'
        }
      }

      // Initialize edit button visibility on page load
      document.addEventListener('DOMContentLoaded', updateEditButtonVisibility)

      function hideForm() {
        addOptionForm.style.display = 'none'
        addOptionButton.style.display = 'inline-block'
        newOptionLabel.value = ''
        newOptionHint.value = ''
        newOptionValue.value = ''
        removeHighlight('label')
        removeHighlight('hint')
        updateAllOptionsPreview()
        updateEditButtonVisibility()
        addOptionButton.focus()
      }

      // Function to update the live preview of the option being added
      function updatePreview() {
        const radioList = document.querySelector('#radio-list .govuk-radios')
        if (!radioList) return

        const labelValue = newOptionLabel.value.trim()
        const hintValue = newOptionHint.value.trim()
          ? newOptionHint.value.trim()
          : undefined
        const valueAttr = newOptionValue?.value.trim()
          ? newOptionValue.value.trim()
          : labelValue

        // Get existing options
        const existingOptions = Array.from(
          optionsContainer.querySelectorAll('.gem-c-reorderable-list__item')
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
                .textContent?.trim()
              const hint = item
                .querySelector('.govuk_hint')
                ?.textContent?.trim()
              return `
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="listPreview-option${index}" name="listPreview" type="radio" value="${label}">
                <label class="govuk-label govuk-radios__label" for="listPreview-option${index}">${label}</label>
                ${hint ? `<div class="govuk-hint govuk-radios__hint">${hint}</div>` : ''}
              </div>
            `
            })
            .join('')

          // Add the new option preview if the form is visible
          if (addOptionForm.style.display === 'block') {
            const newOptionPreview = `
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="listPreview-option-new" name="listPreview" type="radio" value="${valueAttr}">
                <label class="govuk-label govuk-radios__label" for="listPreview-option-new">${labelValue !== '' ? labelValue : 'Item text'}</label>
                ${hintValue || document.activeElement === newOptionHint ? `<div class="govuk-hint govuk-radios__hint">${hintValue ?? 'Hint text'}</div>` : ''}
              </div>
            `
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
        const radioList = document.querySelector('#radio-list .govuk-radios')
        if (!radioList) return

        const items = optionsContainer.querySelectorAll(
          '.gem-c-reorderable-list__item'
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
            .textContent.trim()
          const hint = item.querySelector('input[name$="[option_hint]"]')?.value

          const radioHTML = `
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="listPreview-option${index}" name="listPreview" type="radio" value="${label}">
              <label class="govuk-label govuk-radios__label" for="listPreview-option${index}">${label}</label>
              ${hint ? `<div class="govuk-hint govuk-radios__hint">${hint}</div>` : ''}
            </div>
          `
          radioList.insertAdjacentHTML('beforeend', radioHTML)
        })
      }

      // Function to apply highlight to the preview
      function applyHighlight(type) {
        if (!radioList) return
        const lastOption = radioList.querySelector(
          '.govuk-radios__item:last-child'
        )
        if (!lastOption) return

        const elementToHighlight =
          type === 'label'
            ? lastOption.querySelector('.govuk-radios__label')
            : lastOption.querySelector('.govuk-radios__hint')

        if (elementToHighlight) {
          elementToHighlight.classList.add('highlight')
        } else if (type === 'hint') {
          // If hint element doesn't exist, create it
          const hintElement = document.createElement('div')
          hintElement.className = 'govuk-hint govuk-radios__hint highlight'
          hintElement.textContent = 'Hint text'
          lastOption.appendChild(hintElement)
        }
      }

      // Function to remove highlight from the preview
      function removeHighlight(type) {
        if (!radioList) return
        const lastOption = radioList.querySelector(
          '.govuk-radios__item:last-child'
        )
        if (!lastOption) return

        const elementToUnhighlight =
          type === 'label'
            ? lastOption.querySelector('.govuk-radios__label')
            : lastOption.querySelector('.govuk-radios__hint')

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
        if (!radioList || newOptionHint.value.trim()) return
        const lastOption = radioList.querySelector(
          '.govuk-radios__item:last-child'
        )
        if (!lastOption) return

        let hintElement = lastOption.querySelector('.govuk-radios__hint')
        if (!hintElement) {
          hintElement = document.createElement('div')
          hintElement.className = 'govuk-hint govuk-radios__hint highlight'
          lastOption.appendChild(hintElement)
        }
        hintElement.textContent = 'Hint text'
      }

      // Function to remove hint placeholder
      function removeHintPlaceholder() {
        if (!radioList || newOptionHint.value.trim()) return
        const lastOption = radioList.querySelector(
          '.govuk-radios__item:last-child'
        )
        if (!lastOption) return

        const hintElement = lastOption.querySelector('.govuk-radios__hint')
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
          if (e.target.classList.contains('option-hint-input')) {
            const optionIndex = e.target.closest(
              '.gem-c-reorderable-list__item'
            ).dataset.index
            const previewOption = radioList
              .querySelector(`#listPreview-option${optionIndex - 1}`)
              .closest('.govuk-radios__item')
            let hintElement = previewOption.querySelector('.govuk-radios__hint')

            if (!hintElement) {
              hintElement = document.createElement('div')
              hintElement.className = 'govuk-hint govuk-radios__hint highlight'
              hintElement.textContent = 'Hint text'
              previewOption.appendChild(hintElement)
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
          if (e.target.classList.contains('option-hint-input')) {
            const optionIndex = e.target.closest(
              '.gem-c-reorderable-list__item'
            ).dataset.index
            const previewOption = radioList
              .querySelector(`#listPreview-option${optionIndex - 1}`)
              .closest('.govuk-radios__item')
            const hintElement = previewOption.querySelector(
              '.govuk-radios__hint'
            )

            if (hintElement) {
              hintElement.classList.remove('highlight')
              if (
                !e.target.value.trim() &&
                hintElement.textContent === 'Hint text'
              ) {
                hintElement.remove()
              }
            }
          }
        },
        true
      )

      // Function to update the hidden input with all current options
      function updateHiddenOptionsData() {
        const options = []
        const optionItems = optionsContainer.querySelectorAll(
          '.gem-c-reorderable-list__item'
        )

        optionItems.forEach((item) => {
          const labelInput = item.querySelector('.option-label-display')
          const hintInput = item.querySelector('.govuk-hint')

          if (labelInput) {
            const label =
              labelInput.textContent?.replace(/\n/g, '').trim() ?? ''
            const hint = hintInput
              ? hintInput.textContent?.replace(/\n/g, '').trim()
              : ''
            const value = label.toLowerCase().replace(/\s+/g, '-')

            options.push({
              label,
              hint,
              value
            })
          }
        })

        document.getElementById('radio-options-data').value =
          JSON.stringify(options)
      }

      // Form submission handler
      questionForm.addEventListener('submit', function () {
        updateHiddenOptionsData() // Ensure options are up to date before submitting
        return true
      })

      // Initialize Sortable for the options container
      const sortableContainer = document.getElementById('options-container')
      if (sortableContainer) {
        // @ts-expect-error todo text to explain
        // eslint-disable-next-line no-new, no-undef
        new Sortable(sortableContainer, {
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
          }
        })
      }

      // Function to highlight preview item
      /**
       * @param {number} index
       */
      function highlightPreviewItem(index) {
        const radioList = document.querySelector('#radio-list .govuk-radios')
        if (!radioList) return

        // Remove any existing highlights
        removePreviewHighlights()

        // Add highlight to the corresponding preview item
        const previewItem = radioList.querySelector(
          `.govuk-radios__item:nth-child(${index + 1})`
        )
        if (previewItem) {
          previewItem.classList.add('highlight')
        }
      }

      // Function to remove all preview highlights
      function removePreviewHighlights() {
        const radioList = document.querySelector('#radio-list .govuk-radios')
        if (!radioList) return

        const items = radioList.querySelectorAll('.govuk-radios__item')
        items.forEach((item) => item.classList.remove('highlight'))
      }

      // Add focus/blur handlers for list items in edit mode
      document.addEventListener('focusin', function (e) {
        if (
          e.target.classList.contains('js-reorderable-list-up') ||
          e.target.classList.contains('js-reorderable-list-down')
        ) {
          const listItem = e.target.closest('.gem-c-reorderable-list__item')
          if (listItem) {
            const index = Array.from(listItem.parentNode.children).indexOf(
              listItem
            )
            highlightPreviewItem(index)
          }
        }
      })

      document.addEventListener('focusout', function (e) {
        if (
          e.target.classList.contains('js-reorderable-list-up') ||
          e.target.classList.contains('js-reorderable-list-down')
        ) {
          removePreviewHighlights()
        }
      })

      const editOptionsButton = document.getElementById('edit-options-button')

      // Add hover handlers for list items in edit mode
      document.addEventListener('mouseover', function (e) {
        const listItem = e.target.closest('.gem-c-reorderable-list__item')
        if (listItem && editOptionsButton.textContent.trim() === 'Re-order') {
          const index = Array.from(listItem.parentNode.children).indexOf(
            listItem
          )
          highlightPreviewItem(index)
        }
      })

      document.addEventListener('mouseout', function (e) {
        const listItem = e.target.closest('.gem-c-reorderable-list__item')
        if (listItem && editOptionsButton.textContent.trim() === 'Re-order') {
          removePreviewHighlights()
        }
      })

      // Add edit options button functionality
      if (editOptionsButton) {
        editOptionsButton.addEventListener('click', function () {
          const listItems = document.querySelectorAll(
            '.gem-c-reorderable-list__item'
          )
          const actionButtons = document.querySelectorAll(
            '.gem-c-reorderable-list__actions'
          )
          const editDeleteLinks = document.querySelectorAll('.edit-item')
          const addButton = document.getElementById('add-option-button')

          // Toggle button text and state
          const isEditing = editOptionsButton.textContent.trim() === 'Done'
          editOptionsButton.textContent = isEditing ? 'Re-order' : 'Done'

          // Toggle button style - add inverse when NOT editing (showing "Re-order")
          if (isEditing) {
            editOptionsButton.classList.add('govuk-button--inverse')
          } else {
            editOptionsButton.classList.remove('govuk-button--inverse')
          }

          // Show/hide add button based on edit state
          if (addButton) {
            addButton.style.display = isEditing ? 'inline-block' : 'none'
          }

          // Toggle action buttons visibility
          actionButtons.forEach((actions) => {
            actions.style.display = isEditing ? 'none' : 'flex'
          })

          // Toggle edit/delete links visibility
          editDeleteLinks.forEach((links) => {
            links.style.display = isEditing ? 'block' : 'none'
          })

          // Update cursor style and hover effect
          listItems.forEach((item) => {
            if (isEditing) {
              item.style.cursor = 'default'
              item.classList.remove('sortable-enabled')
            } else {
              item.style.cursor = 'move'
              item.classList.add('sortable-enabled')
            }
          })

          // Enable/disable sorting
          if (sortableContainer) {
            sortableContainer.sortable = !isEditing
          }

          // Update button visibility and focus when entering edit mode
          if (!isEditing) {
            updateMoveButtons()
            const firstItem = listItems[0]
            // if (firstItem) {
            const firstDownButton = firstItem.querySelector(
              '.js-reorderable-list-down'
            )
            if (firstDownButton) {
              firstDownButton.focus()
            }
            // }
          }
        })
      }

      // Function to update the visibility of Up/Down buttons
      function updateMoveButtons() {
        const items = optionsContainer.querySelectorAll(
          '.gem-c-reorderable-list__item'
        )
        items.forEach((item, index) => {
          const upButton = item.querySelector('.js-reorderable-list-up')
          const downButton = item.querySelector('.js-reorderable-list-down')

          if (upButton && downButton) {
            // First item - only show Down
            if (index === 0) {
              upButton.style.display = 'none'
              downButton.style.display = 'inline-block'
            }
            // Last item - only show Up
            else if (index === items.length - 1) {
              upButton.style.display = 'inline-block'
              downButton.style.display = 'none'
            }
            // Middle items - show both
            else {
              upButton.style.display = 'inline-block'
              downButton.style.display = 'inline-block'
            }
          }
        })
      }

      // Add Up/Down button functionality
      document.addEventListener('click', function (e) {
        if (e.target.classList.contains('js-reorderable-list-up')) {
          const item = e.target.closest('.gem-c-reorderable-list__item')
          const prevItem = item.previousElementSibling
          if (prevItem) {
            item.parentNode.insertBefore(item, prevItem)
            updateAllOptionsPreview()
            updateHiddenOptionsData()
          }
        } else if (e.target.classList.contains('js-reorderable-list-down')) {
          const item = e.target.closest('.gem-c-reorderable-list__item')
          const nextItem = item.nextElementSibling
          if (nextItem) {
            item.parentNode.insertBefore(nextItem, item)
            updateAllOptionsPreview()
            updateHiddenOptionsData()
          }
        } else if (e.target.classList.contains('js-remove-option')) {
          e.preventDefault()
          const item = e.target.closest('.gem-c-reorderable-list__item')
          // eslint-disable-next-line no-undef
          if (confirm('Are you sure you want to remove this option?')) {
            item.remove()
            updateAllOptionsPreview()
            updateHiddenOptionsData()
            updateEditButtonVisibility() // Update edit button visibility after removing an option
          }
        }
      })

      // Function to convert a list item to editable form
      function makeItemEditable(listItem) {
        // console.log('editItem', listItem)
        const labelDisplay = listItem
          .querySelector('.option-label-display')
          .textContent.trim()
        const labelInput = listItem.querySelector('.option-label-input-hidden')
        const hintInput = listItem.querySelector('.option-hint-input')
        const editLink = listItem.querySelector('.edit-item a')
        // console.log('labelDisplay', labelDisplay)
        // console.log('labelInput', labelInput)
        // console.log('hintInput', hintInput)
        // console.log('editLink', editLink)

        // Create the edit form HTML
        const editFormHTML = `
          <div class="edit-option-form govuk-!-margin-bottom-6">
            <h2 class="govuk-heading-m">Edit option</h2>
            
            <!-- Option Value (Label) -->
            <div class="govuk-form-group">
              <label class="govuk-label govuk-label--m" for="edit-option-label">Item</label>
              <input class="govuk-input" id="edit-option-label" name="edit-label" type="text" 
                value="${labelInput.value}">
            </div>
  
            <!-- Hint Text -->
            <div class="govuk-form-group">
              <label class="govuk-label govuk-label--m" for="edit-option-hint">Hint text (optional)</label>
              <div class="govuk-hint">Use single short sentence without a full stop</div>
              <input class="govuk-input" id="edit-option-hint" name="edit-hint" type="text" 
                value="${hintInput.value}">
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
                    value="${listItem.querySelector('.option-value-input')?.value ?? ''}">
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
        labelDisplay.style.display = 'none'
        editLink.style.display = 'none'
        listItem.querySelector('.delete-option-link').style.display = 'none'

        // Insert the edit form
        listItem
          .querySelector('.gem-c-reorderable-list__content')
          .insertAdjacentHTML('beforeend', editFormHTML)

        // Add event listeners for the new form
        const editForm = listItem.querySelector('.edit-option-form')
        const saveButton = editForm.querySelector('.save-edit-button')
        const cancelButton = editForm.querySelector('.cancel-edit-link')
        const editLabelInput = editForm.querySelector('#edit-option-label')
        const editHintInput = editForm.querySelector('#edit-option-hint')

        // Focus the label input
        editLabelInput.focus()

        // Save changes
        saveButton.addEventListener('click', () => {
          const newLabel = editLabelInput.value.trim()
          const newHint = editHintInput.value.trim()
          const newValue =
            editForm.querySelector('#edit-option-value')?.value.trim() ?? ''

          // Update the values
          labelDisplay.textContent = newLabel
          labelInput.value = newLabel
          hintInput.value = newHint

          // Update or create the value input
          let valueInput = listItem.querySelector('.option-value-input')
          if (!valueInput) {
            valueInput = document.createElement('input')
            valueInput.type = 'hidden'
            valueInput.className = 'option-value-input'
            valueInput.name = `option[${listItem.dataset.index}][option_value]`
            listItem
              .querySelector('.gem-c-reorderable-list__content')
              .appendChild(valueInput)
          }
          valueInput.value = newValue

          // Restore the display
          restoreItemDisplay(listItem)

          // Update the preview
          updateAllOptionsPreview()
          updateHiddenOptionsData()
        })

        // Cancel editing
        cancelButton.addEventListener('click', (e) => {
          e.preventDefault()
          restoreItemDisplay(listItem)
        })

        // Add preview updating on input
        editLabelInput.addEventListener('input', () => {
          updateEditPreview(listItem, editLabelInput.value, editHintInput.value)
        })

        editHintInput.addEventListener('input', () => {
          updateEditPreview(listItem, editLabelInput.value, editHintInput.value)
        })

        // Add focus/blur event listeners for highlighting
        editLabelInput.addEventListener('focus', () => {
          const previewItem = document
            .querySelector(`#listPreview-option${listItem.dataset.index - 1}`)
            .closest('.govuk-radios__item')
          if (previewItem) {
            const labelElement = previewItem.querySelector(
              '.govuk-radios__label'
            )
            if (labelElement) {
              labelElement.classList.add('highlight')
            }
          }
        })

        editLabelInput.addEventListener('blur', () => {
          const previewItem = document
            .querySelector(`#listPreview-option${listItem.dataset.index - 1}`)
            .closest('.govuk-radios__item')
          if (previewItem) {
            const labelElement = previewItem.querySelector(
              '.govuk-radios__label'
            )
            if (labelElement) {
              labelElement.classList.remove('highlight')
            }
          }
        })

        // Update preview immediately to show current state
        updateEditPreview(listItem, editLabelInput.value, editHintInput.value)

        // If label input is already focused, apply highlight immediately
        if (document.activeElement === editLabelInput) {
          const previewItem = document
            .querySelector(`#listPreview-option${listItem.dataset.index - 1}`)
            .closest('.govuk-radios__item')
          if (previewItem) {
            const labelElement = previewItem.querySelector(
              '.govuk-radios__label'
            )
            if (labelElement) {
              labelElement.classList.add('highlight')
            }
          }
        }
      }

      // Function to restore item to display mode
      function restoreItemDisplay(listItem) {
        const labelDisplay = listItem.querySelector('.option-label-display')
        const editLink = listItem.querySelector('.edit-item a')
        const deleteLink = listItem.querySelector('.delete-option-link')
        const editForm = listItem.querySelector('.edit-option-form')

        if (editForm) {
          editForm.remove()
        }

        labelDisplay.style.display = 'block'
        editLink.style.display = 'inline-block'
        if (deleteLink) {
          deleteLink.style.display = 'inline-block'
        }
      }

      // Function to update preview while editing
      function updateEditPreview(listItem, labelValue, hintValue) {
        const index = listItem.dataset.index - 1
        const previewItem = radioList
          .querySelector(`#listPreview-option${index}`)
          .closest('.govuk-radios__item')

        if (previewItem) {
          const label = previewItem.querySelector('.govuk-radios__label')
          let hint = previewItem.querySelector('.govuk-radios__hint')

          label.textContent = labelValue ?? 'Item text'

          if (hintValue) {
            if (!hint) {
              hint = document.createElement('div')
              hint.className = 'govuk-hint govuk-radios__hint'
              previewItem.appendChild(hint)
            }
            hint.textContent = hintValue
          } else if (hint) {
            hint.remove()
          }
        }
      }

      // Add click handler for edit links
      document.addEventListener('click', function (e) {
        if (e.target.closest('.edit-item a')) {
          e.preventDefault()
          const listItem = e.target.closest('.gem-c-reorderable-list__item')
          if (listItem) {
            makeItemEditable(listItem)
          }
        }
      })

      // Remove all existing delete-related event handlers and add a single, clean handler
      document.addEventListener('click', function (e) {
        const deleteLink = e.target.closest('.delete-option-link')
        if (deleteLink) {
          // Let the link navigate naturally to the delete confirmation page
          return true
        }
      })

      // Add delete functionality
      document.addEventListener('DOMContentLoaded', function () {
        const urlParams = new URLSearchParams(window.location.search)
        const deleteIndex = urlParams.get('deleteIndex')

        if (deleteIndex !== null) {
          const itemToDelete = document.querySelector(
            `.gem-c-reorderable-list__item[data-index="${deleteIndex}"]`
          )
          if (itemToDelete) {
            // console.log("Found item to delete:", itemToDelete);
            itemToDelete.remove()
            updateAllOptionsPreview() // Update the preview after deletion
            updateHiddenOptionsData() // Update the hidden input data
            updateEditButtonVisibility() // Update edit button visibility after deleting an option
          } else {
            // console.error("Item to delete not found for index:", deleteIndex);
          }

          // Clean up the URL
          const newUrl = window.location.href.split('?')[0]
          window.history.replaceState({}, document.title, newUrl)
        }
      })

      // Conditions functionality
      const questionSelect = document.getElementById('condition-question')
      const valueContainer = document.getElementById(
        'condition-value-container'
      )
      const addConditionLink = document.getElementById('add-condition-link')
      const additionalConditions = document.getElementById(
        'additional-conditions'
      )
      let conditionCount = 1

      // Function to update value options based on selected question
      function updateValueOptions(questionSelect, valueSelect) {
        const selectedOption =
          questionSelect.options[questionSelect.selectedIndex]
        const questionType = selectedOption.getAttribute('data-type')
        const rawOptions = selectedOption.getAttribute('data-options')

        // Clear existing options
        valueSelect.innerHTML = '<option value="">Select a value</option>'

        try {
          if (questionType === 'yes-no') {
            valueSelect.innerHTML = `${valueSelect.innerHTML}
              <option value="yes">Yes</option>
              <option value="no">No</option>
            `
          } else if (
            ['radios', 'checkboxes', 'select'].includes(questionType)
          ) {
            const options = JSON.parse(rawOptions)
            options.forEach((option) => {
              const value = option.value ?? option.text
              valueSelect.innerHTML = `${valueSelect.innerHTML}
                <option value="${value}">${option.text}</option>
              `
            })
          }
        } catch {
          // console.error('Error parsing options:', e);
        }
      }

      // Add event listener to first question select
      if (questionSelect) {
        questionSelect.addEventListener('change', () => {
          const valueSelect = document.getElementById('condition-value')
          updateValueOptions(questionSelect, valueSelect)
        })
      }

      // Handle adding new conditions
      if (addConditionLink) {
        addConditionLink.addEventListener('click', function (e) {
          e.preventDefault()

          const newCondition = document.createElement('div')
          newCondition.className =
            'condition-item govuk-!-margin-top-4 govuk-!-padding-4'
          newCondition.style.position = 'relative'
          newCondition.style.background = '#f3f2f1'

          newCondition.innerHTML = `
            <!-- Remove link positioned absolutely in top right -->
            <a href="#" class="govuk-link govuk-link--no-visited-state govuk-link--destructive govuk-!-font-size-16" 
              onclick="event.preventDefault(); removeCondition(this);"
              style="position: absolute; top: 15px; right: 15px;">
                <svg class="govuk-!-margin-right-1" style="position: relative; top: 2px" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 1.5L1.5 10.5" stroke="currentColor" stroke-width="2"/>
                  <path d="M1.5 1.5L10.5 10.5" stroke="currentColor" stroke-width="2"/>
                </svg>
                Remove this condition
            </a>
  
            <div class="govuk-form-group">
              <label class="govuk-label">Combine with</label>
              <select class="govuk-select" name="logical-operator-${conditionCount}">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </div>
            
            <div class="govuk-form-group">
              <label class="govuk-label" for="condition-question-${conditionCount}">Select a question</label>
              <select class="govuk-select condition-question" 
                  id="condition-question-${conditionCount}" 
                  name="question-${conditionCount}">
                ${questionSelect.innerHTML}
              </select>
            </div>
  
            <div class="govuk-form-group">
              <label class="govuk-label" for="condition-operator-${conditionCount}">Condition type</label>
              <select class="govuk-select" id="condition-operator-${conditionCount}" name="operator-${conditionCount}">
                <option value="">Select a condition type</option>
                <option value="is" selected>is</option>
                <option value="is-not">is not</option>
              </select>
            </div>
  
            <div class="govuk-form-group">
              <label class="govuk-label" for="condition-value-${conditionCount}">Select a value</label>
              <div class="condition-value-container">
                <select class="govuk-select condition-value" 
                    id="condition-value-${conditionCount}" 
                    name="value-${conditionCount}">
                  <option value="">Select a value</option>
                </select>
              </div>
            </div>
          `

          // Add event listener to new question select
          const newQuestionSelect = newCondition.querySelector(
            '.condition-question'
          )
          const newValueContainer = newCondition.querySelector(
            '.condition-value-container'
          )
          newQuestionSelect.addEventListener('change', () => {
            const selectedOption =
              newQuestionSelect.options[newQuestionSelect.selectedIndex]
            const questionType = selectedOption.getAttribute('data-type') ?? ''
            const rawOptions = selectedOption.getAttribute('data-options')

            // Clear existing options
            newValueContainer.innerHTML = '' // Clear the entire container

            try {
              // Handle yes/no questions with dropdown
              if (questionType === 'yes-no') {
                const select = document.createElement('select')
                select.classList.add('govuk-select')
                select.id = `condition-value-${conditionCount}`
                select.name = `value-${conditionCount}`

                select.innerHTML = `
                  <option value="">Select yes or no</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                `

                const label = document.createElement('label')
                label.classList.add('govuk-label')
                label.setAttribute('for', `condition-value-${conditionCount}`)
                label.textContent = 'Select yes or no'

                newValueContainer.appendChild(label)
                newValueContainer.appendChild(select)
                newValueContainer.style.display = 'block'
                return
              }

              // Handle radio questions with radio buttons
              if (questionType === 'radios') {
                const options = rawOptions ? JSON.parse(rawOptions) : []

                if (Array.isArray(options) && options.length > 0) {
                  const fieldset = document.createElement('fieldset')
                  fieldset.classList.add('govuk-fieldset')

                  const legend = document.createElement('legend')
                  legend.classList.add(
                    'govuk-fieldset__legend',
                    'govuk-fieldset__legend--s'
                  )
                  legend.textContent = 'Select an option'
                  fieldset.appendChild(legend)

                  const radiosDiv = document.createElement('div')
                  radiosDiv.classList.add('govuk-radios', 'govuk-radios--small')
                  radiosDiv.setAttribute('data-module', 'govuk-radios')

                  options.forEach((option, index) => {
                    const itemDiv = document.createElement('div')
                    itemDiv.classList.add('govuk-radios__item')

                    const radio = document.createElement('input')
                    radio.classList.add('govuk-radios__input')
                    radio.type = 'radio'
                    radio.id = `radio-${index}`
                    radio.name = 'value'
                    radio.value = option.value ?? option.label

                    const label = document.createElement('label')
                    label.classList.add('govuk-label', 'govuk-radios__label')
                    label.setAttribute('for', `radio-${index}`)
                    label.textContent = option.label

                    itemDiv.appendChild(radio)
                    itemDiv.appendChild(label)

                    radiosDiv.appendChild(itemDiv)
                  })

                  fieldset.appendChild(radiosDiv)
                  valueContainer.appendChild(fieldset)
                  valueContainer.style.display = 'block'
                  return
                }
              }

              // Handle checkbox questions with actual checkboxes
              if (questionType === 'checkboxes') {
                const options = rawOptions ? JSON.parse(rawOptions) : []

                if (Array.isArray(options) && options.length > 0) {
                  const fieldset = document.createElement('fieldset')
                  fieldset.classList.add('govuk-fieldset')

                  const legend = document.createElement('legend')
                  legend.classList.add(
                    'govuk-fieldset__legend',
                    'govuk-fieldset__legend--s'
                  )
                  legend.textContent = 'Select all that apply'
                  fieldset.appendChild(legend)

                  const checkboxesDiv = document.createElement('div')
                  checkboxesDiv.classList.add(
                    'govuk-checkboxes',
                    'govuk-checkboxes--small'
                  )
                  checkboxesDiv.setAttribute('data-module', 'govuk-checkboxes')

                  options.forEach((option, index) => {
                    const itemDiv = document.createElement('div')
                    itemDiv.classList.add('govuk-checkboxes__item')

                    const checkbox = document.createElement('input')
                    checkbox.classList.add('govuk-checkboxes__input')
                    checkbox.type = 'checkbox'
                    checkbox.id = `checkbox-${index}`
                    checkbox.name = 'value'
                    checkbox.value = option.value ?? option.label

                    const label = document.createElement('label')
                    label.classList.add(
                      'govuk-label',
                      'govuk-checkboxes__label'
                    )
                    label.setAttribute('for', `checkbox-${index}`)
                    label.textContent = option.label

                    itemDiv.appendChild(checkbox)
                    itemDiv.appendChild(label)
                    checkboxesDiv.appendChild(itemDiv)
                  })

                  fieldset.appendChild(checkboxesDiv)
                  valueContainer.appendChild(fieldset)
                  valueContainer.style.display = 'block'
                  return
                }
              }

              // Handle select questions with dropdown
              if (questionType === 'select') {
                const select = document.createElement('select')
                select.classList.add('govuk-select')
                select.id = `condition-value-${conditionCount}`
                select.name = `value-${conditionCount}`

                const defaultOption = document.createElement('option')
                defaultOption.value = ''
                defaultOption.textContent = 'Select from the list'
                select.appendChild(defaultOption)

                const options = rawOptions ? JSON.parse(rawOptions) : []

                if (Array.isArray(options) && options.length > 0) {
                  options.forEach((option) => {
                    const newOption = document.createElement('option')
                    newOption.value = option.value ?? option.label
                    newOption.textContent = option.label
                    select.appendChild(newOption)
                  })

                  const label = document.createElement('label')
                  label.classList.add('govuk-label')
                  label.setAttribute('for', `condition-value-${conditionCount}`)
                  label.textContent = 'Select from the list'

                  valueContainer.appendChild(label)
                  valueContainer.appendChild(select)
                  valueContainer.style.display = 'block'
                }
              }
            } catch {
              // console.error("Error parsing options:", e);
            }
          })

          additionalConditions.appendChild(newCondition)
          conditionCount++
        })
      }

      /*
      function removeCondition(element) {
        // Find the closest parent condition-item div and remove it
        const conditionItem = element.closest('.condition-item');
        if (conditionItem) {
          conditionItem.remove();
        }
      }
      */

      // Add click handlers to all remove condition links
      document.addEventListener('click', function (event) {
        const removeLink = event.target.closest('.govuk-link--destructive')
        if (
          removeLink &&
          removeLink.textContent.trim() === 'Remove this condition'
        ) {
          event.preventDefault()
          const conditionItem = removeLink.closest('.condition-item')
          if (conditionItem) {
            conditionItem.remove()
          }
        }
      })
    })
  }
}
