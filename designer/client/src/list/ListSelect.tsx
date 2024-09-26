import { type List } from '@defra/forms-model'
import { useContext, type MouseEvent } from 'react'

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

  const editList = (e: MouseEvent<HTMLAnchorElement>, list: List) => {
    e.preventDefault()

    listDispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: list
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: true
    })
  }

  return (
    <>
      <p className="govuk-body">{i18n('list.hint.description')}</p>
      <p className="govuk-body">{i18n('list.hint.manage')}</p>
      <ul className="govuk-list govuk-list--bullet">
        {data.lists.map((list) => (
          <li key={list.name}>
            <a
              href="#list-edit"
              className="govuk-link"
              onClick={(e) => editList(e, list)}
            >
              {list.title}
            </a>
          </li>
        ))}
      </ul>
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
      <div className="govuk-button-group">
        <button
          className="govuk-button"
          type="button"
          onClick={(e) => {
            e.preventDefault()

            listDispatch({
              name: ListActions.ADD_NEW_LIST
            })

            listsEditorDispatch({
              name: ListsEditorStateActions.IS_EDITING_LIST,
              payload: true
            })
          }}
        >
          {i18n('list.add')}
        </button>
      </div>
    </>
  )
}
