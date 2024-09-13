import React, { type ReactElement } from 'react'

import { type DataContextType } from '~/src/context/DataContext.js'
import { type initComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

export interface RenderListEditorWithContextProps
  extends Partial<DataContextType> {
  children: ReactElement
  selectedListName?: string
  selectedItemText?: string
  state?: Parameters<typeof initComponentState>[0]
}

export function RenderListEditorWithContext({
  children,
  selectedListName,
  selectedItemText,
  ...props
}: Readonly<RenderListEditorWithContextProps>) {
  return (
    <RenderWithContext {...props}>
      <ListsEditorContextProvider>
        <ListContextProvider
          selectedListName={selectedListName}
          selectedItemText={selectedItemText}
        >
          {children}
        </ListContextProvider>
      </ListsEditorContextProvider>
    </RenderWithContext>
  )
}
