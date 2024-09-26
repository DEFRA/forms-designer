import { ComponentType } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Textarea } from '@xgovformbuilder/govuk-react-jsx'
import { useContext, type ChangeEvent } from 'react'

import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Options, Schema } from '~/src/reducers/component/types.js'

export function FileUploadFieldEdit() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent } = state

  if (selectedComponent?.type !== ComponentType.FileUploadField) {
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
            {i18n('fileUploadFieldEditComponent.minField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-min-hint">
            {i18n('fileUploadFieldEditComponent.minField.helpText')}
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
            htmlFor="field-schema-max"
          >
            {i18n('fileUploadFieldEditComponent.maxField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-max-hint">
            {i18n('fileUploadFieldEditComponent.maxField.helpText')}
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
            htmlFor="field-schema-length"
          >
            {i18n('fileUploadFieldEditComponent.lengthField.title')}
          </label>
          <div className="govuk-hint" id="field-schema-length-hint">
            {i18n('fileUploadFieldEditComponent.lengthField.helpText')}
          </div>
          <input
            className="govuk-input govuk-input--width-3"
            id="field-schema-length"
            aria-describedby="field-schema-length-hint"
            name="schema.length"
            value={schema.length ?? ''}
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

        <div className="govuk-form-group">
          <Textarea
            id="field-options-accept"
            name="options.accept"
            rows={3}
            label={{
              className: 'govuk-label--s',
              children: i18n('fileUploadFieldEditComponent.acceptField.title')
            }}
            hint={{
              children: i18n(
                'fileUploadFieldEditComponent.acceptField.helpText'
              )
            }}
            value={options.accept ?? ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              dispatch({
                name: Options.EDIT_OPTIONS_ACCEPT,
                payload: e.target.value,
                as: selectedComponent
              })
            }
          />
        </div>

        <CssClasses />
      </div>
    </details>
  )
}
