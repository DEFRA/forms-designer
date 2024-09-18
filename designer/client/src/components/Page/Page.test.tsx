import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, waitFor } from '@testing-library/react'
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
      components: [
        {
          name: 'phone',
          title: 'Mobile phone number',
          type: ComponentType.TelephoneNumberField,
          options: {
            required: true
          }
        }
      ]
    }
  ],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

describe('Page', () => {
  test('Page edit can be shown/hidden successfully', async () => {
    render(
      <RenderWithContext data={data}>
        <Page page={data.pages[0]} />
      </RenderWithContext>
    )

    const $buttonEdit = screen.getByRole('button', {
      name: 'Edit page',
      description: 'my first page'
    })

    // Open edit page
    await userEvent.click($buttonEdit)
    await waitFor(() =>
      screen.findByRole('dialog', {
        name: 'Edit page'
      })
    )

    const $buttonSave = screen.getByRole('button', {
      name: 'Save'
    })

    // Save edit page
    await userEvent.click($buttonSave)

    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument()

    // Open edit page
    await userEvent.click($buttonEdit)
    await waitFor(() =>
      screen.findByRole('dialog', {
        name: 'Edit page'
      })
    )

    const $close = screen.getByRole('button', {
      name: 'Close'
    })

    // Close edit page
    await userEvent.click($close)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('Add component can be shown/hidden successfully', async () => {
    render(
      <RenderWithContext data={data}>
        <Page page={data.pages[0]} />
      </RenderWithContext>
    )

    const $buttonAdd = screen.getByRole('button', {
      name: 'Add component'
    })

    await userEvent.click($buttonAdd)

    const $close = screen.getByRole('button', {
      name: 'Close'
    })

    await userEvent.click($close)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('Page actions are available', () => {
    render(
      <RenderWithContext data={data}>
        <Page page={data.pages[0]} />
      </RenderWithContext>
    )

    const $heading = screen.getByRole('heading', {
      name: 'my first page'
    })

    expect($heading).toBeInTheDocument()

    const $buttonEdit = screen.getByRole('button', {
      name: 'Edit page',
      description: $heading.innerText
    })

    const $linkPreview = screen.getByRole('link', {
      name: 'Preview page',
      description: $heading.innerText
    })

    const $buttonAdd = screen.getByRole('button', {
      name: 'Add component',
      description: $heading.innerText
    })

    expect($buttonEdit).toBeInTheDocument()
    expect($linkPreview).toBeInTheDocument()
    expect($buttonAdd).toBeInTheDocument()
  })

  test('Component actions are available', () => {
    render(
      <RenderWithContext data={data}>
        <Page page={data.pages[0]} />
      </RenderWithContext>
    )

    const $heading = screen.getByRole('heading', {
      name: 'my first page'
    })

    expect($heading).toBeInTheDocument()

    for (const { title, label, description } of [
      {
        title: 'First name',
        label: 'Text input',
        description: $heading.innerText
      },
      {
        title: 'Middle name',
        label: 'Text input',
        description: $heading.innerText
      },
      {
        title: 'Surname',
        label: 'Text input',
        description: $heading.innerText
      }
    ]) {
      const $component = screen.getByRole('button', {
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
  })

  test('Component up/down not available for single component', () => {
    render(
      <RenderWithContext data={data}>
        <Page page={data.pages[1]} />
      </RenderWithContext>
    )

    const $heading = screen.getByRole('heading', {
      name: 'my second page'
    })

    expect($heading).toBeInTheDocument()

    for (const { title, label, description } of [
      {
        title: 'Mobile phone number',
        label: 'Telephone number',
        description: $heading.innerText
      }
    ]) {
      const $component = screen.getByRole('button', {
        name: `Edit ${lowerFirst(label)} component: ${title}`,
        description
      })

      const $buttonMoveUp = screen.queryByRole('button', {
        name: `Move ${lowerFirst(label)} component up: ${title}`,
        description
      })

      const $buttonMoveDown = screen.queryByRole('button', {
        name: `Move ${lowerFirst(label)} component down: ${title}`,
        description
      })

      expect($component).toBeInTheDocument()
      expect($buttonMoveUp).not.toBeInTheDocument()
      expect($buttonMoveDown).not.toBeInTheDocument()
    }
  })
})
