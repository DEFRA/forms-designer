import { slugify, type Item } from '@defra/forms-model'
import React, { useContext } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

interface Props {
  item: Item
  editListItem: (payload: Item) => void
}

const ListItem = ({ item, editListItem }: Readonly<Props>) => {
  return (
    <tr className="govuk-table__row">
      <td className="govuk-table__cell govuk-!-width-full">
        {item.text}
        {item.description && (
          <>
            <br />
            <span className="govuk-hint">{item.description}</span>
          </>
        )}
      </td>
      <td className="govuk-table__cell">
        <a
          href="#list-item-edit"
          className="govuk-link"
          onClick={(e) => {
            e.preventDefault()
            editListItem(item)
          }}
        >
          Edit
        </a>
      </td>
    </tr>
  )
}

export function ListItems() {
  const { state: listState, dispatch: listDispatch } = useContext(ListContext)
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const editListItem = (payload: Item) => {
    listDispatch({
      name: ListActions.EDIT_LIST_ITEM,
      payload
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: true
    })
  }

  const { selectedList } = listState
  if (!selectedList?.items.length) {
    return null
  }

  return (
    <table className="govuk-table govuk-!-margin-bottom-2">
      <caption className={'govuk-table__caption'}>
        {i18n('list.items.title')}
      </caption>
      <tbody className="govuk-table__body">
        {selectedList.items.map((item) => (
          <ListItem
            key={slugify(`${selectedList.name}-${item.text}`)}
            item={item}
            editListItem={editListItem}
          />
        ))}
      </tbody>
    </table>
  )
}
