import { ConditionValue } from '@defra/forms-model'
import React, { type ChangeEvent } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

export const SelectValues = (props) => {
  const { fieldDef, updateValue, value } = props

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: newValue } = e.target

    // Find the selected option
    const option = fieldDef.values?.find((item) => `${item.value}` === newValue)
    if (!option || !newValue) {
      updateValue(undefined)
      return
    }

    updateValue(new ConditionValue(`${option.value}`, option.text))
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
