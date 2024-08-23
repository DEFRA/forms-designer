// @ts-expect-error -- No types available
import { Input, Textarea } from '@xgovformbuilder/govuk-react-jsx'
import React, { useContext, type FormEvent, type MouseEvent } from 'react'

import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { useListItem } from '~/src/hooks/list/useListItem/useListItem.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'
import { hasValidationErrors } from '~/src/validations.js'

export function ListItemEdit() {
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)
  const { state, dispatch } = useContext(ListContext)
  const { data, save } = useContext(DataContext)

  const {
    handleTitleChange,
    handleConditionChange,
    handleValueChange,
    handleHintChange,
    prepareForSubmit,
    validate,
    value,
    condition,
    title,
    hint
  } = useListItem(state, dispatch)

  const { conditions } = data
  const { listItemErrors: errors, selectedItem } = state
  const hasErrors = hasValidationErrors(errors)

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    const payload = {
      selectedItem
    }

    // Check for valid form payload
    if (!validate(payload)) {
      return
    }

    await save(prepareForSubmit(data))

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: false
    })
  }

  return (
    <>
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}

      <form onSubmit={handleSubmit}>
        <Input
          id="title"
          name="list-item-text"
          label={{
            className: 'govuk-label--s',
            children: [i18n('list.item.title')]
          }}
          hint={{ children: i18n('list.item.titleHint') }}
          value={title}
          onChange={handleTitleChange}
          errorMessage={errors.title}
        />
        <Textarea
          label={{ children: i18n('list.item.help') }}
          hint={{ children: i18n('list.item.helpHint') }}
          value={hint}
          name="list-item-hint"
          id="hint"
          onChange={handleHintChange}
        />
        <Input
          label={{ children: [i18n('list.item.value')] }}
          hint={{ children: [i18n('list.item.valueHint')] }}
          id="value"
          name="list-item-value"
          value={value}
          errorMessage={errors.value}
          onChange={handleValueChange}
        />
        <label className="govuk-label" htmlFor="condition">
          {i18n('list.item.conditions')}
        </label>
        <div className="govuk-hint" id="condition-hint">
          {i18n('list.item.conditionsHint')}
        </div>
        <select
          className="govuk-select"
          id="condition"
          aria-describedby="condition-hint"
          name="options.condition"
          value={condition}
          onChange={handleConditionChange}
        >
          <option value="" />
          {conditions.map((condition) => (
            <option key={condition.name} value={condition.name}>
              {condition.displayName}
            </option>
          ))}
        </select>
        <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
        <div className="govuk-button-group">
          <button className="govuk-button" type="submit" onClick={handleSubmit}>
            {i18n('save')}
          </button>
        </div>
      </form>
    </>
  )
}
