import { type List } from '@defra/forms-model'
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

export interface ListState {
  selectedList?: any // TODO:- type
  selectedItem?: any // TODO:- type
  selectedItemIndex?: number
  isEditingFromComponent?: boolean
  selectedListItem?: any // TODO:- type
  initialName?: string
  initialTitle?: string
  errors?: Partial<ErrorList<'title' | 'listItems'>>
  listItemErrors?: Partial<ErrorList<'title' | 'value'>>
}

export interface ListContextType {
  state: ListState
  dispatch: Dispatch<Parameters<typeof listReducer>[1]>
}

export const ListContext = createContext<ListContextType>({
  state: {},
  dispatch: () => ({})
})

/**
 * Allows mutation of the {@link List} from any component that is nested within {@link ListContextProvider}
 */
export function listReducer(
  state: ListState = {},
  action: {
    type: ListActions
    payload?: unknown
  }
): ListState {
  const { type, payload } = action
  const { selectedList, selectedItem } = state

  switch (type) {
    case ListActions.ADD_NEW_LIST: {
      const listId = randomId()
      return {
        selectedList: {
          title: '',
          name: listId,
          type: 'string',
          items: [],
          isNew: true
        },
        initialName: listId
      }
    }

    case ListActions.SET_SELECTED_LIST:
      return {
        ...state,
        selectedList: payload,
        initialName: payload?.name || state.initialName,
        initialTitle: payload?.title
      }

    case ListActions.EDIT_TITLE:
      return { ...state, selectedList: { ...selectedList, title: payload } }

    case ListActions.ADD_LIST_ITEM:
      return { ...state, selectedItem: { isNew: true }, listItemErrors: {} }

    case ListActions.EDIT_LIST_ITEM: {
      let selectedItem, selectedItemIndex
      if (typeof payload === 'number') {
        selectedItem = selectedList?.items[payload]
      } else {
        selectedItem = payload
        selectedItemIndex = selectedList?.items.findIndex(
          (item) => item === payload
        )
      }
      return {
        ...state,
        selectedItem,
        selectedItemIndex,
        listItemErrors: {}
      }
    }

    case ListActions.EDIT_LIST_ITEM_TEXT:
      return {
        ...state,
        selectedItem: { ...selectedItem, text: payload }
      }

    case ListActions.EDIT_LIST_ITEM_DESCRIPTION: {
      return {
        ...state,
        selectedItem: { ...selectedItem, description: payload }
      }
    }

    case ListActions.EDIT_LIST_ITEM_VALUE: {
      return { ...state, selectedItem: { ...selectedItem, value: payload } }
    }

    case ListActions.EDIT_LIST_ITEM_CONDITION: {
      return {
        ...state,
        selectedItem: { ...selectedItem, condition: payload }
      }
    }

    case ListActions.LIST_ITEM_VALIDATION_ERRORS: {
      return {
        ...state,
        listItemErrors: payload
      }
    }

    case ListActions.LIST_VALIDATION_ERRORS: {
      return {
        ...state,
        errors: payload
      }
    }

    case ListActions.SUBMIT:
      return {
        ...state,
        errors: {}
      }
  }
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

  let init: ListState = {}

  if (selectedListName) {
    const selectedList = data.lists.find(
      ({ name }) => name === selectedListName
    )

    init = {
      selectedList,
      initialName: selectedListName,
      initialTitle: selectedList?.title,
      isEditingFromComponent: true
    }
  }

  const [state, dispatch] = useReducer(listReducer, { ...init })

  return (
    <ListContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ListContext.Provider>
  )
}
