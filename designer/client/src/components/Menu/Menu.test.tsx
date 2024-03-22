import { Menu } from '.'
import { render, fireEvent, type RenderResult } from '@testing-library/react'
import { DataContext, FlyoutContext } from '../../context'
import React from 'react'

describe('Menu', () => {
  const dataValue = { data: {}, save: jest.fn() }
  const flyoutValue = {
    increment: jest.fn(),
    decrement: jest.fn(),
    count: 1
  }

  function customRender(children: React.JSX.Element): RenderResult {
    return render(
      <DataContext.Provider value={dataValue}>
        <FlyoutContext.Provider value={flyoutValue}>
          {children}
        </FlyoutContext.Provider>
        <div id="portal-root" />
      </DataContext.Provider>
    )
  }

  it('Renders button strings correctly', () => {
    const { getByText } = customRender(<Menu />)

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
    const { getByText, queryByTestId } = customRender(<Menu />)
    expect(queryByTestId('flyout-1')).toBeNull()
    await fireEvent.click(getByText('Form details'))
    expect(queryByTestId('flyout-1')).toBeInTheDocument()
    await fireEvent.click(getByText('Close'))
    expect(queryByTestId('flyout-1')).toBeNull()
  })

  it('clicking on a summary tab shows different tab content', async () => {
    const { getByTestId, queryByTestId } = customRender(<Menu />)
    await fireEvent.click(getByTestId('menu-summary'))
    expect(getByTestId('flyout-1')).toBeInTheDocument()
    expect(queryByTestId('tab-json')).toBeNull()
    expect(queryByTestId('tab-summary')).toBeNull()
    await fireEvent.click(getByTestId('tab-json-button'))
    expect(getByTestId('tab-json')).toBeInTheDocument()
    expect(queryByTestId('tab-summary')).toBeNull()
    expect(queryByTestId('tab-model')).toBeNull()
  })

  it('flyouts close on Save', async () => {
    const { getByText, queryByTestId } = customRender(<Menu />)

    await fireEvent.click(getByText('Summary behaviour'))
    expect(queryByTestId('flyout-1')).toBeInTheDocument()

    await fireEvent.click(getByText('Save'))
    expect(dataValue.save).toHaveBeenCalledTimes(1)
    expect(queryByTestId('flyout-1')).toBeNull()
  })
})
