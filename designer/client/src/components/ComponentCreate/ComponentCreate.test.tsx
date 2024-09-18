import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { ComponentCreate } from '~/src/components/ComponentCreate/ComponentCreate.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ComponentCreate:', () => {
  const data = {
    pages: [
      {
        path: '/1',
        title: '',
        next: [],
        components: []
      }
    ],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  const page = data.pages[0]

  test('Selecting a component type should display the component edit form', async () => {
    render(
      <RenderWithContext data={data}>
        <ComponentCreate page={page} onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $componentLink = screen.getByRole('link', {
      name: 'Details'
    })

    expect(
      screen.queryByRole('textbox', { name: 'Title' })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('textbox', { name: 'Content' })
    ).not.toBeInTheDocument()

    await userEvent.click($componentLink)
    await waitFor(() => screen.getAllByRole('textbox'))

    const $input = screen.getByRole('textbox', { name: 'Title' })
    const $textarea = screen.getByRole('textbox', { name: 'Content' })

    expect($input).toBeInTheDocument()
    expect($textarea).toBeInTheDocument()
  })

  test('Should store the populated component and call callback on submit', async () => {
    const save = jest.fn()

    render(
      <RenderWithContext data={data} save={save}>
        <ComponentCreate page={page} onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $componentLink = screen.getByRole('link', {
      name: 'Details'
    })

    await userEvent.click($componentLink)
    await waitFor(() => screen.getAllByRole('textbox'))

    const $input = screen.getByRole('textbox', { name: 'Title' })
    const $textarea = screen.getByRole('textbox', { name: 'Content' })
    const $button = screen.getByRole('button', { name: 'Save' })

    // Ensure fields are empty
    await userEvent.clear($input)
    await userEvent.clear($textarea)

    // Populate fields
    await userEvent.type($input, 'Details')
    await userEvent.type($textarea, 'content')

    // Submit the form
    await userEvent.click($button)

    await waitFor(() => expect(save).toHaveBeenCalled())

    expect(save.mock.calls[0]).toEqual(
      expect.arrayContaining<FormDefinition>([
        {
          ...data,
          pages: [
            expect.objectContaining<Partial<FormDefinition['pages'][0]>>({
              components: [
                {
                  title: 'Details',
                  type: ComponentType.Details,
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

  test('Should show component list again when closing flyout', async () => {
    render(
      <RenderWithContext data={data}>
        <ComponentCreate page={page} onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $componentLink = screen.getByRole('link', {
      name: 'Details'
    })

    expect($componentLink).toBeInTheDocument()

    // Clicking component link opens a flyout
    await userEvent.click($componentLink)

    const $buttonClose = screen.getAllByRole('button', {
      name: 'Close'
    })[1]

    expect($buttonClose).toBeInTheDocument()

    // Clicking close shows the list again
    await userEvent.click($buttonClose)
  })

  test('Should display error summary when validation fails', async () => {
    render(
      <RenderWithContext data={data}>
        <ComponentCreate page={page} onSave={jest.fn()} />
      </RenderWithContext>
    )

    const $componentLink = screen.getByRole('link', {
      name: 'Details'
    })

    await userEvent.click($componentLink)
    await waitFor(() => screen.getAllByRole('textbox'))

    const $input = screen.getByRole('textbox', { name: 'Title' })
    const $textarea = screen.getByRole('textbox', { name: 'Content' })
    const $button = screen.getByRole('button', { name: 'Save' })

    // Ensure fields are empty
    await userEvent.clear($input)
    await userEvent.clear($textarea)

    // Submit the form
    await userEvent.click($button)

    const $errorSummary = screen.getByRole('alert', {
      name: 'There is a problem'
    })

    expect($errorSummary).toContainHTML(
      '<a href="#field-title">Enter title</a>'
    )

    expect($errorSummary).toContainHTML(
      '<a href="#field-content">Enter content</a>'
    )
  })
})
