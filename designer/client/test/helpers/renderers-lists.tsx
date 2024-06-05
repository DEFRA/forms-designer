import { render, type RenderResult } from '@testing-library/react'
import React, { type ReactElement } from 'react'

import { DataContext, FlyoutContext } from '~/src/context/index.js'
import {
  initListsEditingState,
  ListsEditorContext
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

const defaultFlyoutValue = {
  increment: jest.fn(),
  decrement: jest.fn(),
  count: 0
}
const defaultDataValue = { data: {}, save: jest.fn() }
const defaultListsValue = {
  state: initListsEditingState(),
  dispatch: jest.fn()
}
const defaultListValue = { state: {}, dispatch: jest.fn() }

export function customRenderForLists(
  element: ReactElement,
  {
    dataValue = defaultDataValue,
    flyoutValue = defaultFlyoutValue,
    listsValue = defaultListsValue,
    listValue = defaultListValue,
    ...renderOptions
  }
): RenderResult {
  const rendered = render(
    <DataContext.Provider value={dataValue}>
      <FlyoutContext.Provider value={flyoutValue}>
        <ListsEditorContext.Provider value={listsValue}>
          <ListContext.Provider value={listValue}>
            {element}
          </ListContext.Provider>
        </ListsEditorContext.Provider>
      </FlyoutContext.Provider>
      <div id="portal-root" />
    </DataContext.Provider>,
    renderOptions
  )
  return {
    ...rendered,
    rerender(this: Parameters<typeof customRenderForLists>[1], element) {
      customRenderForLists(element, this)
    }
  }
}
