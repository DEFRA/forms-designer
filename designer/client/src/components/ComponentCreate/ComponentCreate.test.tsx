import { type DetailsComponent, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import {
  act,
  cleanup,
  render,
  waitFor,
  type RenderResult
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { ComponentCreate } from '~/src/components/ComponentCreate/index.js'
import { DataContext } from '~/src/context/index.js'
import { ComponentContextProvider } from '~/src/reducers/component/index.js'

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
    conditions: [],
    outputs: []
  }

  const page = { path: '/1' }

  function customRender(
    element: JSX.Element,
    providerProps = { data, save: jest.fn() }
  ): RenderResult {
    return render(
      <DataContext.Provider value={providerProps}>
        <ComponentContextProvider>{element}</ComponentContextProvider>
      </DataContext.Provider>
    )
  }

  afterEach(cleanup)

  test('Selecting a component type should display the component edit form', async () => {
    customRender(<ComponentCreate page={page} />)

    expect(queryByLabelText('Title')).not.toBeInTheDocument()
    await act(() => userEvent.click(getByText('Details')))

    const $input = await waitFor(() => findByLabelText('Title'))
    expect($input).toBeInTheDocument()
  })

  test('Should store the populated component and call callback on submit', async () => {
    const providerProps = {
      data,
      save: jest.fn()
    }

    customRender(<ComponentCreate page={page} />, providerProps)

    await act(() => userEvent.click(getByText('Details')))

    const $input = await waitFor(() => findByLabelText('Title'))
    const $textarea = container.querySelector('#field-content')!
    const $button = container.querySelector('button')!

    await act(() => userEvent.type($input, 'Details'))
    await act(() => userEvent.type($textarea, 'content'))
    await act(() => userEvent.click($button))

    await waitFor(() => expect(providerProps.save).toHaveBeenCalled())
    const newDetailsComp = providerProps.save.mock.calls[0][0].pages[0]
      .components?.[0] as DetailsComponent

    expect(newDetailsComp.type).toBe('Details')
    expect(newDetailsComp.title).toBe('Details')
    expect(newDetailsComp.content).toBe('content')
  })

  test("Should have functioning 'Back to create component list' link", async () => {
    customRender(<ComponentCreate page={page} />)

    const backBtnTxt = 'Back to create component list'

    expect(queryByTestId('component-create-list')).toBeInTheDocument()

    await act(() => userEvent.click(queryByText('Details')))

    expect(queryByTestId('component-create-list')).not.toBeInTheDocument()
    expect(queryByText(backBtnTxt)).toBeInTheDocument()

    await act(() => userEvent.click(queryByText(backBtnTxt)))

    expect(queryByTestId('component-create-list')).toBeInTheDocument()
    expect(queryByText(backBtnTxt)).not.toBeInTheDocument()
  })

  test('Should display ErrorSummary when validation fails', async () => {
    customRender(<ComponentCreate page={page} />)
    )

    expect(queryByRole('alert')).not.toBeInTheDocument()

    await act(() => userEvent.click(getByText('Details')))
    await waitFor(() => findByLabelText('Title'))
    await act(() => userEvent.click(container.querySelector('button')))

    expect(queryByRole('alert')).toBeInTheDocument()
  })
})
