import { type FormDefinition } from '@defra/forms-model'
import React, { useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import { FlyoutContext } from '~/src/context/FlyoutContext.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState,
  type ComponentState
} from '~/src/reducers/component/componentReducer.jsx'

export function RenderWithContext(props: {
  children?: ReactElement
  state?: ComponentState
  data?: DataContextType['data']
  save?: DataContextType['save']
}) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(props.state)
  )

  const { children, data = {} as FormDefinition, save = jest.fn() } = props

  return (
    <DataContext.Provider value={{ data, save }}>
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
