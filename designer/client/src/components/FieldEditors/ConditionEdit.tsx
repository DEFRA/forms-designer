import { hasConditionSupport } from '@defra/forms-model'
import React, { useContext } from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
}

export function ConditionEdit({ context = ComponentContext }: Props) {
  const { data } = useContext(DataContext)
  const { state, dispatch } = useContext(context)

  const { conditions } = data
  const { selectedComponent } = state

  if (!conditions.length || !hasConditionSupport(selectedComponent)) {
    return null
  }

  const { options } = selectedComponent

  return (
    <div className="govuk-form-group">
      <label className="govuk-label govuk-label--s" htmlFor="condition">
        Condition (optional)
      </label>
      <div className="govuk-hint" id="condition-hint">
        {i18n('fieldEdit.conditions.hint')}
      </div>
      <select
        className="govuk-select"
        id="condition"
        aria-describedby="condition-hint"
        name="options.condition"
        value={options.condition}
        onChange={(e) =>
          dispatch({
            name: Options.EDIT_OPTIONS_CONDITION,
            payload: e.target.value,
            as: selectedComponent
          })
        }
      >
        <option value="" />
        {conditions.map((condition) => (
          <option key={condition.name} value={condition.name}>
            {condition.displayName}
          </option>
        ))}
      </select>
    </div>
  )
}
