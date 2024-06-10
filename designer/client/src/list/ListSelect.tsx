import React, { useContext } from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
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
      <p className="govuk-body">{i18n('list.hint.description')}</p>
      <p className="govuk-body">{i18n('list.hint.manage')}</p>
      <ul className="govuk-list govuk-list--bullet">
        {data.lists.map((list) => (
          <li key={list.name}>
            <a
              data-testid="edit-list"
              href="#"
              className="govuk-link"
              onClick={(e) => editList(e, list)}
            >
              {list.title || list.name}
            </a>
          </li>
        ))}
      </ul>
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
      <div className="govuk-button-group">
        <button
          className="govuk-button"
          type="button"
          data-testid="add-list"
          onClick={(e) => {
            e.preventDefault()
            listDispatch({ type: ListActions.ADD_NEW_LIST })
            listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true])
          }}
        >
          {i18n('list.newTitle')}
        </button>
      </div>
    </>
  )
}
