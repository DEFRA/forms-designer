import { type FormDefinition } from '@defra/forms-model'
import { afterEach, describe, expect, jest, test } from '@jest/globals'
import { screen } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { useReducer } from 'react'

import { ComponentListSelect } from '~/src/components/ComponentListSelect/ComponentListSelect.jsx'
import { DataContext } from '~/src/context/index.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from '~/src/reducers/component/componentReducer.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'

describe('ComponentListSelect', () => {
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
            type: 'RadiosField',
            list: 'myList'
          }
        ]
      }
    ],
    lists: [
      {
        name: 'myList',
        title: 'My list',
        type: 'number',
        items: [{ text: 'An item', description: 'A hint', value: '12' }]
      },
      {
        name: 'myOtherList',
        title: '',
        type: 'string',
        items: [{ text: 'An item', description: 'A hint', value: '12' }]
      }
    ],
    sections: [],
    conditions: [],
    outputs: []
  }

  const dataValue = { data, save: jest.fn() }

  interface IContextProvider {
    children?: any
    dataValue: any
    componentValue: any
    errors?: any
  }

  const TestComponentContextProvider = ({
    children,
    dataValue,
    componentValue,
    errors
  }: IContextProvider) => {
    const initComponentValue = (initialState: any) => {
      return componentValue || initialState
    }
    const [state, dispatch] = useReducer(
      componentReducer,
      initComponentState({ component: dataValue.data.pages[0].components[0] }),
      initComponentValue
    )
    if (errors) state.errors = errors
    return (
      <DataContext.Provider value={dataValue}>
        <ListsEditorContextProvider>
          <ComponentContext.Provider value={{ state, dispatch }}>
            <ListContextProvider>{children}</ListContextProvider>
          </ComponentContext.Provider>
        </ListsEditorContextProvider>
      </DataContext.Provider>
    )
  }

  afterEach(cleanup)

  test('Lists all available lists', () => {
    // - when
    const { container } = render(
      <TestComponentContextProvider
        dataValue={dataValue}
        componentValue={false}
      >
        <ComponentListSelect />
      </TestComponentContextProvider>
    )

    const options = container.querySelectorAll('option')

    // - then
    expect(options).toHaveLength(3)

    const optionProps = [
      { value: 'myList', text: 'My list' },
      { value: 'myOtherList', text: '' }
    ]

    optionProps.forEach((optionProp, index) => {
      expect(options[index + 1]).toHaveValue(optionProp.value)
      expect(options[index + 1]).toHaveTextContent(optionProp.text)
    })
  })

  test('Selecting a different list changes the edit link', async () => {
    // - when
    const { container } = render(
      <TestComponentContextProvider
        dataValue={dataValue}
        componentValue={false}
      >
        <ComponentListSelect />
      </TestComponentContextProvider>
    )

    const select = container.querySelector('select')!
    await act(() => userEvent.selectOptions(select, 'myList'))

    // - then
    expect(getByText('Edit My list')).toBeInTheDocument()
  })

  test('should render strings correctly', () => {
    render(
      <TestComponentContextProvider
        dataValue={dataValue}
        componentValue={false}
      >
        <ComponentListSelect />
      </TestComponentContextProvider>
    )

    const title = 'Select list'
    const help =
      'Select an existing list to show in this field or add a new list'
    const addNew = 'Add a new list'
    expect(getByText(title)).toBeInTheDocument()
    expect(getByText(help)).toBeInTheDocument()
    expect(getByText(addNew)).toBeInTheDocument()
  })

  test('should display list error when state has errors', async () => {
    // - when
    const errors = { list: 'Select a list' }
    const { container } = render(
      <TestComponentContextProvider
        dataValue={dataValue}
        componentValue={false}
        errors={errors}
      >
        <ComponentListSelect />
      </TestComponentContextProvider>
    )

    const select = container.querySelector('select')!
    await act(() => userEvent.selectOptions(select, 'Select a list'))

    // - then
    expect(
      container.getElementsByClassName('govuk-form-group--error')
    ).toHaveLength(1)
  })
})
