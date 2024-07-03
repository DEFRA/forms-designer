import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { Menu } from '~/src/components/Menu/Menu.jsx'
import { RenderWithContext } from '~/test/helpers/renderers'

describe('Menu', () => {
  afterEach(cleanup)

  it('Renders button strings correctly', () => {
    render(
      <RenderWithContext>
        <Menu slug="example" />
      </RenderWithContext>
    )

    expect(screen.getByText('Add page')).toBeInTheDocument()
    expect(screen.getByText('Add link')).toBeInTheDocument()
    expect(screen.getByText('Sections')).toBeInTheDocument()
    expect(screen.getByText('Conditions')).toBeInTheDocument()
    expect(screen.getByText('Lists')).toBeInTheDocument()
    expect(screen.getByText('Summary behaviour')).toBeInTheDocument()
    expect(screen.getByText('Summary')).toBeInTheDocument()
  })

  it('Can open flyouts and close them', async () => {
    render(
      <RenderWithContext>
        <Menu slug="example" />
      </RenderWithContext>
    )

    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()

    await act(() => userEvent.click(screen.getByText('Summary behaviour')))
    expect(screen.queryByTestId('flyout-1')).toBeInTheDocument()

    await act(() => userEvent.click(screen.getByText('Close')))
    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
  })

  it('clicking on a summary tab shows different tab content', async () => {
    render(
      <RenderWithContext>
        <Menu slug="example" />
      </RenderWithContext>
    )

    await act(() => userEvent.click(screen.getByText('Summary')))
    expect(screen.getByTestId('flyout-1')).toBeVisible()

    const $tabs = screen.queryAllByRole('tab')
    const $panels = screen.queryAllByRole('tabpanel')

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
    const save = jest.fn()

    render(
      <RenderWithContext save={save}>
        <Menu slug="example" />
      </RenderWithContext>
    )

    await act(() => userEvent.click(screen.getByText('Summary behaviour')))
    expect(screen.queryByTestId('flyout-1')).toBeInTheDocument()

    await act(() => userEvent.click(screen.getByText('Save')))
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1))

    expect(screen.queryByTestId('flyout-1')).not.toBeInTheDocument()
  })
})
