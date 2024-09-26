import { ComponentType, hasContentField } from '@defra/forms-model'
import classNames from 'classnames'
import { useContext } from 'react'

import { Editor } from '~/src/Editor.jsx'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields } from '~/src/reducers/component/types.js'

export function ContentEdit() {
  const { state, dispatch } = useContext(ComponentContext)

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
      <div className="govuk-hint" id="field-content-hint">
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
            name: Fields.EDIT_CONTENT,
            payload: content,
            as: selectedComponent
          })
        }}
      />
    </div>
  )
}
