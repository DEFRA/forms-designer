import { ComponentType } from '@defra/forms-model'
import React, { useContext } from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function MultilineTextFieldEdit() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (selectedComponent?.type !== ComponentType.MultilineTextField) {
    return null
  }

  const { options } = selectedComponent

  return (
    <TextFieldEdit>
      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-schema-maxwords"
        >
          {i18n('multilineTextFieldEditComponent.maxWordField.title')}
        </label>
        <div className="govuk-hint" id="field-schema-maxwords-hint">
          {i18n('multilineTextFieldEditComponent.maxWordField.helpText')}
        </div>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-schema-maxwords"
          aria-describedby="field-schema-maxwords-hint"
          name="schema.maxwords"
          value={options.maxWords ?? ''}
          type="number"
          onChange={(e) =>
            dispatch({
              name: Options.EDIT_OPTIONS_MAX_WORDS,
              payload: e.target.valueAsNumber,
              as: selectedComponent
            })
          }
        />
      </div>

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
          value={options.rows ?? ''}
          onChange={(e) =>
            dispatch({
              name: Options.EDIT_OPTIONS_ROWS,
              payload: e.target.valueAsNumber,
              as: selectedComponent
            })
          }
        />
      </div>
    </TextFieldEdit>
  )
}
