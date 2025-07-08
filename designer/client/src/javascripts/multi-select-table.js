/**
 * Find any multi-select tables, show their header checkbox and setup the event listener
 */
export class MultiSelect {
  init() {
    const tables = document.querySelectorAll(
      'table[data-module="multi-select-table"'
    )
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    tables.forEach((tab) => {
      const firstCheckbox = tab.querySelector('input[type=checkbox]')
      if (firstCheckbox?.id.includes('-checkboxes-all')) {
        const parentElem = firstCheckbox.parentElement
        if (parentElem) {
          parentElem.classList.remove('govuk-visually-hidden')
          parentElem.addEventListener('click', (event) =>
            this.handleCheckboxClick(event)
          )
        }
      }
    })
  }

  /**
   * Set all other checkboxes in step with the header checkbox
   * @param {Event} event
   */
  handleCheckboxClick(event) {
    const eventTarget = /** @type {HTMLInputElement} */ (event.target)

    const checkedState = eventTarget.checked
    const tableElem = eventTarget.closest('table')
    const allCheckboxes = tableElem?.querySelectorAll('input[type=checkbox]')
    if (!allCheckboxes || allCheckboxes.length === 0) {
      return
    }

    allCheckboxes.forEach((cbox) => {
      ;/** @type {HTMLInputElement} */ (cbox).checked = checkedState
    })
  }
}

/**
 * Method to initialise a multi-select table.
 * If JS is enabled, the header checkbox is shown and whenever the user clicks it,
 * it should toggle the other checkboxes in the table in sync.
 */
document.addEventListener('DOMContentLoaded', () => {
  const multiSelect = new MultiSelect()
  multiSelect.init()
})
