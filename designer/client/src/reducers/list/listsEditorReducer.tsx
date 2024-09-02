import React, {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode
} from 'react'

import { type ListsEdit } from '~/src/list/ListsEdit.jsx'

export enum ListsEditorStateActions {
  IS_EDITING_LIST = 'IS_EDITING_LIST',
  IS_EDITING_LIST_ITEM = 'IS_EDITING_LIST_ITEM'
}

export interface ListsEditorState {
  isEditingList: boolean
  isEditingListItem: boolean
}

export function initListsEditingState(): ListsEditorState {
  return {
    isEditingList: false,
    isEditingListItem: false
  }
}

export interface ReducerActions {
  name: ListsEditorStateActions
  payload: boolean
}

export interface ListsEditorContextType {
  state: ListsEditorState
  dispatch: Dispatch<ReducerActions>
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
  state: ListsEditorState,
  action: ReducerActions
): ListsEditorState {
  const stateNew = structuredClone(state)

  const { name, payload } = action

  switch (name) {
    case ListsEditorStateActions.IS_EDITING_LIST:
      stateNew.isEditingList = payload
      break

    case ListsEditorStateActions.IS_EDITING_LIST_ITEM:
      stateNew.isEditingListItem = payload
      break
  }

  return stateNew
}

interface Props {
  children: ReactNode
}

export const ListsEditorContextProvider = (props: Props) => {
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
