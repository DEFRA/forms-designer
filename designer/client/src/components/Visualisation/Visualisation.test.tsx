import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { Visualisation } from '~/src/components/Visualisation/Visualisation.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Visualisation', () => {
  afterEach(cleanup)

  const { findByText, getByText, queryByText, queryByTestId } = screen

  test('Graph is rendered with correct number of pages and updates', async () => {
    const data: FormDefinition = {
      pages: [
        {
          title: 'my first page',
          path: '/1'
        },
        { title: 'my second page', path: '/2' }
      ],
      lists: [],
      sections: [],
      conditions: []
    }

    render(
      <RenderWithContext data={data}>
        <Visualisation previewUrl={'http://localhost:3000'} slug={'aa'} />
      </RenderWithContext>
    )

    expect(queryByText('my first page')).toBeInTheDocument()
    expect(queryByText('my second page')).toBeInTheDocument()
    expect(queryByText('my third page')).not.toBeInTheDocument()

    const updated: FormDefinition = {
      ...data,
      pages: [
        ...data.pages,
        {
          title: 'my third page',
          path: '/3'
        }
      ]
    }

    render(
      <RenderWithContext data={updated}>
        <Visualisation previewUrl={'http://localhost:3000'} slug={'aa'} />
      </RenderWithContext>
    )

    expect(queryByText('my third page')).toBeInTheDocument()
  })

  test('Links between pages are navigable via keyboard', async () => {
    const data: FormDefinition = {
      pages: [
        {
          title: 'link source',
          path: '/link-source',
          next: [{ path: '/link-target' }]
        },
        {
          title: 'link target',
          path: '/link-target'
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    }

    render(
      <RenderWithContext data={data}>
        <Visualisation previewUrl={'http://localhost:3000'} slug={'aa'} />
      </RenderWithContext>
    )

    // Check link exists and has the expected label
    const $lineTitle = await waitFor(() =>
      findByText('Edit link from link-source to link-target')
    )

    // Check that link works when selected with the enter key
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()

    await act(async () => {
      $lineTitle.parentElement?.focus()
      await userEvent.keyboard('[Enter]')
    })

    expect(queryByTestId('flyout-1')).toBeInTheDocument()

    await act(() => userEvent.click(getByText('Close')))

    // Check that link works when selected with the space key
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()

    await act(async () => {
      $lineTitle.parentElement?.focus()
      await userEvent.keyboard('[Space]')
    })

    expect(queryByTestId('flyout-1')).toBeInTheDocument()
  })
})
