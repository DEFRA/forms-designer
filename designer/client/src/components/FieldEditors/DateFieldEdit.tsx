import React, { useContext } from 'react'

import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
}

export function DateFieldEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state

  if (!selectedComponent) {
    return null
  }

  const { options } = selectedComponent

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n('common.detailsLink.title')}
        </span>
      </summary>

      <div className="govuk-details__text">
        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-options-maxDaysInPast"
          >
            {i18n('dateFieldEditComponent.maxDaysInPastField.title')}
          </label>
          <div className="govuk-hint">
            {i18n('dateFieldEditComponent.maxDaysInPastField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-options-maxDaysInPast"
            name="options.maxDaysInPast"
            value={
              'maxDaysInPast' in options ? options.maxDaysInPast : undefined
            }
            type="number"
            onChange={(e) =>
              dispatch({
                type: Options.EDIT_OPTIONS_MAX_DAYS_IN_PAST,
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
          <div className="govuk-hint">
            {i18n('dateFieldEditComponent.maxDaysInFutureField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-options-maxDaysInFuture"
            name="options.maxDaysInFuture"
            value={
              'maxDaysInFuture' in options ? options.maxDaysInFuture : undefined
            }
            type="number"
            onChange={(e) =>
              dispatch({
                type: Options.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE,
                payload: e.target.value
              })
            }
          />
        </div>

        <CssClasses />
      </div>
    </details>
  )
}
