import { ConditionValue } from '@defra/forms-model'
import React from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

export const SelectValues = (props) => {
  const { fieldDef, updateValue, value } = props

  const onChangeSelect = (e) => {
    const input = e.target
    const newValue = input.value

    let value
    if (newValue && newValue?.trim() !== '') {
      const option = fieldDef.values?.find(
        (value) => String(value.value) === newValue
      )
      value = new ConditionValue(String(option.value), option.label)
    }
    updateValue(value)
  }

  return (
    <>
      <label className="govuk-label" htmlFor="cond-value">
        {i18n('conditions.conditionValue')}
      </label>
      <select
        className="govuk-select"
        id="cond-value"
        name="cond-value"
        value={value?.value ?? ''}
        onChange={onChangeSelect}
        data-testid={'cond-value'}
      >
        <option value="" />
        {fieldDef.values.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          )
        })}
      </select>
    </>
  )
}
