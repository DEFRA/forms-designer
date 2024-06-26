import React, { useContext } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function CssClasses() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent = {} } = state
  const { options = {} } = selectedComponent

  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-classes"
      >
        {i18n('common.classes.title')}
      </label>
      <div className="govuk-hint">{i18n('common.classes.helpText')}</div>
      <input
        className="govuk-input"
        id="field-options-classes"
        name="options.classes"
        type="text"
        value={'classes' in options ? options.classes : undefined}
        onChange={(e) =>
          dispatch({
            type: Options.EDIT_OPTIONS_CLASSES,
            payload: e.target.value
          })
        }
      />
    </div>
  )
}
