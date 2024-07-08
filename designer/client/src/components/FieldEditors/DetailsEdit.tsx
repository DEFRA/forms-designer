import { Input } from '@xgovformbuilder/govuk-react-jsx'
import classNames from 'classnames'
import React, { useContext } from 'react'

import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
}

export function DetailsEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context)
  const { selectedComponent, errors = {} } = state

  if (!selectedComponent) {
    return null
  }

  return (
    <>
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
        onChange={(e) =>
          dispatch({
            type: Fields.EDIT_TITLE,
            payload: e.target.value
          })
        }
        errorMessage={errors.title}
      />

      <div
        className={classNames({
          'govuk-form-group': true,
          'govuk-form-group--error': errors.content
        })}
      >
        <label className="govuk-label govuk-label--s" htmlFor="field-content">
          Content
        </label>
        <div className="govuk-hint" id="field-content-hint">
          {i18n('fieldEdit.details.hint')}
        </div>
        {errors.content && (
          <ErrorMessage id="field-content-error">
            {errors.content.children}
          </ErrorMessage>
        )}
        <textarea
          className="govuk-textarea"
          id="field-content"
          aria-describedby={
            'field-content-hint' + (errors.name ? 'field-content-error' : '')
          }
          name="content"
          defaultValue={
            'content' in selectedComponent
              ? selectedComponent.content
              : undefined
          }
          rows={10}
          onChange={(e) =>
            dispatch({
              type: Fields.EDIT_CONTENT,
              payload: e.target.value
            })
          }
        />
      </div>
    </>
  )
}
