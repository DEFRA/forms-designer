import { ComponentType, hasContentField } from '@defra/forms-model'
import classNames from 'classnames'
import React, { useContext } from 'react'

import { Editor } from '~/src/Editor.jsx'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields } from '~/src/reducers/component/types.js'

interface Props {
  context?: typeof ComponentContext
}

export function ContentEdit({ context = ComponentContext }: Props) {
  const { state, dispatch } = useContext(context)

  const { selectedComponent, errors } = state

  if (!hasContentField(selectedComponent)) {
    return null
  }

  return (
    <div
      className={classNames({
        'govuk-form-group': true,
        'govuk-form-group--error': errors.content
      })}
    >
      <label className="govuk-label govuk-label--s" htmlFor="field-content">
        Content
      </label>
      <div className="govuk-hint" id="field-content-error">
        {i18n(
          selectedComponent.type === ComponentType.Details
            ? 'fieldEdit.details.hint'
            : 'fieldEdit.para.hint'
        )}
      </div>
      {errors.content && (
        <ErrorMessage id="field-content-error">
          {errors.content.children}
        </ErrorMessage>
      )}
      <Editor
        id="field-content"
        aria-describedby={
          'field-content-hint' + (errors.name ? 'field-content-error' : '')
        }
        name="content"
        value={selectedComponent.content}
        onValueChange={(content) => {
          dispatch({
            type: Fields.EDIT_CONTENT,
            payload: content
          })
        }}
      />
    </div>
  )
}
