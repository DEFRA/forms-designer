import { screen } from '@testing-library/dom'
import { act, cleanup, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Flyout', () => {
  afterEach(cleanup)

  it('renders with accessible heading and close button', () => {
    render(
      <RenderWithContext>
        <Flyout title="Example" onHide={jest.fn()} />
      </RenderWithContext>
    )

    const $dialog = screen.queryByRole('dialog', { name: 'Example' })
    const $heading = screen.queryByRole('heading', { name: 'Example' })
    const $button = screen.queryByRole('button', { name: 'Close' })

    expect($dialog).toBeInTheDocument()
    expect($dialog).toContainElement($heading)
    expect($dialog).toContainElement($button)

    const headingId = 'flyout-1-heading'

    expect($dialog).toHaveAttribute('aria-labelledby', headingId)
    expect($heading).toHaveAttribute('id', headingId)
  })

  it('increments flyout counter when mounted', () => {
    const increment = jest.fn()
    const decrement = jest.fn()

    render(
      <RenderWithContext context={{ flyout: { increment, decrement } }}>
        <Flyout title="Example 1" onHide={jest.fn()} />
      </RenderWithContext>
    )

    expect(increment).toHaveBeenCalledTimes(1)
    expect(decrement).not.toHaveBeenCalled()
  })

  it('decrements flyout counter when unmounted', () => {
    const increment = jest.fn()
    const decrement = jest.fn()

    render(
      <RenderWithContext context={{ flyout: { increment, decrement } }}>
        <Flyout title="Example 1" onHide={jest.fn()} />
      </RenderWithContext>
    )

    cleanup()

    expect(increment).toHaveBeenCalledTimes(1)
    expect(decrement).toHaveBeenCalledTimes(1)
  })

  it('opens and closes as a modal dialog', async () => {
    render(
      <RenderWithContext>
        <Flyout title="Example" onHide={jest.fn()} />
      </RenderWithContext>
    )

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()

    const $button = screen.getByRole('button', { name: 'Close' })
    await act(() => userEvent.click($button))

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
  })

  it('renders first flyout without an offset', () => {
    render(
      <RenderWithContext>
        <Flyout title="Example 1" onHide={jest.fn()} />
      </RenderWithContext>
    )

    const $dialog = screen.getByRole('dialog', { name: 'Example 1' })

    expect(
      $dialog.querySelector<HTMLElement>('.flyout__container')
    ).toMatchObject({
      style: expect.objectContaining({
        paddingLeft: '0px',
        transform: 'translateX(0px)'
      })
    })
  })

  it('renders subsequent flyouts with an offset', () => {
    render(
      <RenderWithContext context={{ flyout: { count: 1 } }}>
        <Flyout title="Example 2" onHide={jest.fn()} />
      </RenderWithContext>
    )

    const $dialog = screen.getByRole('dialog', { name: 'Example 2' })

    expect(
      $dialog.querySelector<HTMLElement>('.flyout__container')
    ).toMatchObject({
      style: expect.objectContaining({
        paddingLeft: '50px',
        transform: 'translateX(-50px)'
      })
    })
  })
})