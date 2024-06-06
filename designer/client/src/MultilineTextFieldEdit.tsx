import React, { useContext } from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Actions } from '~/src/reducers/component/types.js'

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