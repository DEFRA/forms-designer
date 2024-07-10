import React, { useContext } from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function MultilineTextFieldEdit({ context = ComponentContext }) {
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state

  if (!selectedComponent) {
    return null
  }

  const { options } = selectedComponent

  return (
    <TextFieldEdit>
      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-rows"
        >
          {i18n('multilineTextFieldEditComponent.rowsField.title')}
        </label>
        <div className="govuk-hint" id="field-options-rows-hint">
          {i18n('multilineTextFieldEditComponent.rowsField.helpText')}
        </div>
        <input
          className="govuk-input govuk-input--width-3"
          id="field-options-rows"
          aria-describedby="field-options-rows-hint"
          name="options.rows"
          type="text"
          data-cast="number"
          value={'rows' in options ? options.rows : undefined}
          onChange={(e) =>
            dispatch({
              type: Options.EDIT_OPTIONS_ROWS,
              payload: e.target.value
            })
          }
        />
      </div>
    </TextFieldEdit>
  )
}
