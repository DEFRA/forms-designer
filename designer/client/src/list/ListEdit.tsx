import { hasListField } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import Joi from 'joi'
import React, {
  useContext,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addList } from '~/src/data/list/addList.js'
import { findList } from '~/src/data/list/findList.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListItems } from '~/src/list/ListItems.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import {
  ListContext,
  type FormList,
  type ListState
} from '~/src/reducers/listReducer.jsx'
import {
  validateCustom,
  validateRequired,
  hasValidationErrors
} from '~/src/validations.js'

function useListEdit() {
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const { data, save } = useContext(DataContext)
  const { state: listState, dispatch: listDispatch } = useContext(ListContext)

  const { selectedList } = listState

  function handleAddItem(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()

    listDispatch({
      name: ListActions.ADD_LIST_ITEM
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: true
    })
  }

  async function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const definition = structuredClone(data)

    const listRemove = findList(definition, selectedList?.name)
    const listIndex = definition.lists.indexOf(listRemove)

    definition.lists.splice(listIndex, 1)

    await save(definition)

    listDispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: undefined
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: false
    })
  }

  function validate(payload: Partial<FormList>): payload is FormList {
    const { selectedList } = payload

    const errors: ListState['errors'] = {}

    errors.title = validateRequired('list-title', selectedList?.title, {
      label: i18n('list.title')
    })

    errors.listItems = validateCustom('list-items', selectedList?.items, {
      message: 'list.errors.empty',
      schema: Joi.array().min(1)
    })

    listDispatch({
      name: ListActions.LIST_VALIDATION_ERRORS,
      payload: errors
    })

    return !hasValidationErrors(errors)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    const payload = {
      selectedList
    }

    // Check for valid form payload
    if (!validate(payload)) {
      return
    }

    let definition = structuredClone(data)

    const list = structuredClone(payload.selectedList)

    if (list.isNew) {
      delete list.isNew
      definition = addList(definition, list)
    } else {
      const listEdit = findList(definition, payload.selectedList.name)
      const listIndex = definition.lists.indexOf(listEdit)

      if (listIndex > -1) {
        definition.lists[listIndex] = list
      }
    }

    await save(definition)

    listDispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: list
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: false
    })
  }

  return {
    handleAddItem,
    handleDelete,
    handleSubmit
  }
}

export function ListEdit() {
  const { state } = useContext(ComponentContext)
  const { state: listState, dispatch: listDispatch } = useContext(ListContext)

  const { selectedComponent } = state
  const { selectedList, errors } = listState
  const hasErrors = hasValidationErrors(errors)

  if (selectedComponent && !hasListField(selectedComponent)) {
    throw new Error('Component must support lists')
  }

  const { handleAddItem, handleDelete, handleSubmit } = useListEdit()

  if (!selectedList) {
    return null
  }

  return (
    <>
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}

      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <Input
          id="list-title"
          name="title"
          hint={{ children: i18n('list.titleHint') }}
          label={{
            className: 'govuk-label--s',
            children: [i18n('list.title')]
          }}
          value={selectedList.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            listDispatch({
              name: ListActions.EDIT_TITLE,
              payload: e.target.value
            })
          }
          errorMessage={errors.title}
        />

        <ListItems />

        <p className="govuk-body">
          <a
            href="#list-item-edit"
            id="list-items"
            className="govuk-link"
            onClick={handleAddItem}
          >
            {i18n('list.item.add')}
          </a>
        </p>

        <div className="govuk-button-group govuk-!-margin-top-6">
          <button className="govuk-button" type="submit">
            {i18n('save')}
          </button>

          {!selectedList.isNew && (
            <button
              className="govuk-button govuk-button--warning"
              type="button"
              onClick={handleDelete}
            >
              {i18n('delete')}
            </button>
          )}
        </div>
      </form>
    </>
  )
}
