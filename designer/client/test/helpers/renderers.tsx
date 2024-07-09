import React, { useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import { FlyoutContext } from '~/src/context/FlyoutContext.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState,
  type ComponentContextType
} from '~/src/reducers/component/componentReducer.jsx'

export interface RenderWithContextProps {
  children?: ReactElement
  state?: Omit<ComponentContextType['state'], 'initialName'>
  data?: DataContextType['data']
  meta?: DataContextType['meta']
  save?: DataContextType['save']
}

export function RenderWithContext(props: RenderWithContextProps) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(props.state)
  )

  const {
    children,
    data = {} as DataContextType['data'],
    meta,
    save = jest.fn()
  } = props

  return (
    <DataContext.Provider value={{ data, meta, save }}>
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
