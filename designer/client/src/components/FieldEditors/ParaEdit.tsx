import classNames from 'classnames'
import React, { useContext } from 'react'

import { Editor } from '~/src/Editor.jsx'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields, Options } from '~/src/reducers/component/types.js'

interface Props {
  context: any // TODO
}

export function ParaEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context)
  const { selectedComponent = {}, errors = {} } = state
  const { data } = useContext(DataContext)
  const { options = {} } = selectedComponent
  const { conditions } = data

  return (
    <>
      <div
        className={classNames({
          'govuk-form-group': true,
          'govuk-form-group--error': errors.content
        })}
      >
        <label className="govuk-label govuk-label--s" htmlFor="field-content">
          Content
        </label>
        <div className="govuk-hint">{i18n('fieldEdit.para.hint')}</div>
        {errors.content && (
          <ErrorMessage>{errors.content.children}</ErrorMessage>
        )}
        <Editor
          id="field-content"
          name="content"
          value={
            'content' in selectedComponent
              ? selectedComponent.content
              : undefined
          }
          onValueChange={(content) => {
            dispatch({
              type: Fields.EDIT_CONTENT,
              payload: content
            })
          }}
        />
      </div>
      {!conditions.length || (
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="condition">
            Condition (optional)
          </label>
          <div className="govuk-hint">{i18n('fieldEdit.conditions.hint')} </div>
          <select
            className="govuk-select"
            id="condition"
            name="options.condition"
            value={'condition' in options ? options.condition : undefined}
            onChange={(e) =>
              dispatch({
                type: Options.EDIT_OPTIONS_CONDITION,
                payload: e.target.value
              })
            }
          >
            <option value="" />
            {conditions.map((condition) => (
              <option key={condition.name} value={condition.name}>
                {condition.displayName}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  )
}
