import React from 'react'
import { screen, within } from '@testing-library/dom'
import { act, cleanup, render, type RenderResult } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import LinkCreate from './link-create'
import { DataContext } from './context'

const data = {
  pages: [
    { path: '/1', title: 'Page 1', next: [{ path: '/2' }] },
    { path: '/2', title: 'Page 2' }
  ],
  conditions: [
    { name: 'someCondition', displayName: 'My condition' },
    { name: 'anotherCondition', displayName: 'Another condition' }
  ]
}

const dataValue = { data, save: jest.fn() }

function customRender(
  element: React.JSX.Element,
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
