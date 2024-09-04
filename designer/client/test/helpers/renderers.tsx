import React, { useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import { FlyoutContext } from '~/src/context/FlyoutContext.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from '~/src/reducers/component/componentReducer.jsx'

export interface RenderWithContextProps extends Partial<DataContextType> {
  children?: ReactElement
  state?: Parameters<typeof initComponentState>[0]
}

export function RenderWithContext(props: RenderWithContextProps) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(props.state)
  )

  const {
    children,
    data = {} as DataContextType['data'],
    meta = {
      id: 'example-id',
      slug: 'example-slug',
      title: 'Example title'
    } as DataContextType['meta'],
    previewUrl = 'http://localhost:3000',
    save = jest.fn()
  } = props

  return (
    <DataContext.Provider value={{ data, meta, previewUrl, save }}>
      <FlyoutContext.Provider
        value={{
          count: 1,
          increment: jest.fn(),
          decrement: jest.fn()
        }}
      >
        <ComponentContext.Provider value={{ state, dispatch }}>
          {children}
        </ComponentContext.Provider>
      </FlyoutContext.Provider>
    </DataContext.Provider>
  )
}
