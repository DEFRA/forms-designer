import React, { createContext, useReducer, type Dispatch } from 'react'

import { type ListsEdit } from '~/src/list/ListsEdit.jsx'

export enum ListsEditorStateActions {
  IS_EDITING_LIST = 'IS_EDITING_LIST',
  IS_EDITING_LIST_ITEM = 'IS_EDITING_LIST_ITEM',
  SET_LIST_TITLE = 'SET_LIST_TITLE',
  SET_LIST_ITEM_TITLE = 'SET_LIST_ITEM_TITLE',
  SET_CONTEXT = 'SET_CONTEXT',
  RESET = 'RESET'
}

export interface ListsEditorState {
  isEditingList: boolean
  isEditingListItem: boolean
  listTitle?: string
  listItemTitle?: string
  initialName?: string
}

export function initListsEditingState(): ListsEditorState {
  return {
    isEditingList: false,
    isEditingListItem: false
  }
}

export interface ListsEditorContextType {
  state: ListsEditorState
  dispatch: Dispatch<[ListsEditorStateActions, boolean | string]>
}

export const ListsEditorContext = createContext<ListsEditorContextType>({
  state: initListsEditingState(),
  dispatch: () => ({})
})

ListsEditorContext.displayName = 'ListsEditorContext'

/**
 * Responsible for which list editing screens should be open in {@link ListsEdit} component.
 */
export function listsEditorReducer(
  state,
  action: [ListsEditorStateActions, boolean | string]
): ListsEditorState {
  const [type, payload] = action

  switch (type) {
    case ListsEditorStateActions.SET_CONTEXT:
      return { ...state, listEditContext: payload }
    case ListsEditorStateActions.SET_LIST_TITLE:
      return { ...state, listTitle: payload }
    case ListsEditorStateActions.SET_LIST_ITEM_TITLE:
      return { ...state, listItemTitle: payload }
    case ListsEditorStateActions.IS_EDITING_LIST:
      return { ...state, isEditingList: payload }
    case ListsEditorStateActions.IS_EDITING_LIST_ITEM:
      return { ...state, isEditingListItem: payload }
    case ListsEditorStateActions.RESET:
      return initListsEditingState()
  }
}

export const ListsEditorContextProvider = (props) => {
  const [state, dispatch] = useReducer(
    listsEditorReducer,
    initListsEditingState()
  )

  return (
    <ListsEditorContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ListsEditorContext.Provider>
  )
}
