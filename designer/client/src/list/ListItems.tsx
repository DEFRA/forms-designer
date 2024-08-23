import { clone, type Item } from '@defra/forms-model'
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

interface Props {
  item: Item
  removeItem: () => void
  selectListItem: (payload: Item) => void
}

const ListItem = ({ item, removeItem, selectListItem }: Props) => {
  return (
    <tr className="govuk-table__row">
      <td className="govuk-table__cell govuk-!-width-full">{item.text}</td>
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

  const selectListItem = (payload: Item) => {
    dispatch({
      name: ListActions.EDIT_LIST_ITEM,
      payload
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: true
    })
  }

  const { prepareForDelete } = useListItem(state, dispatch)

  async function removeItem(index: number) {
    await save(prepareForDelete(data, index))
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
            selectListItem={selectListItem}
            removeItem={() => removeItem(idx)}
          />
        ))}
      </tbody>
    </table>
  )
}
