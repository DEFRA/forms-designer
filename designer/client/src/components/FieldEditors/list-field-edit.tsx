import React from 'react'

import ListsEdit from '../../list/ListsEdit'
import { ListsEditorContextProvider } from '../../reducers/list/listsEditorReducer'
import { ListContextProvider } from '../../reducers/listReducer'
import ComponentListSelect from '../ComponentListSelect/ComponentListSelect'
import { RenderInPortal } from '../RenderInPortal'

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
