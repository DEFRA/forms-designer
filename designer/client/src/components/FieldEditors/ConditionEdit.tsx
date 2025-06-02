import { hasConditionSupport, isConditionWrapper } from '@defra/forms-model'
import { useContext } from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function ConditionEdit() {
  const { data } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)

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
        value={options.condition ?? ''}
        onChange={(e) =>
          dispatch({
            name: Options.EDIT_OPTIONS_CONDITION,
            payload: e.target.value,
            as: selectedComponent
          })
        }
      >
        <option value="">{i18n('fieldEdit.conditions.option')}</option>
        {conditions.filter(isConditionWrapper).map((condition) => (
          <option key={condition.name} value={condition.name}>
            {condition.displayName}
          </option>
        ))}
      </select>
    </div>
  )
}
