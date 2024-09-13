import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { AbsoluteDateValues } from '~/src/conditions/AbsoluteDateValues.jsx'

describe('AbsoluteDateValues', () => {
  afterEach(cleanup)

  it("renders out a date that's passed to it", async () => {
    render(
      <AbsoluteDateValues
        updateValue={jest.fn()}
        value={{ year: 1999, month: 12, day: 31 }}
      />
    )

    const $year = await waitFor(() => screen.findByLabelText('Year'))
    const $month = await waitFor(() => screen.findByLabelText('Month'))
    const $day = await waitFor(() => screen.findByLabelText('Day'))

    expect($year).toHaveValue(1999)
    expect($month).toHaveValue(12)
    expect($day).toHaveValue(31)
  })

  it('calls the updateValue prop if a valid date is entered', async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $year = await waitFor(() => screen.findByLabelText('Year'))
    const $month = await waitFor(() => screen.findByLabelText('Month'))
    const $day = await waitFor(() => screen.findByLabelText('Day'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '26'))

    await waitFor(() =>
      expect(updateValue).toHaveBeenCalledWith({
        year: 2020,
        month: 4,
        day: 26
      })
    )
  })

  it('calls the updateValue prop if an existing date is edited', async () => {
    const updateValue = jest.fn()
    render(
      <AbsoluteDateValues
        updateValue={updateValue}
        value={{ year: 1999, month: 12, day: 31 }}
      />
    )

    const $year = await waitFor(() => screen.findByLabelText('Year'))
    const $month = await waitFor(() => screen.findByLabelText('Month'))
    const $day = await waitFor(() => screen.findByLabelText('Day'))

    // Clear existing values
    await Promise.all([$year, $month, $day].map(userEvent.clear))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '26'))

    await waitFor(() =>
      expect(updateValue).toHaveBeenCalledWith({
        year: 2020,
        month: 4,
        day: 26
      })
    )
  })

  it("doesn't call the updateValue prop if an valid day is not entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $year = await waitFor(() => screen.findByLabelText('Year'))
    const $month = await waitFor(() => screen.findByLabelText('Month'))
    const $day = await waitFor(() => screen.findByLabelText('Day'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '0'))

    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if no day is entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $year = await waitFor(() => screen.findByLabelText('Year'))
    const $month = await waitFor(() => screen.findByLabelText('Month'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))

    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if no month is entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $year = await waitFor(() => screen.findByLabelText('Year'))
    const $day = await waitFor(() => screen.findByLabelText('Day'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($day, '7'))

    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if no year is entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $month = await waitFor(() => screen.findByLabelText('Month'))
    const $day = await waitFor(() => screen.findByLabelText('Day'))

    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '23'))

    expect(updateValue).not.toHaveBeenCalled()
  })
})
