import {
  ComponentType,
  getComponentDefaults,
  hasFormField,
  hasHint,
  hasTitle
} from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input, Textarea } from '@xgovformbuilder/govuk-react-jsx'
import classNames from 'classnames'
import { useContext, type ChangeEvent, type ReactNode } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields, Options } from '~/src/reducers/component/types.js'

export function FieldEdit() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent, errors } = state

  if (!selectedComponent) {
    return null
  }

  // Determine form input versus content only components
  const hasInput = hasFormField(selectedComponent)
  const hasFieldTitle = hasTitle(selectedComponent)
  const hasFieldHint = hasHint(selectedComponent)

  // Limit options by component type
  const hasOptionHideTitle =
    selectedComponent.type === ComponentType.List ||
    selectedComponent.type === ComponentType.UkAddressField

  // Help text (default)
  let helpTextGuidance: ReactNode | undefined
  let helpTextHint = i18n('common.helpTextField.helpText')

  // Help text (file upload)
  if (selectedComponent.type === ComponentType.FileUploadField) {
    helpTextGuidance = (
      <>
        <h4 className="govuk-heading-s govuk-!-margin-bottom-1">
          {i18n('fileUploadFieldEditComponent.helpTextField.title')}
        </h4>
        <p className="govuk-body govuk-!-margin-top-0">
          {i18n('fileUploadFieldEditComponent.helpTextField.guidance')}
        </p>
        <ul className="govuk-list govuk-list--bullet">
          {i18n('fileUploadFieldEditComponent.helpTextField.guidanceItems', {
            returnObjects: true
          }).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </>
    )

    helpTextHint = i18n('fileUploadFieldEditComponent.helpTextField.helpText')
  }

  const defaults = getComponentDefaults(selectedComponent)
  const isRequired = !hasInput || selectedComponent.options.required !== false

  return (
    <>
      {hasFieldTitle && (
        <Input
          id="field-title"
          name="title"
          label={{
            className: 'govuk-label--s',
            children: [i18n('common.titleField.title')]
          }}
          hint={{
            children: [i18n('common.titleField.helpText')]
          }}
          value={selectedComponent.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              name: Fields.EDIT_TITLE,
              payload: e.target.value,
              as: selectedComponent
            })
          }}
          errorMessage={errors.title}
        />
      )}
      {hasFieldHint && (
        <>
          {helpTextGuidance}
          <Textarea
            id="field-hint"
            name="hint"
            rows={2}
            label={{
              className: classNames({
                'govuk-label--s': !helpTextGuidance,
                'govuk-visually-hidden': !!helpTextGuidance
              }),
              children: [i18n('common.helpTextField.title')]
            }}
            hint={{
              children: [helpTextHint]
            }}
            required={false}
            value={selectedComponent.hint ?? ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              dispatch({
                name: Fields.EDIT_HELP,
                payload: e.target.value,
                as: selectedComponent
              })
            }}
          />
        </>
      )}
      {hasOptionHideTitle && (
        <div className="govuk-checkboxes govuk-form-group">
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="field-options-hideTitle"
              aria-describedby="field-options-hideTitle-hint"
              name="options.hideTitle"
              type="checkbox"
              checked={!!selectedComponent.options.hideTitle}
              onChange={(e) =>
                dispatch({
                  name: Options.EDIT_OPTIONS_HIDE_TITLE,
                  payload: e.target.checked,
                  as: selectedComponent
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-hideTitle"
            >
              {i18n('common.hideTitleOption.title')}
            </label>
            <div
              className="govuk-hint govuk-checkboxes__hint"
              id="field-options-hideTitle-hint"
            >
              {i18n('common.hideTitleOption.helpText')}
            </div>
          </div>
        </div>
      )}
      {hasInput && (
        <>
          <div className="govuk-checkboxes govuk-form-group">
            <div className="govuk-checkboxes__item">
              <input
                type="checkbox"
                id="field-options-required"
                aria-describedby="field-options-required-hint"
                className="govuk-checkboxes__input"
                name="options.required"
                checked={!isRequired}
                onChange={(e) =>
                  dispatch({
                    name: Options.EDIT_OPTIONS_REQUIRED,
                    payload: !e.target.checked,
                    as: selectedComponent
                  })
                }
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="field-options-required"
              >
                {i18n('common.componentOptionalOption.title', {
                  component: defaults.title
                })}
              </label>
              <div
                className="govuk-hint govuk-checkboxes__hint"
                id="field-options-required-hint"
              >
                {i18n('common.componentOptionalOption.helpText')}
              </div>
            </div>
          </div>
          <div
            className="govuk-checkboxes govuk-form-group"
            data-test-id="field-options.optionalText-wrapper"
            hidden={isRequired}
          >
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="field-options-optionalText"
                aria-describedby="field-options-optionalText-hint"
                name="options.optionalText"
                type="checkbox"
                checked={!!selectedComponent.options.optionalText}
                onChange={(e) =>
                  dispatch({
                    name: Options.EDIT_OPTIONS_HIDE_OPTIONAL,
                    payload: e.target.checked,
                    as: selectedComponent
                  })
                }
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="field-options-optionalText"
              >
                {i18n('common.hideOptionalTextOption.title')}
              </label>
              <div
                className="govuk-hint govuk-checkboxes__hint"
                id="field-options-optionalText-hint"
              >
                {i18n('common.hideOptionalTextOption.helpText')}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
