import { type FormDefinition } from '@defra/forms-model'
import { render } from '@testing-library/react'
import React from 'react'

import { DataContext } from '../../context'
import { ComponentContext } from '../../reducers/component/componentReducer'

import { ParaEdit } from './para-edit'

describe('ParaEdit', () => {
  function TestComponentWithContext({ children }) {
    const data: FormDefinition = {
      pages: [
        {
          title: 'First page',
          path: '/first-page',
          components: [
            {
              name: 'IDDQl4',
              title: 'abc',
              schema: {},
              options: {},
              type: 'Para'
            }
          ]
        }
      ],
      conditions: []
    }
    const dataValue = { data, save: jest.fn() }
    const compContextValue = {
      state: { selectedComponent: {} },
      dispatch: jest.fn()
    }
    return (
      <DataContext.Provider value={dataValue}>
        <ComponentContext.Provider value={compContextValue}>
          {children}
        </ComponentContext.Provider>
      </DataContext.Provider>
    )
  }

  it('Should render with correct screen text', () => {
    const { container } = render(
      <TestComponentWithContext>
        <ParaEdit context={ComponentContext}></ParaEdit>
      </TestComponentWithContext>
    )
    expect(container).toHaveTextContent(
      'Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks.'
    )

    expect(container).toHaveTextContent(
      'Select a condition that determines whether to show the contents of this component. You can create and edit conditions from the Conditions screen.'
    )
  })
})
