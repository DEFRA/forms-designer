import React, { useContext } from 'react'

import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options, Schema } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
}

export function NumberFieldEdit({ context = ComponentContext }: Props) {
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state

  if (!selectedComponent) {
    return null
  }

  const { options, schema } = selectedComponent

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
            htmlFor="field-schema-min"
          >
            {i18n('numberFieldEditComponent.minField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-min-hint">
            {i18n('numberFieldEditComponent.minField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-schema-min"
            aria-describedby="field-schema-min-hint"
            name="schema.min"
            value={'min' in schema ? schema.min : undefined}
            type="number"
            onChange={(e) =>
              dispatch({
                type: Schema.EDIT_SCHEMA_MIN,
                payload: e.target.value
              })
            }
          />
        </div>

        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-options-prefix"
          >
            {i18n('numberFieldEditComponent.prefixField.title')}
          </label>
          <div className="govuk-hint" id="field-options-prefix-hint">
            {i18n('numberFieldEditComponent.prefixField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="string"
            id="field-options-prefix"
            aria-describedby="field-options-prefix-hint"
            name="opions.prefix"
            value={'prefix' in options ? options.prefix : undefined}
            type="string"
            onBlur={(e) =>
              dispatch({
                type: Options.EDIT_OPTIONS_PREFIX,
                payload: e.target.value
              })
            }
          />
        </div>

        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-opitions-suffix"
          >
            {i18n('numberFieldEditComponent.suffixField.title')}
          </label>
          <div className="govuk-hint" id="field-options-suffix-hint">
            {i18n('numberFieldEditComponent.suffixField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="string"
            id="field-options-suffix"
            aria-describedby="field-options-suffix-hint"
            name="options.suffix"
            value={'suffix' in options ? options.suffix : undefined}
            type="string"
            onBlur={(e) =>
              dispatch({
                type: Options.EDIT_OPTIONS_SUFFIX,
                payload: e.target.value
              })
            }
          />
        </div>

        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-schema-max"
          >
            {i18n('numberFieldEditComponent.maxField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-max-hint">
            {i18n('numberFieldEditComponent.maxField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-schema-max"
            aria-describedby="field-schema-max-hint"
            name="schema.max"
            value={'max' in schema ? schema.max : undefined}
            type="number"
            onBlur={(e) =>
              dispatch({
                type: Schema.EDIT_SCHEMA_MAX,
                payload: e.target.value
              })
            }
          />
        </div>

        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-schema-precision"
          >
            {i18n('numberFieldEditComponent.precisionField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-precision-hint">
            {i18n('numberFieldEditComponent.precisionField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-schema-precision"
            aria-describedby="field-schema-precision-hint"
            name="schema.precision"
            value={'precision' in schema ? schema.precision : undefined}
            type="number"
            onBlur={(e) =>
              dispatch({
                type: Schema.EDIT_SCHEMA_PRECISION,
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
