import { type ContentOptions } from '@defra/forms-model'
import React, { useContext } from 'react'

import { Editor } from '~/src/Editor.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Actions } from '~/src/reducers/component/types.js'

interface Props {
  context: any // TODO
}

export function ParaEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context)
  const { selectedComponent } = state
  const { data } = useContext(DataContext)
  const { options = {} }: { options: ContentOptions } = selectedComponent
  const { conditions } = data

  return (
    <>
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="field-content">
          Content
        </label>
        <div className="govuk-hint">{i18n('fieldEdit.para.hint')}</div>
        <Editor
          id="field-content"
          name="content"
          value={selectedComponent.content}
          onValueChange={(content) => {
            dispatch({
              type: Actions.EDIT_CONTENT,
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
            value={options.condition}
            onChange={(e) =>
              dispatch({
                type: Actions.EDIT_OPTIONS_CONDITION,
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
