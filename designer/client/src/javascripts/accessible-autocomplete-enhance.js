// @ts-expect-error no types for accessible-autocomplete
import accessibleAutocomplete from 'accessible-autocomplete'

export function enhanceSelects() {
  const selects = document.querySelectorAll(
    '[data-module="govuk-accessible-autocomplete"]'
  )
  for (const select of Array.from(selects)) {
    if (select instanceof HTMLSelectElement) {
      accessibleAutocomplete.enhanceSelectElement({
        selectElement: select,
        defaultValue: '',
        showAllValues: true,
        confirmOnBlur: false
      })
    }
  }
}
