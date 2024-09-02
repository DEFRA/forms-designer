import React, { useMemo, useReducer, type ReactElement } from 'react'

import { DataContext, type DataContextType } from '~/src/context/DataContext.js'
import { FlyoutContext } from '~/src/context/FlyoutContext.js'
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
}

export function RenderWithContext(props: RenderWithContextProps) {
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

  const { children } = props

  return (
    <DataContext.Provider value={context}>
      <FlyoutContext.Provider
        value={useMemo(
          () => ({
            count: 1,
            increment: jest.fn(),
            decrement: jest.fn()
          }),
          []
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
