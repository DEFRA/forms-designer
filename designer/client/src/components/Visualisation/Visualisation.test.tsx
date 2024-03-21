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
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'

import { Visualisation } from '~/src/components/Visualisation/index.js'
import { DataContext } from '~/src/context/index.js'

const history = createMemoryHistory()
history.push('')

function customRender(element: React.JSX.Element, providerProps): RenderResult {
  const rendered = render(
    <Router history={history}>
      <DataContext.Provider value={providerProps}>
        {element}
      </DataContext.Provider>
    </Router>
  )

  return {
    ...rendered,
    rerender(this: typeof providerProps, element) {
      customRender(element, this)
    }
  }
}

describe('Visualisation', () => {
  afterEach(cleanup)

  const { findAllByText, findByText, getByText, queryByText, queryByTestId } =
    screen

  test('Graph is rendered with correct number of pages and updates ', async () => {
    const data: FormDefinition = {
      pages: [
        {
          title: 'my first page',
          path: '/1'
        },
        { title: 'my second page', path: '/2' }
      ]
    }
    const providerProps = {
      data,
      save: jest.fn()
    }

    const { rerender } = customRender(
      <Visualisation previewUrl={'http://localhost:3000'} id={'aa'} />,
      providerProps
    )

    await waitFor(() =>
      expect(findAllByText('my first page')).resolves.toHaveLength(2)
    )

    await waitFor(() =>
      expect(findAllByText('my second page')).resolves.toHaveLength(2)
    )

    const thirdPage = queryByText('my third page')
    expect(thirdPage).not.toBeInTheDocument()

    const newPage = {
      title: 'my third page',
      path: '/3'
    }

    await rerender.call(
      {
        data: { ...data, pages: [...data.pages, newPage] },
        save: jest.fn()
      },
      <Visualisation previewUrl={'http://localhost:3000'} id={'aa'} />
    )

    await waitFor(() =>
      expect(findAllByText('my third page')).resolves.toHaveLength(2)
    )
  })

  test('Links between pages are navigable via keyboard', async () => {
    const data: FormDefinition = {
      pages: [
        {
          title: 'link source',
          path: '/link-source',
          next: [{ path: '/link-target' }]
        },
        { title: 'link target', path: '/link-target' }
      ],
      conditions: []
    }
    const providerProps = {
      data,
      save: jest.fn()
    }

    customRender(
      <Visualisation previewUrl={'http://localhost:3000'} id={'aa'} />,
      providerProps
    )

    // Check link exists and has the expected label
    const $lineTitle = await waitFor(() =>
      findByText('Edit link from link-source to link-target')
    )

    // Check that link works when selected with the enter key
    expect(queryByTestId('flyout-0')).not.toBeInTheDocument()

    await act(async () => {
      $lineTitle.parentElement!.focus()
      await userEvent.keyboard('[Enter]')
    })

    expect(queryByTestId('flyout-0')).toBeInTheDocument()

    await act(() => userEvent.click(getByText('Close')))

    // Check that link works when selected with the space key
    expect(queryByTestId('flyout-0')).not.toBeInTheDocument()

    await act(async () => {
      $lineTitle.parentElement!.focus()
      await userEvent.keyboard('[Space]')
    })

    expect(queryByTestId('flyout-0')).toBeInTheDocument()
  })
})
