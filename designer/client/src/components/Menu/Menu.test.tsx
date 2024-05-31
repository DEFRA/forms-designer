import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { screen } from '@testing-library/dom'
import {
  act,
  cleanup,
  render,
  type RenderResult,
  waitFor
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { Menu } from '~/src/components/Menu/index.js'
import { DataContext, FlyoutContext } from '~/src/context/index.js'

describe('Menu', () => {
  const { getByText, getByTestId, queryByTestId, queryAllByRole } = screen

  const dataValue = {
    data: {},
    save: jest.fn()
  }

  const flyoutValue = {
    increment: jest.fn(),
    decrement: jest.fn(),
    count: 1
  }

  function customRender(
    children: React.JSX.Element,
    providerProps = dataValue
  ): RenderResult {
    return render(
      <DataContext.Provider value={providerProps}>
        <FlyoutContext.Provider value={flyoutValue}>
          {children}
        </FlyoutContext.Provider>
        <div id="portal-root" />
      </DataContext.Provider>
    )
  }

  afterEach(cleanup)

  it('Renders button strings correctly', () => {
    customRender(<Menu />)

    expect(getByText('Add page')).toBeInTheDocument()
    expect(getByText('Add link')).toBeInTheDocument()
    expect(getByText('Sections')).toBeInTheDocument()
    expect(getByText('Conditions')).toBeInTheDocument()
    expect(getByText('Lists')).toBeInTheDocument()
    expect(getByText('Outputs')).toBeInTheDocument()
    expect(getByText('Summary behaviour')).toBeInTheDocument()
    expect(getByText('Summary')).toBeInTheDocument()
  })

  it('Can open flyouts and close them', async () => {
    customRender(<Menu />)
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()

    await act(() => userEvent.click(getByText('Summary behaviour')))
    expect(queryByTestId('flyout-1')).toBeInTheDocument()

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()
  })

  it('clicking on a summary tab shows different tab content', async () => {
    customRender(<Menu />)

    await act(() => userEvent.click(getByText('Summary')))
    expect(getByTestId('flyout-1')).toBeVisible()

    const $tabs = queryAllByRole('tab')
    const $panels = queryAllByRole('tabpanel')

    // All tabs links are visible
    expect($tabs[0]).toBeVisible()
    expect($tabs[1]).toBeVisible()
    expect($tabs[2]).toBeVisible()

    // Only first tab panel (Data model) is visible
    expect($panels[0]).not.toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[1]).toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[2]).toHaveClass('govuk-tabs__panel--hidden')

    // Click JSON tab link
    await act(() => userEvent.click($tabs[1]))

    // Only second tab panel (JSON) is visible
    expect($panels[0]).toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[1]).not.toHaveClass('govuk-tabs__panel--hidden')
    expect($panels[2]).toHaveClass('govuk-tabs__panel--hidden')
  })

  it('flyouts close on Save', async () => {
    customRender(<Menu />)

    await act(() => userEvent.click(getByText('Summary behaviour')))
    expect(queryByTestId('flyout-1')).toBeInTheDocument()

    await act(() => userEvent.click(getByText('Save')))
    await waitFor(() => expect(dataValue.save).toHaveBeenCalledTimes(1))

    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()
  })
})
