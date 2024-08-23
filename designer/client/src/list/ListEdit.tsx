import { clone } from '@defra/forms-model'
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
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListItems } from '~/src/list/ListItems.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import {
  ListContext,
  type FormList,
  type ListContextType,
  type ListState
} from '~/src/reducers/listReducer.jsx'
import {
  validateCustom,
  validateRequired,
  hasValidationErrors
} from '~/src/validations.js'

const useListItemActions = (
  state: ListState,
  dispatch: ListContextType['dispatch']
) => {
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  function createItem() {
    dispatch({
      name: ListActions.ADD_LIST_ITEM
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: true
    })
  }

  return {
    createItem,
    selectedList: state.selectedList
  }
}

function useListEdit() {
  const { state: listEditorState, dispatch: listsEditorDispatch } =
    useContext(ListsEditorContext)

  const { state, dispatch } = useContext(ListContext)
  const { data, save } = useContext(DataContext)

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (window.confirm('Confirm delete')) {
      const { initialName } = listEditorState
      const copy = clone(data)

      const selectedListIndex = copy.lists.findIndex(
        (list) => list.name === initialName
      )

      if (selectedListIndex) {
        copy.lists.splice(selectedListIndex, 1)
        await save(copy)
      }
    }

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

    dispatch({
      name: ListActions.LIST_VALIDATION_ERRORS,
      payload: errors
    })

    return !hasValidationErrors(errors)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { selectedList, initialName } = state

    const payload = {
      selectedList
    }

    // Check for valid form payload
    if (!validate(payload)) {
      return
    }

    let copy = { ...data }
    if (payload.selectedList.isNew) {
      delete payload.selectedList.isNew
      copy = addList(copy, payload.selectedList)
    } else {
      const selectedListIndex = copy.lists.findIndex(
        (list) => list.name === initialName
      )
      copy.lists[selectedListIndex] = payload.selectedList
    }

    await save(copy)

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: false
    })

    dispatch({
      name: ListActions.SUBMIT
    })
  }

  return {
    handleDelete,
    handleSubmit
  }
}

export function ListEdit() {
  const { handleSubmit, handleDelete } = useListEdit()

  const { state, dispatch } = useContext(ListContext)
  const { selectedList, createItem } = useListItemActions(state, dispatch)

  const { errors } = state
  const hasErrors = hasValidationErrors(errors)

  return (
    <>
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        {selectedList && (
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
              dispatch({
                name: ListActions.EDIT_TITLE,
                payload: e.target.value
              })
            }
            errorMessage={errors.title}
          />
        )}

        <ListItems />

        <p className="govuk-body">
          <a
            href="#"
            id="list-items"
            className="govuk-link"
            onClick={(e) => {
              e.preventDefault()
              createItem()
            }}
          >
            {i18n('list.item.add')}
          </a>
        </p>

        <div className="govuk-button-group">
          <button className="govuk-button" type="submit">
            {i18n('save')}
          </button>

          {!selectedList?.isNew && (
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
