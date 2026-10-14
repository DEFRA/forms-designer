import { ComponentType } from '@defra/forms-model'
import { useContext } from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { CustomValidationMessage } from '~/src/components/CustomValidationMessage/CustomValidationMessage.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options, Schema } from '~/src/reducers/component/types.js'

export function NumberFieldEdit() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (selectedComponent?.type !== ComponentType.NumberField) {
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
            id="field-schema-min"
            aria-describedby="field-schema-min-hint"
            name="schema.min"
            value={schema.min ?? ''}
            type="number"
            onChange={(e) =>
              dispatch({
                name: Schema.EDIT_SCHEMA_MIN,
                payload: e.target.valueAsNumber,
                as: selectedComponent
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
            id="field-options-prefix"
            aria-describedby="field-options-prefix-hint"
            name="opions.prefix"
            value={options.prefix ?? ''}
            type="string"
            onChange={(e) =>
              dispatch({
                name: Options.EDIT_OPTIONS_PREFIX,
                payload: e.target.value,
                as: selectedComponent
              })
            }
          />
        </div>

        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-options-suffix"
          >
            {i18n('numberFieldEditComponent.suffixField.title')}
          </label>
          <div className="govuk-hint" id="field-options-suffix-hint">
            {i18n('numberFieldEditComponent.suffixField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            id="field-options-suffix"
            aria-describedby="field-options-suffix-hint"
            name="options.suffix"
            value={options.suffix ?? ''}
            type="string"
            onChange={(e) =>
              dispatch({
                name: Options.EDIT_OPTIONS_SUFFIX,
                payload: e.target.value,
                as: selectedComponent
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
            id="field-schema-max"
            aria-describedby="field-schema-max-hint"
            name="schema.max"
            value={schema.max ?? ''}
            type="number"
            onChange={(e) =>
              dispatch({
                name: Schema.EDIT_SCHEMA_MAX,
                payload: e.target.valueAsNumber,
                as: selectedComponent
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
            id="field-schema-precision"
            aria-describedby="field-schema-precision-hint"
            name="schema.precision"
            value={schema.precision ?? ''}
            type="number"
            onChange={(e) =>
              dispatch({
                name: Schema.EDIT_SCHEMA_PRECISION,
                payload: e.target.valueAsNumber,
                as: selectedComponent
              })
            }
          />
        </div>

        <Autocomplete />

        <CssClasses />

        <CustomValidationMessage />
      </div>
    </details>
  )
}
