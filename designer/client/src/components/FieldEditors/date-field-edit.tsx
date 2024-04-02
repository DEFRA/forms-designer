import React, { useContext } from 'react'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Actions } from '~/src/reducers/component/types.js'
import { CssClasses } from '~/src/components/CssClasses/index.js'
import { i18n } from '~/src/i18n/index.js'

type Props = {
  context: any // TODO
}

export function DateFieldEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state
  const { options = {} } = selectedComponent

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n('common.detailsLink.title')}
        </span>
      </summary>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-maxDaysInPast"
        >
          {i18n('dateFieldEditComponent.maxDaysInPastField.title')}
        </label>
        <span className="govuk-hint">
          {i18n('dateFieldEditComponent.maxDaysInPastField.helpText')}
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-options-maxDaysInPast"
          name="options.maxDaysInPast"
          value={options.maxDaysInPast}
          type="number"
          onChange={(e) =>
            dispatch({
              type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_PAST,
              payload: e.target.value
            })
          }
        />
      </div>

      <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-maxDaysInFuture"
        >
          {i18n('dateFieldEditComponent.maxDaysInFutureField.title')}
        </label>
        <span className="govuk-hint">
          {i18n('dateFieldEditComponent.maxDaysInFutureField.helpText')}
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-options-maxDaysInFuture"
          name="options.maxDaysInFuture"
          value={options.maxDaysInFuture}
          type="number"
          onChange={(e) =>
            dispatch({
              type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE,
              payload: e.target.value
            })
          }
        />
      </div>

      <CssClasses />
    </details>
  )
}
