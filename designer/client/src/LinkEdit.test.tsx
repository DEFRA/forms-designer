import { type FormDefinition } from '@defra/forms-model'
import { screen, within } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { LinkCreate } from '~/src/LinkCreate.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('LinkEdit', () => {
  const data: FormDefinition = {
    pages: [
      { path: '/1', title: 'Page 1', next: [{ path: '/2' }] },
      { path: '/2', title: 'Page 2' }
    ],
    lists: [],
    sections: [],
    conditions: [
      {
        name: 'someCondition',
        displayName: 'My condition',
        value: 'true'
      },
      {
        name: 'anotherCondition',
        displayName: 'Another condition',
        value: 'true'
      }
    ]
  }

  afterEach(cleanup)

  const { getByRole } = screen

  test('Submitting with a condition updates the link', async () => {
    render(
      <RenderWithContext data={data}>
        <LinkCreate />
      </RenderWithContext>
    )

    await act(() => userEvent.click(getByRole('button')))
    const summary = within(getByRole('alert'))

    expect(summary.getByText('Enter from')).toBeInTheDocument()
    expect(summary.getByText('Enter to')).toBeInTheDocument()
  })
})
