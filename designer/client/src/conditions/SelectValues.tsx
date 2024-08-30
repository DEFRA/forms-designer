import {
  ConditionValue,
  type ConditionValueData,
  type Item
} from '@defra/forms-model'
import React, { type ChangeEvent } from 'react'

import { type FieldDef } from '~/src/data/component/fields.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  fieldDef: Extract<FieldDef, { values?: Item[] }>
  value?: ConditionValueData
  updateValue: (value: ConditionValue) => void
}

export const SelectValues = (props: Props) => {
  const { fieldDef, updateValue, value } = props

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: newValue } = e.target

    // Find the selected option
    const option = fieldDef.values?.find((item) => `${item.value}` === newValue)
    if (!option || !newValue) {
      updateValue(new ConditionValue(''))
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
        defaultValue={value?.value}
        onChange={onChangeSelect}
      >
        <option value="" />
        {fieldDef.values?.map((option) => (
          <option key={`${option.value}`} value={`${option.value}`}>
            {option.text}
          </option>
        ))}
      </select>
    </>
  )
}
