import React, { useContext } from 'react'

import { DataContext } from '~/src/context/index.js'
import { i18n } from '~/src/i18n/index.js'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

export function ListSelect() {
  const { data } = useContext(DataContext)
  const { dispatch: listDispatch } = useContext(ListContext)
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const editList = (e, list) => {
    e.preventDefault()
    listDispatch({
      type: ListActions.SET_SELECTED_LIST,
      payload: list
    })
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true])
  }

  return (
    <>
      <div className="govuk-body govuk-hint">
        <p>{i18n('list.hint.description')}</p>
        <p>{i18n('list.hint.manage')}</p>
      </div>
      <ul className="govuk-list">
        {data.lists.map((list) => (
          <li key={list.name}>
            <a
              data-testid="edit-list"
              href="#"
              onClick={(e) => editList(e, list)}
            >
              {list.title || list.name}
            </a>
          </li>
        ))}
        <li>
          <hr />
          <a
            href="#"
            className="govuk-link"
            data-testid="add-list"
            onClick={(e) => {
              e.preventDefault()
              listDispatch({ type: ListActions.ADD_NEW_LIST })
              listsEditorDispatch([
                ListsEditorStateActions.IS_EDITING_LIST,
                true
              ])
            }}
          >
            {i18n('list.newTitle')}
          </a>
        </li>
      </ul>
    </>
  )
}
export default ListSelect
