import React, { useMemo, useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from '~/src/reducers/component/componentReducer.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'
import { definition, metadata } from '~/test/helpers/renderers.jsx'

export interface RenderListEditorWithContextProps
  extends Partial<DataContextType> {
  children: ReactElement
  selectedListName?: string
  selectedItemText?: string
  state?: Parameters<typeof initComponentState>[0]
}

export function RenderListEditorWithContext(
  props: Readonly<RenderListEditorWithContextProps>
) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(props.state)
  )

  const context = useMemo(() => {
    const {
      data = definition,
      meta = metadata,
      previewUrl = 'http://localhost:3000',
      save = jest.fn()
    } = props

    return { data, meta, previewUrl, save }
  }, [props])

  const { children, selectedListName, selectedItemText } = props

  return (
    <DataContext.Provider value={context}>
      <ListsEditorContextProvider>
        <ComponentContext.Provider
          value={useMemo(() => ({ state, dispatch }), [state])}
        >
          <ListContextProvider
            selectedListName={selectedListName}
            selectedItemText={selectedItemText}
          >
            {children}
          </ListContextProvider>
        </ComponentContext.Provider>
      </ListsEditorContextProvider>
    </DataContext.Provider>
  )
}
