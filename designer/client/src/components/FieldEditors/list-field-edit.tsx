import React from 'react'

import ListsEdit from '~/src/list/ListsEdit.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/index.js'
import ComponentListSelect from '~/src/components/ComponentListSelect/ComponentListSelect.jsx'

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
