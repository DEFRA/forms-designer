import { ComponentType, hasContent, hasFormField } from '@defra/forms-model'
import React, { useContext } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function CssClasses() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (
    !(
      hasFormField(selectedComponent) ||
      (hasContent(selectedComponent) &&
        selectedComponent.type === ComponentType.List)
    )
  ) {
    return null
  }

  const { options } = selectedComponent

  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-classes"
      >
        {i18n('common.classes.title')}
      </label>
      <div className="govuk-hint" id="field-options-classes-hint">
        {i18n('common.classes.helpText')}
      </div>
      <input
        className="govuk-input"
        id="field-options-classes"
        aria-describedby="field-options-classes-hint"
        name="options.classes"
        type="text"
        value={options.classes}
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
