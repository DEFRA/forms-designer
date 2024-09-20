import { slugify, type Item } from '@defra/forms-model'
import React, { useCallback, useContext, type ComponentProps } from 'react'

import { SortUpDown } from '~/src/SortUpDown.jsx'
import { arrayMove } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

interface Props extends ComponentProps<'div'> {
  item: Item
  editListItem: (payload: Item) => void
}

const ListItem = ({ id, item, editListItem }: Readonly<Props>) => {
  return (
    <div className="app-result__container govuk-body">
      <a
        href="#list-item-edit"
        className="govuk-link"
        aria-describedby={`${id}-hint`}
        onClick={(e) => {
          e.preventDefault()
          editListItem(item)
        }}
      >
        {item.text}
      </a>
      {item.description && (
        <p
          className="govuk-hint govuk-!-margin-top-1 govuk-!-margin-bottom-0"
          id={`${id}-hint`}
        >
          {item.description}
        </p>
      )}
    </div>
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

  const handleMove = useCallback(
    (index: number, newIndex: number) => {
      if (!selectedList) {
        return
      }

      const listEdit = structuredClone(selectedList)
      listEdit.items = arrayMove(listEdit.items, index, newIndex)

      listDispatch({
        name: ListActions.SET_SELECTED_LIST,
        payload: listEdit
      })
    },
    [selectedList, listDispatch]
  )

  if (!selectedList?.items.length) {
    return null
  }

  const headingId = `${selectedList.name}-heading`
  const showMoveActions = selectedList.items.length > 1

  const moveUpTitle = i18n('list.item.moveUp')
  const moveDownTitle = i18n('list.item.moveDown')

  return (
    <>
      <h3 id={headingId} className="govuk-heading-m govuk-!-margin-bottom-2">
        {i18n('list.items.title')}
      </h3>

      <ul className="app-results app-results--panel">
        {selectedList.items.map((item, index) => {
          const key = slugify(`${selectedList.name}-${item.text}`)
          const moveUpLabel = i18n('list.item.moveUp_label', { ...item })
          const moveDownLabel = i18n('list.item.moveDown_label', { ...item })

          return (
            <li key={key} className="app-result">
              <ListItem id={key} item={item} editListItem={editListItem} />
              {showMoveActions && (
                <SortUpDown
                  moveUp={{
                    title: moveUpTitle,
                    'aria-label': moveUpLabel,
                    onClick: () => handleMove(index, index - 1)
                  }}
                  moveDown={{
                    title: moveDownTitle,
                    'aria-label': moveDownLabel,
                    onClick: () => handleMove(index, index + 1)
                  }}
                />
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
