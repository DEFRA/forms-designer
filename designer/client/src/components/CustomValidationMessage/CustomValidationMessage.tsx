import { type TelephoneNumberFieldComponent } from '@defra/forms-model'
import React, { useContext } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function CustomValidationMessage() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state
  const { options = {} } = selectedComponent as TelephoneNumberFieldComponent

  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-custom-validation-message"
      >
        {i18n('common.customValidationMessage.title')}
      </label>
      <div className="govuk-hint">
        {i18n('common.customValidationMessage.helpText')}
      </div>
      <input
        className="govuk-input"
        id="field-options-custom-validation-message"
        name="options.customValidationMessage"
        type="text"
        value={
          'customValidationMessage' in options
            ? options.customValidationMessage
            : undefined
        }
        onChange={(e) =>
          dispatch({
            type: Options.EDIT_OPTIONS_CUSTOM_MESSAGE,
            payload: e.target.value
          })
        }
      />
    </div>
  )
}
