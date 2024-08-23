import { ComponentType } from '@defra/forms-model'
import React, { useContext } from 'react'

import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
}

export function DateFieldEdit({ context = ComponentContext }: Props) {
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state

  if (
    !(
      selectedComponent?.type === ComponentType.DatePartsField ||
      selectedComponent?.type === ComponentType.MonthYearField
    )
  ) {
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
          <div className="govuk-hint" id="field-options-maxDaysInPast-hint">
            {i18n('dateFieldEditComponent.maxDaysInPastField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-options-maxDaysInPast"
            aria-describedby="field-options-maxDaysInPast-hint"
            name="options.maxDaysInPast"
            value={options.maxDaysInPast}
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
          <div className="govuk-hint" id="field-options-maxDaysInFuture-hint">
            {i18n('dateFieldEditComponent.maxDaysInFutureField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-options-maxDaysInFuture"
            aria-describedby="field-options-maxDaysInFuture-hint"
            name="options.maxDaysInFuture"
            value={options.maxDaysInFuture}
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
