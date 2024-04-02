import React from 'react'

import { i18n } from '~/src/i18n'
import { Autocomplete } from '~/src/components/Autocomplete'
import ListFieldEdit from '~/src/components/FieldEditors/list-field-edit'

type Props = {
  page: any // TODO
}

function SelectFieldEdit({ page }: Props) {
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

export default SelectFieldEdit
