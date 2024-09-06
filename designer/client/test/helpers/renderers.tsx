import React, { useMemo, useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import {
  FlyoutContext,
  type FlyoutContextType
} from '~/src/context/FlyoutContext.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from '~/src/reducers/component/componentReducer.jsx'

// Dummy data used as default values
export const definition = {} as DataContextType['data']
export const metadata = {
  id: 'example-id',
  slug: 'example-slug',
  title: 'Example title'
} as DataContextType['meta']

export interface RenderWithContextProps extends Partial<DataContextType> {
  children?: ReactElement
  state?: Parameters<typeof initComponentState>[0]
  context?: Partial<{
    flyout: Partial<FlyoutContextType>
  }>
}

export function RenderWithContext(props: Readonly<RenderWithContextProps>) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(props.state)
  )

  const context = useMemo(() => {
    const {
      data = definition,
      meta = metadata,
      previewUrl = 'http://localhost:3000',
      save = jest.fn()
    } = props

    return { data, meta, previewUrl, save }
  }, [props])

  const { children, context: override } = props

  return (
    <DataContext.Provider value={context}>
      <FlyoutContext.Provider
        value={useMemo(
          () => ({
            count: 0,
            increment: jest.fn(),
            decrement: jest.fn(),
            ...override?.flyout
          }),
          [override?.flyout]
        )}
      >
        <ComponentContext.Provider
          value={useMemo(() => ({ state, dispatch }), [state])}
        >
          {children}
        </ComponentContext.Provider>
      </FlyoutContext.Provider>
    </DataContext.Provider>
  )
}
