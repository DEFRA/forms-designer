import {
  ComponentType,
  getComponentDefaults,
  hasContent,
  hasTitle
} from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input, Textarea } from '@xgovformbuilder/govuk-react-jsx'
import classNames from 'classnames'
import React, { type ChangeEvent, useContext } from 'react'

import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields, Options } from '~/src/reducers/component/types.js'

export function FieldEdit() {
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent, errors = {} } = state

  if (!selectedComponent) {
    return null
  }

  const { name, title, type, options } = selectedComponent
  const defaults = getComponentDefaults(selectedComponent)
  const isRequired = !('required' in options) || options.required !== false

  // Determine form input versus content only components
  const hasInput = !hasContent(selectedComponent)

  // Limit options by component type
  const hasFieldTitle = hasTitle(selectedComponent)
  const hasFieldName = hasInput
  const hasFieldHint = hasInput || type === ComponentType.List
  const hasOptionRequired = hasInput
  const hasOptionHideTitle = type === ComponentType.UkAddressField

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
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: Fields.EDIT_TITLE,
              payload: e.target.value
            })
          }}
          errorMessage={errors.title}
        />
      )}
      {hasFieldHint && (
        <Textarea
          id="field-hint"
          name="hint"
          rows={2}
          label={{
            className: 'govuk-label--s',
            children: [i18n('common.helpTextField.title')]
          }}
          hint={{
            children: [i18n('common.helpTextField.helpText')]
          }}
          required={false}
          value={selectedComponent.hint}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            dispatch({
              type: Fields.EDIT_HELP,
              payload: e.target.value
            })
          }}
        />
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
              checked={'hideTitle' in options && !!options.hideTitle}
              onChange={(e) =>
                dispatch({
                  type: Options.EDIT_OPTIONS_HIDE_TITLE,
                  payload: e.target.checked
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
      {hasFieldName && (
        <div
          className={classNames({
            'govuk-form-group': true,
            'govuk-form-group--error': errors.name
          })}
        >
          <label className="govuk-label govuk-label--s" htmlFor="field-name">
            {i18n('common.componentNameField.title')}
          </label>
          <div className="govuk-hint" id="field-name-hint">
            {i18n('name.hint')}
          </div>
          {errors.name && (
            <ErrorMessage id="field-name-error">
              {i18n('name.errors.whitespace')}
            </ErrorMessage>
          )}
          <input
            className={classNames({
              'govuk-input govuk-input--width-20': true,
              'govuk-input--error': errors.name
            })}
            id="field-name"
            aria-describedby={
              'field-name-hint' + (errors.name ? 'field-name-error' : '')
            }
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              dispatch({
                type: Fields.EDIT_NAME,
                payload: e.target.value
              })
            }}
          />
        </div>
      )}
      {hasOptionRequired && (
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
                    type: Options.EDIT_OPTIONS_REQUIRED,
                    payload: !e.target.checked
                  })
                }
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="field-options-required"
              >
                {i18n('common.componentOptionalOption.title', {
                  component: defaults?.title ?? ''
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
                checked={'optionalText' in options && !!options.optionalText}
                onChange={(e) =>
                  dispatch({
                    type: Options.EDIT_OPTIONS_HIDE_OPTIONAL,
                    payload: e.target.checked
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
