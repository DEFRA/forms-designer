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
import { findList, findListItem } from '~/src/data/list/findList.js'
import randomId from '~/src/randomId.js'
import { ListActions } from '~/src/reducers/listActions.jsx'

export interface ListState extends Partial<FormList>, Partial<FormItem> {
  initialName?: string
  initialTitle?: string
  initialItem?: string
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
      payload?: List
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

  const { name, payload } = action
  let { initialItem, selectedList, selectedItem } = stateNew

  switch (name) {
    case ListActions.ADD_NEW_LIST: {
      const listId = randomId()

      selectedList = {
        title: '',
        name: listId,
        type: 'string',
        items: [],
        isNew: true
      }

      stateNew.selectedList = selectedList
      stateNew.errors = {}
      break
    }

    case ListActions.SET_SELECTED_LIST: {
      selectedList = payload

      stateNew.selectedList = selectedList
      stateNew.initialName = selectedList?.name
      stateNew.initialTitle = selectedList?.title
      stateNew.errors = {}
      break
    }

    case ListActions.LIST_ITEM_VALIDATION_ERRORS:
      stateNew.listItemErrors = payload
      break

    case ListActions.LIST_VALIDATION_ERRORS:
    case ListActions.SUBMIT:
      stateNew.errors = payload ?? {}
      break
  }

  if (!selectedList) {
    return stateNew
  }

  switch (name) {
    case ListActions.EDIT_TITLE:
      selectedList.title = payload
      break

    case ListActions.ADD_LIST_ITEM: {
      selectedItem = {
        text: '',
        value: '',
        isNew: true
      }

      initialItem = selectedItem.text

      stateNew.selectedItem = selectedItem
      stateNew.initialItem = initialItem
      stateNew.listItemErrors = {}

      break
    }

    case ListActions.EDIT_LIST_ITEM: {
      selectedItem = payload
      initialItem = payload.text

      const item = findListItem(selectedList, payload.text)

      stateNew.selectedItem = selectedItem
      stateNew.selectedItemIndex = selectedList.items.indexOf(item)
      stateNew.initialItem = initialItem
      stateNew.listItemErrors = {}

      break
    }
  }

  if (!selectedItem || typeof initialItem === 'undefined') {
    return stateNew
  }

  switch (name) {
    case ListActions.EDIT_LIST_ITEM_TEXT:
      selectedItem.text = payload
      break

    case ListActions.EDIT_LIST_ITEM_DESCRIPTION:
      selectedItem.description = payload
      break

    case ListActions.EDIT_LIST_ITEM_VALUE:
      selectedItem.value = payload
      break

    case ListActions.EDIT_LIST_ITEM_CONDITION:
      selectedItem.condition = payload
      break
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
    const selectedList = findList(data, selectedListName)

    init = {
      ...init,
      selectedList,
      initialName: selectedList.name,
      initialTitle: selectedList.title
    }
  }

  const [state, dispatch] = useReducer(listReducer, init)

  return (
    <ListContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ListContext.Provider>
  )
}
