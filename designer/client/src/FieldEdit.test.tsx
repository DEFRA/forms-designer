import React, { useReducer } from 'react'
import { FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import { DataContext } from './context'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from './reducers/component/componentReducer'
import { FieldEdit } from './field-edit'

describe('Field Edit', () => {
  const { getByText } = screen

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
            options: {
              required: true
            },
            type: 'List'
          }
        ]
      }
    ]
  }

  const dataValue = { data, save: jest.fn() }

  const TestComponentContextProvider = ({
    children,
    dataValue,
    componentValue
  }) => {
    const initComponentValue = (initialState: any) => {
      return componentValue || initialState
    }
    const [state, dispatch] = useReducer(
      componentReducer,
      initComponentState({ component: dataValue.data.pages[0].components[0] }),
      initComponentValue
    )
    return (
      <DataContext.Provider value={dataValue}>
        <ComponentContext.Provider value={{ state, dispatch }}>
          {children}
        </ComponentContext.Provider>
      </DataContext.Provider>
    )
  }

  afterEach(cleanup)

  test('Help text changes', () => {
    const { container } = render(
      <TestComponentContextProvider
        dataValue={dataValue}
        componentValue={false}
      >
        <FieldEdit />
      </TestComponentContextProvider>
    )

    expect(container).toHaveTextContent('Enter the name to show for this field')

    expect(container).toHaveTextContent(
      'Enter the description to show for this field'
    )

    expect(container).toHaveTextContent(
      'Tick this box if you do not want the title to show on the page'
    )

    expect(container).toHaveTextContent(
      'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
    )

    expect(
      getByText(
        'Tick this box if users do not need to complete this field to progress through the form'
      )
    ).toBeInTheDocument()
  })

  test('Content fields should not have optional checkbox', () => {
    const { container } = render(
      <TestComponentContextProvider
        dataValue={dataValue}
        componentValue={false}
      >
        <FieldEdit isContentField={true} />
      </TestComponentContextProvider>
    )
    expect(container).toHaveTextContent('Enter the name to show for this field')

    expect(container).toHaveTextContent(
      'Enter the description to show for this field'
    )

    expect(container).toHaveTextContent(
      'Tick this box if you do not want the title to show on the page'
    )

    expect(container).toHaveTextContent(
      'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
    )

    expect(container).not.toHaveTextContent(
      'Tick this box if users do not need to complete this field to progress through the form'
    )
  })
})
