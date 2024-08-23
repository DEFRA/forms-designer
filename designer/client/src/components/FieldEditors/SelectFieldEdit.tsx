import { ComponentType } from '@defra/forms-model'
import React, { useContext } from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'

interface Props {
  context?: typeof ComponentContext
}

export function SelectFieldEdit({ context = ComponentContext }: Props) {
  const { state } = useContext(context)
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
