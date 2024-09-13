import React, {
  createContext,
  useMemo,
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

export function initListsEditorState(
  props?: Readonly<Partial<ListsEditorState>>
): ListsEditorState {
  return {
    isEditingList: false,
    isEditingListItem: false,
    ...props
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
  state: {} as ListsEditorState,
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

export const ListsEditorContextProvider = (
  props: Parameters<typeof initListsEditorState>[0] & {
    children: ReactNode
  }
) => {
  const { children, ...initialListsEditorState } = props

  const [state, dispatch] = useReducer(
    listsEditorReducer,
    initialListsEditorState,
    initListsEditorState
  )

  const context = useMemo(() => ({ state, dispatch }), [state])

  return (
    <ListsEditorContext.Provider value={context}>
      {props.children}
    </ListsEditorContext.Provider>
  )
}
