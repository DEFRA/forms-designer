import { clone } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React, {
  useContext,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ErrorSummary, type ErrorList } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addList } from '~/src/data/list/addList.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListItems } from '~/src/list/ListItems.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'
import { hasValidationErrors, validateTitle } from '~/src/validations.js'

const useListItemActions = (state, dispatch) => {
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  function deleteItem(e) {
    e.preventDefault()
    dispatch({
      type: ListActions.DELETE_LIST_ITEM
    })
  }

  function createItem() {
    dispatch({ type: ListActions.ADD_LIST_ITEM })
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST_ITEM, true])
  }

  return {
    deleteItem,
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

    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, false])
  }

  const validate = (): Partial<ErrorList<'title' | 'listItems'>> => {
    const { selectedList } = state

    const titleErrors = validateTitle(
      'title',
      'list-title',
      '$t(list.title)',
      selectedList?.title,
      i18n
    )

    const errors: ReturnType<typeof validate> = {
      ...titleErrors
    }

    if (!selectedList?.items.length) {
      errors.listItems = {
        children: [i18n('list.errors.empty')]
      }
    }

    return errors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { selectedList, initialName } = state
    const errors = validate()
    if (hasValidationErrors(errors)) {
      dispatch({
        type: ListActions.LIST_VALIDATION_ERRORS,
        payload: errors
      })
      return
    }
    let copy = { ...data }
    if (selectedList?.isNew) {
      delete selectedList.isNew
      copy = addList(copy, selectedList)
    } else {
      const selectedListIndex = copy.lists.findIndex(
        (list) => list.name === initialName
      )
      copy.lists[selectedListIndex] = selectedList
    }
    await save(copy)

    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, false])
    dispatch({
      type: ListActions.SUBMIT
    })
  }

  return {
    handleDelete,
    handleSubmit
  }
}

function validate(errors: ErrorList, selectedList: any) {
  if (selectedList.items.length > 0) {
    return {}
  }

  return errors ?? {}
}

export function ListEdit() {
  const { handleSubmit, handleDelete } = useListEdit()

  const { state, dispatch } = useContext(ListContext)
  const { selectedList, createItem } = useListItemActions(state, dispatch)
  let { errors = {} } = state
  errors = validate(errors, selectedList)
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
                type: ListActions.EDIT_TITLE,
                payload: e.target.value
              })
            }
            errorMessage={errors.title}
          />
        )}

        <ListItems />

        <p className="govuk-body">
          <a
            href="#createItem"
            className="govuk-link"
            data-testid="add-list-item"
            onClick={(e) => {
              e.preventDefault()
              createItem()
            }}
          >
            {i18n('list.item.add')}
          </a>
        </p>

        <div className="govuk-button-group">
          <button
            data-testid="save-list"
            className="govuk-button"
            type="submit"
          >
            {i18n('save')}
          </button>

          {selectedList?.isNew || (
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
