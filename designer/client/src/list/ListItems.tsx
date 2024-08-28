import { type Item } from '@defra/forms-model'
import React, { useContext } from 'react'

import { useListItem } from '~/src/hooks/list/useListItem/useListItem.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

interface Props {
  item: Item
  removeListItem: (payload: Item) => void
  editListItem: (payload: Item) => void
}

const ListItem = ({ item, removeListItem, editListItem }: Props) => {
  return (
    <tr className="govuk-table__row">
      <td className="govuk-table__cell govuk-!-width-full">{item.text}</td>
      <td className="govuk-table__cell">
        <a
          href="#"
          className="govuk-link"
          onClick={(e) => {
            e.preventDefault()
            editListItem(item)
          }}
        >
          Edit
        </a>
      </td>
      <td className="govuk-table__cell">
        <a
          href="#"
          className="govuk-link"
          onClick={(e) => {
            e.preventDefault()
            removeListItem(item)
          }}
        >
          Delete
        </a>
      </td>
    </tr>
  )
}

export function ListItems() {
  const { state, dispatch } = useContext(ListContext)
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const { prepareForDelete } = useListItem(state, dispatch)

  const editListItem = (payload: Item) => {
    dispatch({
      name: ListActions.EDIT_LIST_ITEM,
      payload
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: true
    })
  }

  function removeListItem(payload: Item) {
    prepareForDelete(payload)
  }

  const { selectedList } = state
  if (!selectedList?.items.length) {
    return null
  }

  return (
    <table className="govuk-table govuk-!-margin-bottom-2">
      <caption className={'govuk-table__caption'}>
        {i18n('list.items.title')}
      </caption>
      <tbody className="govuk-table__body">
        {selectedList.items.map((item, idx) => (
          <ListItem
            key={`item-${idx}`}
            item={item}
            editListItem={editListItem}
            removeListItem={removeListItem}
          />
        ))}
      </tbody>
    </table>
  )
}
