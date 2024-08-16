import React, { useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from '~/src/reducers/component/componentReducer.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'

export interface RenderListEditorWithContextProps {
  children: ReactElement
  selectedListName?: string
  data: DataContextType['data']
  meta?: DataContextType['meta']
  save?: DataContextType['save']
  state?: Parameters<typeof initComponentState>[0]
}

export function RenderListEditorWithContext(
  props: RenderListEditorWithContextProps
) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(props.state)
  )

  const {
    children,
    selectedListName,
    data = {} as DataContextType['data'],
    meta,
    save = jest.fn()
  } = props

  return (
    <DataContext.Provider value={{ data, meta, save }}>
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
