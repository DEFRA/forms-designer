import { ComponentType } from '@defra/forms-model'
import React, { useContext } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function CustomValidationMessage() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (
    !(
      selectedComponent?.type === ComponentType.TextField ||
      selectedComponent?.type === ComponentType.EmailAddressField ||
      selectedComponent?.type === ComponentType.NumberField ||
      selectedComponent?.type === ComponentType.MultilineTextField ||
      selectedComponent?.type === ComponentType.TelephoneNumberField ||
      selectedComponent?.type === ComponentType.MonthYearField
    )
  ) {
    return null
  }

  const { options } = selectedComponent

  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-custom-validation-message"
      >
        {i18n('common.customValidationMessage.title')}
      </label>
      <div
        className="govuk-hint"
        id="field-options-custom-validation-message-hint"
      >
        {i18n('common.customValidationMessage.helpText')}
      </div>
      <input
        className="govuk-input"
        id="field-options-custom-validation-message"
        aria-describedby="field-options-custom-validation-message-hint"
        name="options.customValidationMessage"
        type="text"
        value={options.customValidationMessage ?? ''}
        onChange={(e) =>
          dispatch({
            name: Options.EDIT_OPTIONS_CUSTOM_MESSAGE,
            payload: e.target.value,
            as: selectedComponent
          })
        }
      />
    </div>
  )
}
