import { ConditionValue } from '@defra/forms-model'
import React from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

export const TextValues = (props) => {
  const { updateValue, value } = props

  const onChangeTextInput = (e) => {
    const input = e.target
    const newValue = input.value
    updateValue(new ConditionValue(newValue))
  }

  return (
    <>
      <label className="govuk-label" htmlFor="cond-value">
        {i18n('conditions.conditionValue')}
      </label>
      <input
        className="govuk-input govuk-input--width-20"
        id="cond-value"
        name="cond-value"
        type="text"
        defaultValue={value?.value}
        required
        onChange={onChangeTextInput}
      />
    </>
  )
}
