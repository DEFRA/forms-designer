import { ComponentType } from '@defra/forms-model'
import { useContext, type ReactNode } from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { CustomValidationMessage } from '~/src/components/CustomValidationMessage/CustomValidationMessage.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Schema } from '~/src/reducers/component/types.js'

interface Props {
  children?: ReactNode
}

export function TextFieldEdit({ children }: Readonly<Props>) {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (
    !(
      selectedComponent?.type === ComponentType.TextField ||
      selectedComponent?.type === ComponentType.MultilineTextField ||
      selectedComponent?.type === ComponentType.EmailAddressField ||
      selectedComponent?.type === ComponentType.TelephoneNumberField
    )
  ) {
    return null
  }

  const showSchemaFields =
    selectedComponent.type === ComponentType.TextField ||
    selectedComponent.type === ComponentType.MultilineTextField

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n('common.detailsLink.title')}
        </span>
      </summary>

      <div className="govuk-details__text">
        {showSchemaFields && (
          <>
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
                id="field-schema-min"
                aria-describedby="field-schema-min-hint"
                name="schema.min"
                value={selectedComponent.schema.min ?? ''}
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
                htmlFor="field-schema-max"
              >
                {i18n('textFieldEditComponent.maxLengthField.title')}
              </label>
              <div className="govuk-hint" id="field-schema-max-hint">
                {i18n('textFieldEditComponent.maxLengthField.helpText')}
              </div>
              <input
                className="govuk-input govuk-input--width-3"
                id="field-schema-max"
                aria-describedby="field-schema-max-hint"
                name="schema.max"
                value={selectedComponent.schema.max ?? ''}
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
                htmlFor="field-schema-length"
              >
                {i18n('textFieldEditComponent.lengthField.title')}
              </label>
              <div className="govuk-hint" id="field-schema-length-hint">
                {i18n('textFieldEditComponent.lengthField.helpText')}
              </div>
              <input
                className="govuk-input govuk-input--width-3"
                id="field-schema-length"
                aria-describedby="field-schema-length-hint"
                name="schema.length"
                value={selectedComponent.schema.length ?? ''}
                type="number"
                onChange={(e) =>
                  dispatch({
                    name: Schema.EDIT_SCHEMA_LENGTH,
                    payload: e.target.valueAsNumber,
                    as: selectedComponent
                  })
                }
              />
            </div>
          </>
        )}

        {children}

        {showSchemaFields && (
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
              value={selectedComponent.schema.regex ?? ''}
              onChange={(e) =>
                dispatch({
                  name: Schema.EDIT_SCHEMA_REGEX,
                  payload: e.target.value,
                  as: selectedComponent
                })
              }
            />
          </div>
        )}

        <Autocomplete />

        <CssClasses />

        <CustomValidationMessage />
      </div>
    </details>
  )
}
