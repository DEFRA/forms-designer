import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { ComponentCreate } from '~/src/components/ComponentCreate/ComponentCreate.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ComponentCreate:', () => {
  const data = {
    pages: [{ path: '/1', title: '', controller: '', section: '' }],
    lists: [],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  const page = data.pages[0]

  afterEach(cleanup)

  test('Selecting a component type should display the component edit form', async () => {
    render(
      <RenderWithContext data={data}>
        <ComponentCreate page={page} />
      </RenderWithContext>
    )

    const $componentLink = await screen.findByRole('link', {
      name: 'Details'
    })

    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Content')).not.toBeInTheDocument()

    await act(() => userEvent.click($componentLink))

    const $input = await waitFor(() => screen.getByLabelText('Title'))
    const $textarea = await waitFor(() => screen.getByLabelText('Content'))

    expect($input).toBeInTheDocument()
    expect($textarea).toBeInTheDocument()
  })

  test('Should store the populated component and call callback on submit', async () => {
    const save = jest.fn()

    render(
      <RenderWithContext data={data} save={save}>
        <ComponentCreate page={page} />
      </RenderWithContext>
    )

    const $componentLink = await screen.findByRole('link', {
      name: 'Details'
    })

    await act(() => userEvent.click($componentLink))
    await waitFor(() => screen.getByTestId('component-create'))

    const $input = await waitFor(() => screen.getByLabelText('Title'))
    const $textarea = await waitFor(() => screen.getByLabelText('Content'))
    const $button = await waitFor(() => screen.getByRole('button'))

    // Ensure fields are empty
    await act(() => userEvent.clear($input))
    await act(() => userEvent.clear($textarea))

    // Populate fields
    await act(() => userEvent.type($input, 'Details'))
    await act(() => userEvent.type($textarea, 'content'))

    // Submit the form
    await act(() => userEvent.click($button))

    await waitFor(() => expect(save).toHaveBeenCalled())

    expect(save.mock.calls[0]).toEqual(
      expect.arrayContaining([
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
                  options: {},
                  schema: {}
                }
              ]
            })
          ]
        }
      ])
    )
  })

  test("Should have functioning 'Back to create component list' link", async () => {
    render(
      <RenderWithContext data={data}>
        <ComponentCreate page={page} />
      </RenderWithContext>
    )

    const $componentLink = await screen.findByRole('link', {
      name: 'Details'
    })

    // Clicking into component will hide the list
    await act(() => userEvent.click($componentLink))
    expect(
      screen.queryByTestId('component-create-list')
    ).not.toBeInTheDocument()

    const $backLink = await screen.findByRole('link', {
      name: 'Back to create component list'
    })

    // Clicking the back link component will show the list
    await act(() => userEvent.click($backLink))
    expect(screen.queryByTestId('component-create-list')).toBeInTheDocument()
  })

  test('Should display error summary when validation fails', async () => {
    render(
      <RenderWithContext data={data}>
        <ComponentCreate page={page} />
      </RenderWithContext>
    )

    const $componentLink = await screen.findByRole('link', {
      name: 'Details'
    })

    await act(() => userEvent.click($componentLink))

    const $input = await waitFor(() => screen.getByLabelText('Title'))
    const $textarea = await waitFor(() => screen.getByLabelText('Content'))
    const $button = await waitFor(() => screen.getByRole('button'))

    // Ensure fields are empty
    await act(() => userEvent.clear($input))
    await act(() => userEvent.clear($textarea))

    // Submit the form
    await act(() => userEvent.click($button))

    const $errorSummary = await screen.findByRole('alert', {
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
