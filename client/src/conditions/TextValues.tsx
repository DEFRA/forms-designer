import { ConditionValue, type ConditionValueData } from '@defra/forms-model'
import { type ChangeEvent } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  value?: ConditionValueData
  updateValue: (value: ConditionValue) => void
}

export const TextValues = (props: Readonly<Props>) => {
  const { updateValue, value } = props

  const onChangeTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target
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
        defaultValue={value?.value ?? ''}
        required
        onChange={onChangeTextInput}
      />
    </>
  )
}
