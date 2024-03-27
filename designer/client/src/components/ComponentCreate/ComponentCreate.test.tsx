import React from 'react'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { ComponentCreate } from './ComponentCreate'
import { ComponentContextProvider } from '../../reducers/component'
import { DataContext } from '../../context'
import { DetailsComponent, FormDefinition } from '@defra/forms-model'
import * as Data from '../../data'
import { addComponent } from '../../data'

describe('ComponentCreate:', () => {
  const {
    findByLabelText,
    getByText,
    queryByLabelText,
    queryByRole,
    queryByTestId,
    queryByText
  } = screen

  const data: FormDefinition = {
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

  afterEach(cleanup)

  test('Selecting a component type should display the component edit form', async () => {
    // - when
    render(
      <WrappingComponent componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )

    expect(queryByLabelText('Title')).not.toBeInTheDocument()
    await act(() => userEvent.click(getByText('Details')))

    // - then
    const $input = await waitFor(() => findByLabelText('Title'))
    expect($input).toBeInTheDocument()
  })

  test('Should store the populated component and call callback on submit', async () => {
    // - when
    const spy = jest.fn()
    const { container } = render(
      <WrappingComponent dataValue={{ data, save: spy }} componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )

    await act(() => userEvent.click(getByText('Details')))

    const $input = await waitFor(() => findByLabelText('Title'))
    const $textarea = container.querySelector('#field-content')!
    const $button = container.querySelector('button')!

    await act(() => userEvent.type($input, 'Details'))
    await act(() => userEvent.type($textarea, 'content'))
    await act(() => userEvent.click($button))

    // - then
    await waitFor(() => expect(spy).toHaveBeenCalled())
    const newDetailsComp = spy.mock.calls[0][0].pages[0]
      .components?.[0] as DetailsComponent

    expect(newDetailsComp.type).toBe('Details')
    expect(newDetailsComp.title).toBe('Details')
    expect(newDetailsComp.content).toBe('content')
  })

  test("Should have functioning 'Back to create component list' link", async () => {
    // - when
    render(
      <WrappingComponent componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )
    const backBtnTxt: string = 'Back to create component list'

    expect(queryByTestId('component-create-list')).toBeInTheDocument()

    await act(() => userEvent.click(queryByText('Details')!))

    // - then
    expect(queryByTestId('component-create-list')).not.toBeInTheDocument()
    expect(queryByText(backBtnTxt)).toBeInTheDocument()

    await act(() => userEvent.click(queryByText(backBtnTxt)!))

    expect(queryByTestId('component-create-list')).toBeInTheDocument()
    expect(queryByText(backBtnTxt)).not.toBeInTheDocument()
  })

  test('Should display ErrorSummary when validation fails', async () => {
    // - when
    const { container } = render(
      <WrappingComponent componentValue={false}>
        <ComponentCreate page={page} />
      </WrappingComponent>
    )

    expect(queryByRole('alert')).not.toBeInTheDocument()

    await act(() => userEvent.click(getByText('Details')!))
    await waitFor(() => findByLabelText('Title'))
    await act(() => userEvent.click(container.querySelector('button')!))

    // - then
    expect(queryByRole('alert')).toBeInTheDocument()
  })
})
