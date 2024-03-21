import React, { useContext } from 'react'

import { TextFieldEdit } from './components/FieldEditors/text-field-edit'
import { ComponentContext } from './reducers/component/componentReducer'
import { Actions } from './reducers/component/types'

export function MultilineTextFieldEdit({ context = ComponentContext }) {
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state
  const { options = {} } = selectedComponent

  return (
    <TextFieldEdit>
      <input
        className="govuk-input govuk-input--width-3"
        id="field-options-rows"
        name="options.rows"
        type="text"
        data-cast="number"
        value={options.rows || ''}
        onChange={(e) =>
          dispatch({
            type: Actions.EDIT_OPTIONS_ROWS,
            payload: e.target.value
          })
        }
      />
    </TextFieldEdit>
  )
}
