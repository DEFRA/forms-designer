import React, { useContext } from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListEdit } from '~/src/list/ListEdit.jsx'
import { ListItemEdit } from '~/src/list/ListItemEdit.jsx'
import { ListSelect } from '~/src/list/ListSelect.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

interface Props {
  showEditLists: boolean
}

const useListsEdit = () => {
  const { state } = useContext(ListContext)
  const { state: listEditState, dispatch: listsEditorDispatch } =
    useContext(ListsEditorContext)

  const { isEditingList, isEditingListItem } = listEditState
  const { initialTitle, initialItemText, selectedList, selectedItem } = state

  const closeFlyout = (type: ListsEditorStateActions) => {
    return () => listsEditorDispatch({ name: type, payload: false })
  }

  const listTitle = selectedList?.isNew
    ? i18n('list.add')
    : i18n('list.edit', {
        title: initialTitle ?? selectedList?.title
      })

  const itemTitle = selectedItem?.isNew
    ? i18n('list.item.add')
    : i18n('list.item.edit', {
        title: initialItemText ?? selectedItem?.text
      })

  return {
    isEditingList,
    isEditingListItem,
    selectedList,
    selectedItem,
    closeFlyout,
    listTitle,
    itemTitle
  }
}

export function ListsEdit({ showEditLists = false }: Props) {
  const {
    isEditingList,
    isEditingListItem,
    closeFlyout,
    listTitle,
    itemTitle
  } = useListsEdit()

  return (
    <>
      {!showEditLists && <ListSelect />}

      {isEditingList && (
        <RenderInPortal>
          <Flyout
            title={listTitle}
            onHide={closeFlyout(ListsEditorStateActions.IS_EDITING_LIST)}
            width={''}
          >
            <ListEdit />
          </Flyout>
        </RenderInPortal>
      )}

      {isEditingListItem && (
        <RenderInPortal>
          <Flyout
            title={itemTitle}
            width={''}
            onHide={closeFlyout(ListsEditorStateActions.IS_EDITING_LIST_ITEM)}
          >
            <ListItemEdit />
          </Flyout>
        </RenderInPortal>
      )}
    </>
  )
}
