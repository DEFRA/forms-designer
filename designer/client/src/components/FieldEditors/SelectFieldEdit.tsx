import React from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import { ListFieldEdit } from '~/src/components/FieldEditors/ListFieldEdit.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  page: any // TODO
}

export function SelectFieldEdit({ page }: Props) {
  return (
    <ListFieldEdit page={page}>
      <details className="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">
            {i18n('common.detailsLink.title')}
          </span>
        </summary>

        <Autocomplete />
      </details>
    </ListFieldEdit>
  )
}
