import React from 'react'

import ListsEdit from '~/src/list/ListsEdit'
import { ListContextProvider } from '~/src/reducers/listReducer'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer'
import { RenderInPortal } from '~/src/components/RenderInPortal'
import ComponentListSelect from '~/src/components/ComponentListSelect/ComponentListSelect'

type Props = {
  children: any // TODO
  page: any // TODO
}

function ListFieldEdit({ children, page }: Props) {
  return (
    <ListsEditorContextProvider>
      <ListContextProvider>
        <ComponentListSelect />
        {children}
        <RenderInPortal>
          <ListsEdit showEditLists={true} page={page} />
        </RenderInPortal>
      </ListContextProvider>
    </ListsEditorContextProvider>
  )
}

export default ListFieldEdit
