import { screen } from '@testing-library/dom'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { AbsoluteDateTimeValues } from './AbsoluteDateTimeValues'

describe('AbsoluteDateTimeValues', () => {
  afterEach(cleanup)

  const { findByLabelText } = screen

  it("renders out a date that's passed to it", async () => {
    const d = new Date('2020-01-31T12:10:35Z')
    render(<AbsoluteDateTimeValues updateValue={jest.fn()} value={d} />)

    const $year = await waitFor(() => findByLabelText('Year'))
    const $month = await waitFor(() => findByLabelText('Month'))
    const $day = await waitFor(() => findByLabelText('Day'))

    expect($year?.getAttribute('value')).toEqual('2020')
    expect($month?.getAttribute('value')).toEqual('01')
    expect($day?.getAttribute('value')).toEqual('31')
  })

  it("renders out a time that's passed to it", async () => {
    const d = new Date('2020-01-31T12:10:35Z')
    render(<AbsoluteDateTimeValues updateValue={jest.fn()} value={d} />)

    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    expect($hours?.getAttribute('value')).toEqual('12')
    expect($minutes?.getAttribute('value')).toEqual('10')
  })

  it('calls the updateValue prop if a valid date and time are entered', async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateTimeValues updateValue={updateValue} />)

    const $year = await waitFor(() => findByLabelText('Year'))
    const $month = await waitFor(() => findByLabelText('Month'))
    const $day = await waitFor(() => findByLabelText('Day'))
    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '26'))
    await act(() => userEvent.type($hours, '10'))
    await act(() => userEvent.type($minutes, '57'))

    const d = updateValue.mock.calls.pop()[0]
    expect(d.toISOString()).toEqual('2020-04-26T10:57:00.000Z')
  })

  it('calls the updateValue prop if an existing valid date and time are edited', async () => {
    const updateValue = jest.fn()
    const d = new Date('2020-01-31T12:10:35Z')
    render(<AbsoluteDateTimeValues updateValue={updateValue} value={d} />)

    const $year = await waitFor(() => findByLabelText('Year'))
    const $month = await waitFor(() => findByLabelText('Month'))
    const $day = await waitFor(() => findByLabelText('Day'))
    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    // Clear existing values
    await Promise.all(
      [$year, $month, $day, $hours, $minutes].map(userEvent.clear)
    )

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '26'))
    await act(() => userEvent.type($hours, '10'))
    await act(() => userEvent.type($minutes, '57'))

    const newDate = updateValue.mock.calls.pop()[0]
    expect(newDate.toISOString()).toEqual('2020-04-26T10:57:00.000Z')
  })

  it("doesn't call the updateValue prop if a valid date and time are not entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateTimeValues updateValue={updateValue} />)

    const $year = await waitFor(() => findByLabelText('Year'))
    const $month = await waitFor(() => findByLabelText('Month'))
    const $day = await waitFor(() => findByLabelText('Day'))
    const $hours = await waitFor(() => findByLabelText('HH'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '26'))
    await act(() => userEvent.type($hours, '40'))

    expect(updateValue).not.toHaveBeenCalled()
  })

  it('allows a zero value for hours', async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateTimeValues updateValue={updateValue} />)

    const $year = await waitFor(() => findByLabelText('Year'))
    const $month = await waitFor(() => findByLabelText('Month'))
    const $day = await waitFor(() => findByLabelText('Day'))
    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '26'))
    await act(() => userEvent.type($hours, '0'))
    await act(() => userEvent.type($minutes, '57'))

    const d = updateValue.mock.calls.pop()[0]
    expect(d.toISOString()).toEqual('2020-04-26T00:57:00.000Z')
  })

  it('allows a zero value for minutes', async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateTimeValues updateValue={updateValue} />)

    const $year = await waitFor(() => findByLabelText('Year'))
    const $month = await waitFor(() => findByLabelText('Month'))
    const $day = await waitFor(() => findByLabelText('Day'))
    const $hours = await waitFor(() => findByLabelText('HH'))
    const $minutes = await waitFor(() => findByLabelText('mm'))

    await act(() => userEvent.type($year, '2020'))
    await act(() => userEvent.type($month, '4'))
    await act(() => userEvent.type($day, '26'))
    await act(() => userEvent.type($hours, '14'))
    await act(() => userEvent.type($minutes, '0'))

    const d = updateValue.mock.calls.pop()[0]
    expect(d.toISOString()).toEqual('2020-04-26T14:00:00.000Z')
  })
})
