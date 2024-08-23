import { type Item, type List } from '@defra/forms-model'
import React, {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode
} from 'react'

import { type ErrorList } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import randomId from '~/src/randomId.js'
import { ListActions } from '~/src/reducers/listActions.jsx'

export interface ListState extends Partial<FormList>, Partial<FormItem> {
  initialName?: string
  initialTitle?: string
  selectedListItem?: Item
  selectedItemIndex?: number
  errors: Partial<ErrorList<'title' | 'listItems'>>
  listItemErrors: Partial<ErrorList<'title' | 'value'>>
}

export interface FormList {
  selectedList: List & { isNew?: true }
}

export interface FormItem {
  selectedItem: Item & { isNew?: true }
}

export type ListReducerActions =
  | {
      name:
        | ListActions.ADD_NEW_LIST
        | ListActions.ADD_LIST_ITEM
        | ListActions.SUBMIT
      payload?: undefined
    }
  | {
      name: ListActions.SET_SELECTED_LIST
      payload: List
    }
  | {
      name:
        | ListActions.EDIT_TITLE
        | ListActions.EDIT_LIST_ITEM_TEXT
        | ListActions.EDIT_LIST_ITEM_VALUE
      payload: string
    }
  | {
      name:
        | ListActions.EDIT_LIST_ITEM_DESCRIPTION
        | ListActions.EDIT_LIST_ITEM_CONDITION
      payload?: string
    }
  | {
      name: ListActions.EDIT_LIST_ITEM
      payload: Item
    }
  | {
      name: ListActions.LIST_ITEM_VALIDATION_ERRORS
      payload: Exclude<ListState['listItemErrors'], undefined>
    }
  | {
      name: ListActions.LIST_VALIDATION_ERRORS
      payload: Exclude<ListState['errors'], undefined>
    }

export interface ListContextType {
  state: ListState
  dispatch: Dispatch<ListReducerActions>
}

export const ListContext = createContext<ListContextType>({
  state: {
    errors: {},
    listItemErrors: {}
  },
  dispatch: () => ({})
})

/**
 * Allows mutation of the {@link List} from any component that is nested within {@link ListContextProvider}
 */
export function listReducer(state: ListState, action: ListReducerActions) {
  const stateNew = structuredClone(state)

  const { selectedList, selectedItem } = stateNew
  const { name, payload } = action

  if (name === ListActions.ADD_NEW_LIST) {
    const listId = randomId()

    stateNew.initialName = listId
    stateNew.selectedList = {
      title: '',
      name: listId,
      type: 'string',
      items: [],
      isNew: true
    }

    stateNew.errors = {}
  }

  if (name === ListActions.SET_SELECTED_LIST) {
    stateNew.initialName = payload.name || state.initialName
    stateNew.initialTitle = payload.title
    stateNew.selectedList = payload
  }

  if (name === ListActions.LIST_VALIDATION_ERRORS) {
    stateNew.errors = payload
  }

  if (name === ListActions.SUBMIT) {
    stateNew.errors = {}
  }

  if (!selectedList) {
    return stateNew
  }

  if (name === ListActions.EDIT_TITLE) {
    selectedList.title = payload
  }

  if (name === ListActions.ADD_LIST_ITEM) {
    stateNew.selectedItem = {
      text: '',
      value: '',
      isNew: true
    }

    stateNew.listItemErrors = {}
  }

  if (name === ListActions.EDIT_LIST_ITEM) {
    stateNew.selectedItem = payload
    stateNew.selectedItemIndex = selectedList.items.findIndex(
      (item) => item === payload
    )

    stateNew.listItemErrors = {}
  }

  if (name === ListActions.LIST_ITEM_VALIDATION_ERRORS) {
    stateNew.listItemErrors = payload
  }

  if (!selectedItem) {
    return stateNew
  }

  if (name === ListActions.EDIT_LIST_ITEM_TEXT) {
    selectedItem.text = payload
  }

  if (name === ListActions.EDIT_LIST_ITEM_DESCRIPTION) {
    selectedItem.description = payload
  }

  if (name === ListActions.EDIT_LIST_ITEM_VALUE) {
    selectedItem.value = payload
  }

  if (name === ListActions.EDIT_LIST_ITEM_CONDITION) {
    selectedItem.condition = payload
  }

  return stateNew
}

/**
 * Allows components to retrieve {@link ListState} and {@link Dispatch} from any component nested within `<ListContextProvider>`
 */
export const ListContextProvider = (props: {
  children?: ReactNode
  selectedListName?: string
}) => {
  const { selectedListName } = props
  const { data } = useContext(DataContext)

  let init: ListState = {
    errors: {},
    listItemErrors: {}
  }

  if (selectedListName) {
    const selectedList = data.lists.find(
      ({ name }) => name === selectedListName
    )

    init = {
      ...init,
      selectedList,
      initialName: selectedListName,
      initialTitle: selectedList?.title
    }
  }

  const [state, dispatch] = useReducer(listReducer, init)

  return (
    <ListContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ListContext.Provider>
  )
}
