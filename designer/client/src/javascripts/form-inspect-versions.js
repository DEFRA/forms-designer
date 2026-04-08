// @ts-expect-error no types for accessible-autocomplete
import accessibleAutocomplete from 'accessible-autocomplete'

export function enhanceVersionSelect() {
  const select = document.querySelector(
    '[data-module="govuk-accessible-autocomplete"]'
  )
  if (select instanceof HTMLSelectElement) {
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: select,
      defaultValue: '',
      showAllValues: true,
      confirmOnBlur: false
    })
  }
}
