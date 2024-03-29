import { FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import {
  act,
  cleanup,
  render,
  type RenderResult,
  waitFor
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DataContext } from '../../context'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Page } from '.'
const history = createMemoryHistory()
history.push('')

function customRender(element: React.JSX.Element, providerProps): RenderResult {
  return render(
    <Router history={history}>
      <DataContext.Provider value={providerProps}>
        {element}
      </DataContext.Provider>
    </Router>
  )
}

const data: FormDefinition = {
  pages: [
    {
      title: 'my first page',
      path: '/1',
      components: [
        {
          type: 'TextField',
          name: 'firstName',
          title: 'First name',
          options: {
            required: true
          },
          schema: {}
        },
        {
          options: {
            required: false,
            optionalText: false
          },
          type: 'TextField',
          name: 'middleName',
          title: 'Middle name',
          hint: 'If you have a middle name on your passport you must include it here',
          schema: {}
        },
        {
          type: 'TextField',
          name: 'lastName',
          title: 'Surname',
          options: {
            required: true
          },
          schema: {}
        }
      ]
    },
    { title: 'my second page', path: '/2' }
  ],
  sections: []
}

const providerProps = {
  data,
  save: jest.fn()
}

describe('Page', () => {
  afterEach(cleanup)

  const { findByTestId, getByText, queryByTestId } = screen

  test('PageEdit can be shown/hidden successfully', async () => {
    customRender(
      <Page
        page={data.pages[0]}
        previewUrl={'https://localhost:3009'}
        id={'aa'}
        layout={{}}
      />,
      providerProps
    )

    await act(() => userEvent.click(getByText('Edit page')))
    await waitFor(() => findByTestId('page-edit'))

    await act(() => userEvent.click(getByText('Save')))
    expect(queryByTestId('page-edit')).not.toBeInTheDocument()

    await act(() => userEvent.click(getByText('Edit page')))
    await waitFor(() => findByTestId('flyout-0'))

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-0')).not.toBeInTheDocument()
  })

  test('AddComponent can be shown/hidden successfully', async () => {
    customRender(
      <Page
        page={data.pages[0]}
        previewUrl={'https://localhost:3009'}
        id={'aa'}
        layout={{}}
      />,
      providerProps
    )

    await act(() => userEvent.click(getByText('Create component')))
    await waitFor(() => findByTestId('component-create'))

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-0')).not.toBeInTheDocument()
  })

  test('Page actions contain expected call to actions', () => {
    customRender(
      <Page
        page={data.pages[0]}
        previewUrl={'https://localhost:3009'}
        id={'aa'}
        layout={{}}
      />,
      providerProps
    )

    expect(getByText('Edit page')).toBeTruthy()
    expect(getByText('Create component')).toBeTruthy()
    expect(getByText('Preview')).toBeTruthy()
  })

  test('Dragging component order saves successfully', async () => {
    customRender(
      <Page
        page={data.pages[0]}
        previewUrl={'https://localhost:3009'}
        id={'aa'}
        layout={{}}
      />,
      providerProps
    )

    await act(() => userEvent.click(getByText('Create component')))
    await waitFor(() => findByTestId('component-create'))

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-0')).not.toBeInTheDocument()
  })
})
