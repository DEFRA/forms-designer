import {
  randomId,
  type FormDefinition,
  type Item,
  type List
} from '@defra/forms-model'
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode
} from 'react'

import { type ErrorList } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findList, findListItem } from '~/src/data/list/findList.js'
import { ListActions } from '~/src/reducers/listActions.jsx'

export interface ListState extends Partial<FormList>, Partial<FormItem> {
  initialName?: string
  initialTitle?: string
  initialItemText?: string
  initialItemValue?: Item['value']
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
      name: ListActions.ADD_NEW_LIST | ListActions.ADD_LIST_ITEM
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
  state: {} as ListState,
  dispatch: () => ({})
})

/**
 * Allows mutation of the {@link List} from any component that is nested within {@link ListContextProvider}
 */
export function listReducer(state: ListState, action: ListReducerActions) {
  const stateNew = structuredClone(state)

  const { name, payload } = action
  let { initialItemText, initialItemValue, selectedList, selectedItem } =
    stateNew

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
      stateNew.errors = payload
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

      initialItemText = selectedItem.text
      initialItemValue = selectedItem.value

      stateNew.selectedItem = selectedItem
      stateNew.initialItemText = initialItemText
      stateNew.initialItemValue = initialItemValue
      stateNew.listItemErrors = {}

      break
    }

    case ListActions.EDIT_LIST_ITEM: {
      selectedItem = payload
      initialItemText = payload.text
      initialItemValue = payload.value

      const item = findListItem(selectedList, payload.text)

      stateNew.selectedItem = selectedItem
      stateNew.selectedItemIndex = selectedList.items.indexOf(item)
      stateNew.initialItemText = initialItemText
      stateNew.initialItemValue = initialItemValue
      stateNew.listItemErrors = {}

      break
    }
  }

  if (
    !selectedItem ||
    typeof initialItemText === 'undefined' ||
    typeof initialItemValue === 'undefined'
  ) {
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

export function initListState(
  this: FormDefinition,
  props?: Readonly<Partial<ListState>>
): ListState {
  const { initialName, initialItemText } = props ?? {}

  let init = {
    errors: {},
    listItemErrors: {},
    ...props
  }

  // Populate state with selected list
  if (initialName) {
    const selectedList = findList(this, initialName)

    init = {
      ...init,
      selectedList,
      initialName: selectedList.name,
      initialTitle: selectedList.title
    }
  }

  // Populate state with selected item
  if (init.selectedList && initialItemText) {
    const selectedItem = findListItem(init.selectedList, initialItemText)

    init = {
      ...init,
      selectedItem,
      initialItemText: selectedItem.text,
      initialItemValue: selectedItem.value
    }
  }

  return init
}

/**
 * Allows components to retrieve {@link ListState} and {@link Dispatch} from any component nested within `<ListContextProvider>`
 */
export const ListContextProvider = (
  props: Parameters<typeof initListState>[0] & {
    children: ReactNode
  }
) => {
  const { data } = useContext(DataContext)
  const { children, ...initialListState } = props

  const [state, dispatch] = useReducer(
    listReducer,
    initialListState,
    initListState.bind(data)
  )

  const context = useMemo(() => ({ state, dispatch }), [state])

  return <ListContext.Provider value={context}>{children}</ListContext.Provider>
}
