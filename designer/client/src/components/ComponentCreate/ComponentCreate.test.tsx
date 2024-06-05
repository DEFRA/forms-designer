import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import {
  act,
  cleanup,
  render,
  waitFor,
  type RenderResult
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { type ReactElement } from 'react'

import { ComponentCreate } from '~/src/components/ComponentCreate/index.js'
import { DataContext } from '~/src/context/index.js'
import { ComponentContextProvider } from '~/src/reducers/component/index.js'

describe('ComponentCreate:', () => {
  const {
    findByRole,
    getByLabelText,
    getByRole,
    getByTestId,
    queryByLabelText,
    queryByTestId
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
    element: ReactElement,
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

    const $componentLink = await findByRole('link', {
      name: 'Details'
    })

    expect(queryByLabelText('Title')).not.toBeInTheDocument()
    expect(queryByLabelText('Content')).not.toBeInTheDocument()

    await act(() => userEvent.click($componentLink))

    const $input = await waitFor(() => getByLabelText('Title'))
    const $textarea = await waitFor(() => getByLabelText('Content'))

    expect($input).toBeInTheDocument()
    expect($textarea).toBeInTheDocument()
  })

  test('Should store the populated component and call callback on submit', async () => {
    const providerProps = {
      data,
      save: jest.fn()
    }

    customRender(<ComponentCreate page={page} />, providerProps)

    const $componentLink = await findByRole('link', {
      name: 'Details'
    })

    await act(() => userEvent.click($componentLink))
    await waitFor(() => getByTestId('component-create'))

    const $input = await waitFor(() => getByLabelText('Title'))
    const $textarea = await waitFor(() => getByLabelText('Content'))
    const $button = await waitFor(() => getByRole('button'))

    await act(() => userEvent.type($input, 'Details'))
    await act(() => userEvent.type($textarea, 'content'))
    await act(() => userEvent.click($button))

    await waitFor(() => expect(providerProps.save).toHaveBeenCalled())

    expect(providerProps.save.mock.calls[0]).toEqual(
      expect.arrayContaining([
        {
          ...data,
          pages: [
            expect.objectContaining({
              components: [
                {
                  title: 'Details',
                  type: 'Details',
                  name: expect.any(String),
                  content: 'content',
                  options: {}
                }
              ]
            })
          ]
        }
      ])
    )
  })

  test("Should have functioning 'Back to create component list' link", async () => {
    customRender(<ComponentCreate page={page} />)

    const $componentLink = await findByRole('link', {
      name: 'Details'
    })

    // Clicking into component will hide the list
    await act(() => userEvent.click($componentLink))
    expect(queryByTestId('component-create-list')).not.toBeInTheDocument()

    const $backLink = await findByRole('link', {
      name: 'Back to create component list'
    })

    // Clicking the back link component will show the list
    await act(() => userEvent.click($backLink))
    expect(queryByTestId('component-create-list')).toBeInTheDocument()
  })

  test('Should display ErrorSummary when validation fails', async () => {
    customRender(<ComponentCreate page={page} />)

    const $componentLink = await findByRole('link', {
      name: 'Details'
    })

    await act(() => userEvent.click($componentLink))

    await waitFor(() => getByLabelText('Title'))
    await waitFor(() => getByLabelText('Content'))

    const $button = await findByRole('button', {
      name: 'Save'
    })

    await act(() => userEvent.click($button))

    const $errorSummary = await findByRole('alert', {
      name: 'There is a problem'
    })

    expect($errorSummary).toContainHTML(
      '<a href="#field-title">Enter Title</a>'
    )

    expect($errorSummary).toContainHTML(
      '<a href="#field-content">Enter Content</a>'
    )
  })
})
