import React, { type ReactNode } from 'react'

import { ComponentListSelect } from '~/src/components/ComponentListSelect/ComponentListSelect.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { ListsEdit } from '~/src/list/ListsEdit.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'

interface Props {
  children: ReactNode
}

export function ListFieldEdit({ children }: Props) {
  return (
    <ListsEditorContextProvider>
      <ListContextProvider>
        <ComponentListSelect />
        {children}
        <RenderInPortal>
          <ListsEdit showEditLists={true} />
        </RenderInPortal>
      </ListContextProvider>
    </ListsEditorContextProvider>
  )
}
