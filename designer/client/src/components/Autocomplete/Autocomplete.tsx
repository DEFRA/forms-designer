import React, { useContext } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function Autocomplete() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state
  const { options = {} } = selectedComponent

  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-autocomplete"
      >
        {i18n('common.autocomplete.title')}
      </label>
      <div className="govuk-hint">{i18n('common.autocomplete.helpText')}</div>
      <input
        className="govuk-input"
        id="field-options-autocomplete"
        name="options.autocomplete"
        type="text"
        value={'autocomplete' in options ? options.autocomplete : undefined}
        onChange={(e) =>
          dispatch({
            type: Options.EDIT_OPTIONS_AUTOCOMPLETE,
            payload: e.target.value
          })
        }
      />
    </div>
  )
}
