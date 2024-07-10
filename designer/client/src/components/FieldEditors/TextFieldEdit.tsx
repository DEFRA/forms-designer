import { ComponentType } from '@defra/forms-model'
import React, { useContext, type ReactNode } from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { CustomValidationMessage } from '~/src/components/CustomValidationMessage/CustomValidationMessage.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options, Schema } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
  children?: ReactNode
}

export function TextFieldEdit({ children, context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state

  if (!selectedComponent) {
    return null
  }

  const { schema, options } = selectedComponent

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
            {i18n('textFieldEditComponent.minLengthField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-min-hint">
            {i18n('textFieldEditComponent.minLengthField.helpText')}
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
            htmlFor="field-schema-max"
          >
            {i18n('textFieldEditComponent.maxLengthField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-max-hint">
            {i18n('textFieldEditComponent.maxLengthField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-schema-max"
            aria-describedby="field-schema-max-hint"
            name="schema.max"
            value={'max' in schema ? schema.max : undefined}
            type="number"
            onChange={(e) =>
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
            htmlFor="field-schema-maxwords"
          >
            {i18n('textFieldEditComponent.maxWordField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-maxwords-hint">
            {i18n('textFieldEditComponent.maxWordField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-schema-maxwords"
            aria-describedby="field-schema-maxwords-hint"
            name="schema.maxwords"
            value={'maxWords' in options ? options.maxWords : undefined}
            type="number"
            onChange={(e) =>
              dispatch({
                type: Options.EDIT_OPTIONS_MAX_WORDS,
                payload: e.target.value
              })
            }
          />
        </div>

        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-schema-length"
          >
            {i18n('textFieldEditComponent.lengthField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-length-hint">
            {i18n('textFieldEditComponent.lengthField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            data-cast="number"
            id="field-schema-length"
            aria-describedby="field-schema-length-hint"
            name="schema.length"
            value={'length' in schema ? schema.length : undefined}
            type="number"
            onChange={(e) =>
              dispatch({
                type: Schema.EDIT_SCHEMA_LENGTH,
                payload: e.target.value
              })
            }
          />
        </div>

        {children}

        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="field-schema-regex"
          >
            {i18n('textFieldEditComponent.regexField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-regex-hint">
            {i18n('textFieldEditComponent.regexField.helpText')}
          </div>
          <input
            className="govuk-input"
            id="field-schema-regex"
            aria-describedby="field-schema-regex-hint"
            name="schema.regex"
            value={'regex' in schema ? schema.regex : undefined}
            onChange={(e) =>
              dispatch({
                type: Schema.EDIT_SCHEMA_REGEX,
                payload: e.target.value
              })
            }
          />
        </div>

        <Autocomplete />

        <CssClasses />

        {[
          ComponentType.EmailAddressField,
          ComponentType.MonthYearField,
          ComponentType.MultilineTextField,
          ComponentType.NumberField,
          ComponentType.TelephoneNumberField,
          ComponentType.TextField
        ].includes(selectedComponent.type) && <CustomValidationMessage />}
      </div>
    </details>
  )
}
