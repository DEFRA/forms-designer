import { ComponentType } from '@defra/forms-model'
import { useContext } from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'

export function SelectFieldEdit() {
  const { state } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (selectedComponent?.type !== ComponentType.SelectField) {
    return null
  }

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n('common.detailsLink.title')}
        </span>
      </summary>

      <div className="govuk-details__text">
        <Autocomplete />
      </div>
    </details>
  )
}
