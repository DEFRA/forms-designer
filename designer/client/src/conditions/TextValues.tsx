import { ConditionValue } from '@defra/forms-model'
import React, { type ChangeEvent } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

export const TextValues = (props) => {
  const { updateValue, value } = props

  const onChangeTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target
    if (!newValue) {
      updateValue(undefined)
      return
    }

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
