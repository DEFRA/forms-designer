import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { Page } from '~/src/components/Page/Page.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

const data: FormDefinition = {
  pages: [
    {
      title: 'my first page',
      path: '/1',
      components: [
        {
          name: 'firstName',
          title: 'First name',
          type: ComponentType.TextField,
          options: {
            required: true
          },
          schema: {}
        },
        {
          name: 'middleName',
          title: 'Middle name',
          type: ComponentType.TextField,
          hint: 'If you have a middle name on your passport you must include it here',
          options: {
            required: false,
            optionalText: false
          },
          schema: {}
        },
        {
          name: 'lastName',
          title: 'Surname',
          type: ComponentType.TextField,
          options: {
            required: true
          },
          schema: {}
        }
      ]
    },
    {
      title: 'my second page',
      path: '/2'
    }
  ],
  lists: [],
  sections: [],
  conditions: []
}

describe('Page', () => {
  afterEach(cleanup)

  const { findByTestId, getByText, queryByTestId } = screen

  test('PageEdit can be shown/hidden successfully', async () => {
    render(
      <RenderWithContext data={data}>
        <Page
          page={data.pages[0]}
          previewUrl={'https://localhost:3009'}
          slug={'aa'}
        />
      </RenderWithContext>
    )

    await act(() => userEvent.click(getByText('Edit page')))
    await waitFor(() => findByTestId('page-edit'))

    await act(() => userEvent.click(getByText('Save')))
    expect(queryByTestId('page-edit')).not.toBeInTheDocument()

    await act(() => userEvent.click(getByText('Edit page')))
    await waitFor(() => findByTestId('flyout-1'))

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()
  })

  test('AddComponent can be shown/hidden successfully', async () => {
    render(
      <RenderWithContext data={data}>
        <Page
          page={data.pages[0]}
          previewUrl={'https://localhost:3009'}
          slug={'aa'}
        />
      </RenderWithContext>
    )

    await act(() => userEvent.click(getByText('Add component')))
    await waitFor(() => findByTestId('component-create'))

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()
  })

  test('Page actions contain expected call to actions', () => {
    render(
      <RenderWithContext data={data}>
        <Page
          page={data.pages[0]}
          previewUrl={'https://localhost:3009'}
          slug={'aa'}
        />
      </RenderWithContext>
    )

    expect(getByText('Edit page')).toBeTruthy()
    expect(getByText('Preview page')).toBeTruthy()
    expect(getByText('Add component')).toBeTruthy()
  })

  test('Dragging component order saves successfully', async () => {
    render(
      <RenderWithContext data={data}>
        <Page
          page={data.pages[0]}
          previewUrl={'https://localhost:3009'}
          slug={'aa'}
        />
      </RenderWithContext>
    )

    await act(() => userEvent.click(getByText('Add component')))
    await waitFor(() => findByTestId('component-create'))

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()
  })
})
