import { Input, Textarea } from '@xgovformbuilder/govuk-react-jsx'
import React, { useContext, type FormEvent, type MouseEvent } from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { useListItem } from '~/src/hooks/list/useListItem/useListItem.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

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
  const { listItemErrors: errors = {} } = state
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    const copy = { ...data }
    const hasErrors = validate(i18n)
    if (hasErrors) return
    await save(prepareForSubmit(copy))
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST_ITEM, false])
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          id="title"
          data-testid="list-item-text"
          name="list-item-text"
          label={{
            className: 'govuk-label--s',
            children: [i18n('list.item.title')]
          }}
          hint={{ children: i18n('list.item.titleHint') }}
          value={title}
          onChange={handleTitleChange}
          errorMessage={
            errors.title ? { children: errors.title.children } : undefined
          }
        />
        <Textarea
          label={{ children: i18n('list.item.help') }}
          hint={{ children: i18n('list.item.helpHint') }}
          value={hint}
          data-testid="list-item-hint"
          name="list-item-hint"
          id="hint"
          onChange={handleHintChange}
        />
        <Input
          label={{ children: [i18n('list.item.value')] }}
          hint={{ children: [i18n('list.item.valueHint')] }}
          id="value"
          data-testid="list-item-value"
          name="list-item-value"
          value={value}
          errorMessage={
            errors.value ? { children: errors.value.children } : undefined
          }
          onChange={handleValueChange}
        />
        <label className="govuk-label" htmlFor="condition">
          {i18n('list.item.conditions')}
        </label>
        <div className="govuk-hint">{i18n('list.item.conditionsHint')}</div>
        <select
          className="govuk-select"
          id="condition"
          name="options.condition"
          data-testid="list-condition-select"
          value={condition}
          onChange={handleConditionChange}
        >
          <option value="" data-testid="list-condition-option" />
          {conditions.map((condition) => (
            <option
              key={condition.name}
              value={condition.name}
              data-testid="list-condition-option"
            >
              {condition.displayName}
            </option>
          ))}
        </select>
        <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
        <div className="govuk-button-group">
          <button
            data-testid="save-list-item"
            className="govuk-button"
            type="submit"
            onClick={handleSubmit}
          >
            {i18n('save')}
          </button>
        </div>
      </form>
    </>
  )
}
