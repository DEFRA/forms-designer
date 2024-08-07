import { clone } from '@defra/forms-model'
import React, { useContext } from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { useListItem } from '~/src/hooks/list/useListItem/useListItem.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

const ListItem = ({ item, removeItem, selectListItem }) => {
  return (
    <tr className="govuk-table__row">
      <td className="govuk-table__cell govuk-!-width-full">
        {item.text ?? item.label}
      </td>
      <td className="govuk-table__cell">
        <a
          href="#"
          className="govuk-link"
          onClick={(e) => {
            e.preventDefault()
            selectListItem(item)
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
            removeItem()
          }}
        >
          Delete
        </a>
      </td>
    </tr>
  )
}

export function ListItems() {
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ListContext)

  const selectListItem = (payload) => {
    dispatch({ type: ListActions.EDIT_LIST_ITEM, payload })
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST_ITEM, true])
  }

  const { prepareForDelete } = useListItem(state, dispatch)

  function removeItem(index: number) {
    const copy = clone(data)
    save(prepareForDelete(copy, index))
  }

  const { selectedList } = state
  if (!selectedList?.items?.length) {
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
            selectListItem={selectListItem}
            removeItem={() => removeItem(idx)}
          />
        ))}
      </tbody>
    </table>
  )
}
