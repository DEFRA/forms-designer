import { ComponentType, hasContentField } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Textarea } from '@xgovformbuilder/govuk-react-jsx'
import { useContext, type ChangeEvent } from 'react'

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
    <Textarea
      id="field-content"
      name="content"
      rows={3}
      label={{
        className: 'govuk-label--s',
        children: 'Content'
      }}
      hint={{
        children: i18n(
          selectedComponent.type === ComponentType.Details
            ? 'fieldEdit.details.hint'
            : 'fieldEdit.para.hint'
        )
      }}
      value={selectedComponent.content}
      errorMessage={errors.content}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        dispatch({
          name: Fields.EDIT_CONTENT,
          payload: e.target.value,
          as: selectedComponent
        })
      }
    />
  )
}
