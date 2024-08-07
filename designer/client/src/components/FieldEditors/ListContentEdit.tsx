import React, { useContext } from 'react'

import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
}

export function ListContentEdit({ context = ComponentContext }: Props) {
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state

  if (!selectedComponent) {
    return null
  }

  const { options } = selectedComponent
  const checked = 'type' in options && options.type === 'numbered'

  return (
    <div className="govuk-checkboxes govuk-form-group">
      <div className="govuk-checkboxes__item">
        <input
          className="govuk-checkboxes__input"
          id="field-options-type"
          name="options.type"
          value="numbered"
          type="checkbox"
          checked={checked}
          onChange={() =>
            dispatch({
              type: Options.EDIT_OPTIONS_TYPE,
              payload: checked ? undefined : 'numbered'
            })
          }
        />
        <label
          className="govuk-label govuk-checkboxes__label"
          htmlFor="field-options-type"
        >
          Numbered
        </label>
      </div>
    </div>
  )
}
