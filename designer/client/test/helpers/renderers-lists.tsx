import React, { useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState,
  type ComponentContextType
} from '~/src/reducers/component/componentReducer.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'

export interface RenderListEditorWithContextProps {
  children: ReactElement
  selectedListName?: string
  data: DataContextType['data']
  save?: DataContextType['save']
  state?: ComponentContextType['state']
}

export function RenderListEditorWithContext({
  children,
  selectedListName,
  state: componentState,
  data,
  save = jest.fn()
}: RenderListEditorWithContextProps) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(componentState),
    initComponentState
  )

  return (
    <DataContext.Provider value={{ data, save }}>
      <ListsEditorContextProvider>
        <ComponentContext.Provider value={{ state, dispatch }}>
          <ListContextProvider selectedListName={selectedListName}>
            {children}
          </ListContextProvider>
        </ComponentContext.Provider>
      </ListsEditorContextProvider>
    </DataContext.Provider>
  )
}
