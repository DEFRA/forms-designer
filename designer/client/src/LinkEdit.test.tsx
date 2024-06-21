import { type FormDefinition } from '@defra/forms-model'
import { screen, within } from '@testing-library/dom'
import { act, cleanup, render, type RenderResult } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { type ReactElement } from 'react'

import { LinkCreate } from '~/src/LinkCreate.jsx'
import { DataContext } from '~/src/context/DataContext.js'

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

const dataValue = { data, save: jest.fn() }

function customRender(
  element: ReactElement,
  providerProps = dataValue
): RenderResult {
  return render(
    <DataContext.Provider value={providerProps}>{element}</DataContext.Provider>
  )
}

afterEach(cleanup)

describe('LinkEdit', () => {
  const { getByRole } = screen

  test('Submitting with a condition updates the link', async () => {
    customRender(<LinkCreate />)

    await act(() => userEvent.click(getByRole('button')))
    const summary = within(getByRole('alert'))

    expect(summary.getByText('Enter from')).toBeInTheDocument()
    expect(summary.getByText('Enter to')).toBeInTheDocument()
  })
})
