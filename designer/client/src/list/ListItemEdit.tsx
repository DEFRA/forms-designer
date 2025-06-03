import { hasListField, isConditionWrapper } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input, Textarea } from '@xgovformbuilder/govuk-react-jsx'
import { useContext, type FormEvent, type MouseEvent } from 'react'

import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { useListItem } from '~/src/hooks/list/useListItem/useListItem.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'
import { hasValidationErrors } from '~/src/validations.js'

export function ListItemEdit() {
  const { data } = useContext(DataContext)
  const { state } = useContext(ComponentContext)
  const { state: listState, dispatch: listDispatch } = useContext(ListContext)
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const {
    handleTitleChange,
    handleConditionChange,
    handleValueChange,
    handleHintChange,
    prepareForSubmit,
    prepareForDelete,
    validate,
    value,
    condition,
    text,
    description,
    allowDelete,
    references
  } = useListItem(listState, listDispatch)

  const { conditions } = data
  const { selectedComponent } = state
  const { selectedList, selectedItem, listItemErrors: errors } = listState

  const hasErrors = hasValidationErrors(errors)

  if (selectedComponent && !hasListField(selectedComponent)) {
    throw new Error('Component must support lists')
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const payload = {
      selectedItem
    }

    const { default: schema } = await import('joi')

    // Check for valid form payload
    if (!validate(payload, schema)) {
      return
    }

    prepareForSubmit()

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: false
    })
  }

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    prepareForDelete()

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: false
    })
  }

  if (!selectedList || !selectedItem) {
    return null
  }

  return (
    <>
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}

      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <Input
          id="title"
          name="list-item-text"
          label={{
            className: 'govuk-label--s',
            children: [i18n('list.item.title')]
          }}
          hint={{ children: i18n('list.item.titleHint') }}
          value={text ?? ''}
          onChange={handleTitleChange}
          errorMessage={errors.title}
          disabled={!!references?.length}
        />
        <Textarea
          label={{ children: i18n('list.item.help') }}
          hint={{ children: i18n('list.item.helpHint') }}
          value={description ?? ''}
          name="list-item-hint"
          id="hint"
          onChange={handleHintChange}
        />
        <Input
          label={{ children: [i18n('list.item.value')] }}
          hint={{ children: [i18n('list.item.valueHint')] }}
          id="value"
          name="list-item-value"
          value={value ?? ''}
          errorMessage={errors.value}
          onChange={handleValueChange}
          disabled={!!references?.length}
        />
        <div className="govuk-form-group">
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
            value={condition ?? ''}
            onChange={handleConditionChange}
          >
            <option value="">{i18n('list.item.conditionsOption')}</option>
            {conditions.filter(isConditionWrapper).map((condition) => (
              <option key={condition.name} value={condition.name}>
                {condition.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="govuk-button-group">
          <button className="govuk-button" type="submit">
            {i18n('save')}
          </button>
          {allowDelete ? (
            <button
              className="govuk-button govuk-button--warning"
              type="button"
              onClick={handleDelete}
            >
              {i18n('delete')}
            </button>
          ) : (
            !!references?.length && (
              <p className="govuk-body">
                {i18n('list.item.referenced', {
                  references: references
                    .map((ref) => `"${ref.wrapper.displayName}"`)
                    .join(', ')
                })}
              </p>
            )
          )}
        </div>
      </form>
    </>
  )
}
