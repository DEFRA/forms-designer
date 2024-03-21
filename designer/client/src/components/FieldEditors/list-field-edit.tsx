import React from 'react'

import ComponentListSelect from '~/src/components/ComponentListSelect/ComponentListSelect.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/index.js'
import ListsEdit from '~/src/list/ListsEdit.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'

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
