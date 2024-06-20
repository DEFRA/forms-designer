import React, { useContext } from 'react'

import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

interface Props {
  context: any // TODO
}

export function ListContentEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context)
  const { selectedComponent = {} } = state
  const { options = {} } = selectedComponent

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
