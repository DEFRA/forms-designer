import { ComponentType } from '@defra/forms-model'
import { useContext } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function Autocomplete() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (
    !(
      selectedComponent?.type === ComponentType.TextField ||
      selectedComponent?.type === ComponentType.NumberField ||
      selectedComponent?.type === ComponentType.SelectField
    )
  ) {
    return null
  }

  const { options } = selectedComponent

  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-autocomplete"
      >
        {i18n('common.autocomplete.title')}
      </label>
      <div className="govuk-hint" id="field-options-autocomplete-hint">
        {i18n('common.autocomplete.helpText')}
      </div>
      <input
        className="govuk-input"
        id="field-options-autocomplete"
        aria-describedby="field-options-autocomplete-hint"
        name="options.autocomplete"
        type="text"
        value={options.autocomplete ?? ''}
        onChange={(e) =>
          dispatch({
            name: Options.EDIT_OPTIONS_AUTOCOMPLETE,
            payload: e.target.value,
            as: selectedComponent
          })
        }
      />
    </div>
  )
}
