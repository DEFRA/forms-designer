import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { Page } from '~/src/components/Page/Page.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

const data = {
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
} satisfies FormDefinition

describe('Page', () => {
  afterEach(cleanup)

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

    await act(() => userEvent.click(screen.getByText('Edit page')))
    await waitFor(() => screen.findByTestId('page-edit'))

    await act(() => userEvent.click(screen.getByText('Save')))
    expect(screen.queryByTestId('page-edit')).not.toBeInTheDocument()

    await act(() => userEvent.click(screen.getByText('Edit page')))
    await waitFor(() => screen.findByTestId('flyout-1'))

    await act(() => userEvent.click(screen.getByText('Close')))
    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
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

    await act(() => userEvent.click(screen.getByText('Add component')))
    await waitFor(() => screen.findByTestId('component-create'))

    await act(() => userEvent.click(screen.getByText('Close')))
    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
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

    expect(screen.getByText('Edit page')).toBeTruthy()
    expect(screen.getByText('Preview page')).toBeTruthy()
    expect(screen.getByText('Add component')).toBeTruthy()
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

    await act(() => userEvent.click(screen.getByText('Add component')))
    await waitFor(() => screen.findByTestId('component-create'))

    await act(() => userEvent.click(screen.getByText('Close')))
    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
  })
})
