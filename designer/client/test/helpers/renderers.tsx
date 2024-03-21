import React, { useReducer } from 'react'

import { DataContext } from '~/src/context/index.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from '~/src/reducers/component/componentReducer.jsx'

export function RenderWithContext({ children, stateProps = {} }) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState({
      ...stateProps
    })
  )
  return (
    <ComponentContext.Provider value={{ state, dispatch }}>
      {children}
    </ComponentContext.Provider>
  )
}

export function RenderWithContextAndDataContext({
  children,
  stateProps = {},
  mockData = {},
  mockSave = jest.fn()
}) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState({
      ...stateProps
    })
  )

  return (
    <DataContext.Provider value={{ data: mockData, save: mockSave }}>
      <ComponentContext.Provider value={{ state, dispatch }}>
        {children}
      </ComponentContext.Provider>
    </DataContext.Provider>
  )
}
