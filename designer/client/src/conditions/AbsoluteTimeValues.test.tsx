import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { AbsoluteTimeValues } from '~/src/conditions/AbsoluteTimeValues.jsx'

describe('AbsoluteTimeValues', () => {
  afterEach(cleanup)

  const { findByLabelText } = screen

  it("renders out a time that's passed to it", async () => {
    render(
      <AbsoluteTimeValues
        updateValue={jest.fn()}
        value={{ hour: 0, minute: 34 }}
      />
    )

    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    expect($hours.getAttribute('value')).toBe('0')
    expect($minutes.getAttribute('value')).toBe('34')
  })

  it('calls the updateValue prop if a valid time is entered', async () => {
    const updateValue = jest.fn()
    render(<AbsoluteTimeValues updateValue={updateValue} value={{}} />)
    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    await act(() => userEvent.type($hours, '14'))
    await act(() => userEvent.type($minutes, '20'))

    await waitFor(() =>
      expect(updateValue).toHaveBeenCalledWith({
        hour: 14,
        minute: 20
      })
    )
  })

  it('calls the updateValue prop if an existing valid time is edited', async () => {
    const updateValue = jest.fn()
    render(
      <AbsoluteTimeValues
        updateValue={updateValue}
        value={{ hour: 10, minute: 12 }}
      />
    )

    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    // Clear existing values
    await Promise.all([$hours, $minutes].map(userEvent.clear))

    await act(() => userEvent.type($hours, '14'))
    await act(() => userEvent.type($minutes, '20'))

    await waitFor(() =>
      expect(updateValue).toHaveBeenCalledWith({
        hour: 14,
        minute: 20
      })
    )
  })

  it("doesn't call the updateValue prop if a minutes value is not entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteTimeValues updateValue={updateValue} value={{}} />)
    const $hours = await waitFor(() => findByLabelText('HH'))
    await act(() => userEvent.type($hours, '3'))
    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if an hours value is not entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteTimeValues updateValue={updateValue} value={{}} />)
    const $minutes = await waitFor(() => findByLabelText('mm'))
    await act(() => userEvent.type($minutes, '20'))
    expect(updateValue).not.toHaveBeenCalled()
  })
})
