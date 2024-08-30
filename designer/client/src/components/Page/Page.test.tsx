import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import lowerFirst from 'lodash/lowerFirst.js'
import React from 'react'

import { Page } from '~/src/components/Page/Page.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

const data = {
  pages: [
    {
      title: 'my first page',
      path: '/1',
      next: [{ path: '/2' }],
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
      path: '/2',
      next: [],
      components: []
    }
  ],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

describe('Page', () => {
  afterEach(cleanup)

  test('Page edit can be shown/hidden successfully', async () => {
    render(
      <RenderWithContext data={data}>
        <Page
          page={data.pages[0]}
          previewUrl={'https://localhost:3009'}
          slug={'aa'}
        />
      </RenderWithContext>
    )

    const $buttonEdit = screen.getByRole('button', {
      name: 'Edit page',
      description: 'my first page'
    })

    // Open edit page
    await act(() => userEvent.click($buttonEdit))
    await waitFor(() => screen.findByTestId('flyout-1'))

    const $buttonSave = screen.getByRole('button', {
      name: 'Save'
    })

    // Save edit page
    await act(() => userEvent.click($buttonSave))

    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument()

    // Open edit page
    await act(() => userEvent.click($buttonEdit))
    await waitFor(() => screen.findByTestId('flyout-1'))

    const $buttonClose = screen.getByRole('button', {
      name: 'Close'
    })

    // Close edit page
    await act(() => userEvent.click($buttonClose))
    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
  })

  test('Add component can be shown/hidden successfully', async () => {
    render(
      <RenderWithContext data={data}>
        <Page
          page={data.pages[0]}
          previewUrl={'https://localhost:3009'}
          slug={'aa'}
        />
      </RenderWithContext>
    )

    const $buttonAdd = screen.getByRole('button', {
      name: 'Add component'
    })

    await act(() => userEvent.click($buttonAdd))

    const $buttonClose = screen.getByRole('button', {
      name: 'Close'
    })

    await act(() => userEvent.click($buttonClose))
    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
  })

  test('Visualisation page actions contain expected call to actions', () => {
    render(
      <RenderWithContext data={data}>
        <Page
          page={data.pages[0]}
          previewUrl={'https://localhost:3009'}
          slug={'aa'}
        />
      </RenderWithContext>
    )

    const $heading = screen.queryByRole('heading', {
      name: 'my first page'
    })

    expect($heading).toBeInTheDocument()

    for (const { title, label, description } of [
      {
        title: 'First name',
        label: 'Text input',
        description: $heading?.innerText
      },
      {
        title: 'Middle name',
        label: 'Text input',
        description: $heading?.innerText
      },
      {
        title: 'Surname',
        label: 'Text input',
        description: $heading?.innerText
      }
    ]) {
      const $component = screen.queryByRole('button', {
        name: `Edit ${lowerFirst(label)} component: ${title}`,
        description
      })

      const $buttonMoveUp = screen.getByRole('button', {
        name: `Move ${lowerFirst(label)} component up: ${title}`,
        description
      })

      const $buttonMoveDown = screen.getByRole('button', {
        name: `Move ${lowerFirst(label)} component down: ${title}`,
        description
      })

      expect($component).toBeInTheDocument()
      expect($buttonMoveUp).toBeInTheDocument()
      expect($buttonMoveDown).toBeInTheDocument()
    }

    const $buttonEdit = screen.queryByRole('button', {
      name: 'Edit page',
      description: $heading?.innerText
    })

    const $linkPreview = screen.queryByRole('link', {
      name: 'Preview page',
      description: $heading?.innerText
    })

    const $buttonAdd = screen.queryByRole('button', {
      name: 'Add component',
      description: $heading?.innerText
    })

    expect($buttonEdit).toBeInTheDocument()
    expect($linkPreview).toBeInTheDocument()
    expect($buttonAdd).toBeInTheDocument()
  })
})
