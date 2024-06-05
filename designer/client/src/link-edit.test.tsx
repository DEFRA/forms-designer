import { type FormDefinition } from '@defra/forms-model'
import { screen, within } from '@testing-library/dom'
import { act, cleanup, render, type RenderResult } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { type ReactElement } from 'react'

import { DataContext } from '~/src/context/index.js'
import LinkCreate from '~/src/link-create.js'

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
  ],
  outputs: []
}

const dataValue = { data, save: jest.fn() }

function customRender(
  element: ReactElement,
  providerProps = dataValue
): RenderResult {
  return render(
    <DataContext.Provider value={providerProps}>
      {element}
      <div id="portal-root" />
    </DataContext.Provider>
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
