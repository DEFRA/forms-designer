import { Menu } from '~/src/components/Menu/index.js'
import { screen } from '@testing-library/dom'
import { userEvent } from '@testing-library/user-event'
import {
  act,
  cleanup,
  render,
  type RenderResult,
  waitFor
} from '@testing-library/react'
import { DataContext, FlyoutContext } from '~/src/context/index.js'
import React from 'react'

describe('Menu', () => {
  const { getByText, getByTestId, queryByTestId } = screen

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

    expect(getByText('Form details')).toBeInTheDocument()
    expect(getByText('Add page')).toBeInTheDocument()
    expect(getByText('Add link')).toBeInTheDocument()
    expect(getByText('Sections')).toBeInTheDocument()
    expect(getByText('Conditions')).toBeInTheDocument()
    expect(getByText('Lists')).toBeInTheDocument()
    expect(getByText('Outputs')).toBeInTheDocument()
    expect(getByText('Fees')).toBeInTheDocument()
    expect(getByText('Summary behaviour')).toBeInTheDocument()
    expect(getByText('Summary')).toBeInTheDocument()
  })

  it('Can open flyouts and close them', async () => {
    customRender(<Menu />)
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()

    await act(() => userEvent.click(getByText('Form details')))
    expect(queryByTestId('flyout-1')).toBeInTheDocument()

    await act(() => userEvent.click(getByText('Close')))
    expect(queryByTestId('flyout-1')).not.toBeInTheDocument()
  })

  it('clicking on a summary tab shows different tab content', async () => {
    customRender(<Menu />)

    await act(() => userEvent.click(getByTestId('menu-summary')))
    expect(getByTestId('flyout-1')).toBeInTheDocument()
    expect(queryByTestId('tab-json')).not.toBeInTheDocument()
    expect(queryByTestId('tab-summary')).not.toBeInTheDocument()

    await act(() => userEvent.click(getByTestId('tab-json-button')))
    expect(getByTestId('tab-json')).toBeInTheDocument()
    expect(queryByTestId('tab-summary')).not.toBeInTheDocument()
    expect(queryByTestId('tab-model')).not.toBeInTheDocument()
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
