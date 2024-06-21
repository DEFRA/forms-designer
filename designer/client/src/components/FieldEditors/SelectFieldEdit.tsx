import React from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import { ListFieldEdit } from '~/src/components/FieldEditors/ListFieldEdit.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'

export function SelectFieldEdit() {
  return (
    <ListFieldEdit>
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
    </ListFieldEdit>
  )
}
