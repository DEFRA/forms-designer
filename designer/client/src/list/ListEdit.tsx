import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React, { useContext } from 'react'

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
  const { showWarning } = listEditorState
  const { data, save } = useContext(DataContext)
  const handleDelete = (isNewList) => {
    if (isNewList) {
      listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, false])
    }
    if (!showWarning) {
      listsEditorDispatch([ListsEditorStateActions.SHOW_WARNING, true])
    }
  }

  const validate = () => {
    const { selectedList } = state
    const errors = validateTitle('list-title', selectedList.title, i18n)
    if (selectedList.items.length <= 0) {
      errors.listItems = {
        children: ['list.errors.empty']
      }
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
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
    if (selectedList.isNew) {
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

function validate(errors: any, selectedList: any) {
  if (selectedList.items.length > 0) {
    return {}
  }
  return errors
}

export function ListEdit() {
  const { handleSubmit, handleDelete } = useListEdit()

  const { state, dispatch } = useContext(ListContext)
  const { selectedList, createItem } = useListItemActions(state, dispatch)
  let { errors } = state
  errors = validate(errors, selectedList)
  const validationErrors = hasValidationErrors(errors)
  return (
    <>
      {validationErrors && <ErrorSummary errorList={Object.values(errors)} />}
      <form onSubmit={handleSubmit} autoComplete="off">
        {selectedList && (
          <Input
            id="list-title"
            hint={{ children: i18n('list.titleHint') }}
            label={{
              className: 'govuk-label--s',
              children: [i18n('list.title')]
            }}
            value={selectedList.title}
            onChange={(e) =>
              dispatch({
                type: ListActions.EDIT_TITLE,
                payload: e.target.value
              })
            }
            errorMessage={
              errors?.title ? { children: errors?.title.children } : undefined
            }
          />
        )}

        <ListItems />

        <p className="govuk-body">
          <a
            className="govuk-link govuk-!-display-block govuk-!-margin-bottom-1"
            href="#createItem"
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
            onClick={handleSubmit}
          >
            {i18n('save')}
          </button>
          <button
            className="govuk-button govuk-button--warning"
            type="button"
            onClick={(e) => {
              e.preventDefault()
              handleDelete(selectedList?.isNew)
            }}
          >
            {i18n(selectedList?.isNew ? 'cancel' : 'delete')}
          </button>
        </div>
      </form>
    </>
  )
}
