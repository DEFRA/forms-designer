import React from 'react'

import { i18n } from '../../i18n'
import ListsEdit from '../../list/ListsEdit'
import { ListsEditorContextProvider } from '../../reducers/list/listsEditorReducer'
import { ListContextProvider } from '../../reducers/listReducer'
import { Autocomplete } from '../Autocomplete'
import ComponentListSelect from '../ComponentListSelect/ComponentListSelect'
import { RenderInPortal } from '../RenderInPortal'

import ListFieldEdit from './list-field-edit'

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
