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

  const { name, payload } = action
  let { initialName, initialTitle, initialItem, selectedList, selectedItem } =
    stateNew

  if (name === ListActions.ADD_NEW_LIST) {
    const listId = randomId()

    selectedList = {
      title: '',
      name: listId,
      type: 'string',
      items: [],
      isNew: true
    }

    initialName = selectedList.name
    initialTitle = selectedList.title

    stateNew.selectedList = selectedList
    stateNew.initialName = initialName
    stateNew.initialTitle = initialTitle
    stateNew.errors = {}
  }

  if (name === ListActions.SET_SELECTED_LIST) {
    selectedList = payload
    initialName = payload.name
    initialTitle = payload.title

    stateNew.selectedList = selectedList
    stateNew.initialName = initialName
    stateNew.initialTitle = initialTitle
    stateNew.errors = {}
  }

  if (name === ListActions.LIST_VALIDATION_ERRORS) {
    stateNew.errors = payload
  }

  if (name === ListActions.SUBMIT) {
    stateNew.errors = {}
  }

  if (!selectedList || typeof initialTitle === 'undefined') {
    return stateNew
  }

  if (name === ListActions.EDIT_TITLE) {
    selectedList.title = payload
  }

  if (name === ListActions.ADD_LIST_ITEM) {
    selectedItem = {
      text: '',
      value: '',
      isNew: true
    }

    initialItem = selectedItem.text

    stateNew.selectedItem = selectedItem
    stateNew.initialItem = initialItem
    stateNew.listItemErrors = {}
  }

  if (name === ListActions.EDIT_LIST_ITEM) {
    selectedItem = payload
    initialItem = payload.text

    const index = selectedList.items.findIndex(
      (item) => item.text === initialItem
    )

    stateNew.selectedItem = selectedItem
    stateNew.selectedItemIndex = index > -1 ? index : undefined
    stateNew.initialItem = initialItem
    stateNew.listItemErrors = {}
  }

  if (!selectedItem || typeof initialItem === 'undefined') {
    return stateNew
  }

  if (name === ListActions.LIST_ITEM_VALIDATION_ERRORS) {
    stateNew.listItemErrors = payload
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
