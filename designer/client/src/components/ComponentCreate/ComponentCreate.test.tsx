import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { ComponentCreate } from './ComponentCreate'
import { ComponentContextProvider } from '../../reducers/component'
import { DataContext } from '../../context'
import { DetailsComponent } from '@defra/forms-model'
import * as Data from '../../data'
import { addComponent } from '../../data'

describe('ComponentCreate:', () => {
  const data = {
    pages: [{ path: '/1', title: '', controller: '', section: '' }],
    lists: [],
    sections: [],
    startPage: ''
  }

  const page = { path: '/1' }

  const WrappingComponent = ({
    dataValue = { data, save: jest.fn() },
    componentValue,
    children
  }) => {
    return (
      <DataContext.Provider value={dataValue}>
        <ComponentContextProvider {...componentValue}>
          {children}
        </ComponentContextProvider>
      </DataContext.Provider>
    )
  }

  test('Selecting a component type should display the component edit form', async () => {
    // - when
    const { getByText } = render(
      <WrappingComponent componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )

    expect(screen.queryByLabelText('Title')).toBeNull()
    await userEvent.click(getByText('Details'))

    // - then
    const editForm = await screen.findByLabelText('Title')
    expect(editForm).toBeInTheDocument()
  })

  test('Should store the populated component and call callback on submit', async () => {
    // - when
    const spy = jest.fn()
    const { container, getByText } = render(
      <WrappingComponent dataValue={{ data, save: spy }} componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )

    await userEvent.click(getByText('Details'))

    const titleInput = await screen.findByLabelText('Title')!
    const contentTextArea = container.querySelector('#field-content')!
    const saveBtn = container.querySelector('button')!

    await userEvent.type(titleInput, 'Details')
    await userEvent.type(contentTextArea, 'content')
    await userEvent.click(saveBtn)

    // - then
    const updatedData = spy.mock.calls[0][0]

    const newDetailsComp = updatedData.pages[0]
      .components?.[0] as DetailsComponent
    expect(newDetailsComp.type).toEqual('Details')
    expect(newDetailsComp.title).toEqual('Details')
    expect(newDetailsComp.content).toEqual('content')
  })

  test("Should have functioning 'Back to create component list' link", async () => {
    // - when
    const { queryByTestId, queryByText } = render(
      <WrappingComponent componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )
    const backBtnTxt: string = 'Back to create component list'

    expect(queryByTestId('component-create-list')).toBeInTheDocument()

    await userEvent.click(queryByText('Details')!)

    // - then
    expect(queryByTestId('component-create-list')).toBeNull()
    expect(queryByText(backBtnTxt)).toBeInTheDocument()

    await userEvent.click(queryByText(backBtnTxt)!)

    expect(queryByTestId('component-create-list')).toBeInTheDocument()
    expect(queryByText(backBtnTxt)).toBeNull()
  })

  test('Should display ErrorSummary when validation fails', async () => {
    // - when
    const { container, getByText, queryByRole } = render(
      <WrappingComponent componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )

    expect(queryByRole('alert')).toBeNull()

    await userEvent.click(getByText('Details')!)
    await screen.findByLabelText('Title')
    await userEvent.click(container.querySelector('button')!)

    // - then
    expect(queryByRole('alert')).toBeInTheDocument()
  })
})
