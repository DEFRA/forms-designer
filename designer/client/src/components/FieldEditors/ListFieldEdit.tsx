import { hasListField } from '@defra/forms-model'
import React, { useContext, type ReactNode } from 'react'

import { ComponentListSelect } from '~/src/components/ComponentListSelect/ComponentListSelect.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { ListsEdit } from '~/src/list/ListsEdit.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'

interface Props {
  children?: ReactNode
}

export function ListFieldEdit({ children }: Readonly<Props>) {
  const { state } = useContext(ComponentContext)

  const { selectedComponent } = state

  if (!hasListField(selectedComponent)) {
    return null
  }

  return (
    <ListsEditorContextProvider>
      <ListContextProvider selectedListName={selectedComponent.list}>
        <ComponentListSelect />
        {children}
        <RenderInPortal>
          <ListsEdit showEditLists={true} />
        </RenderInPortal>
      </ListContextProvider>
    </ListsEditorContextProvider>
  )
}
