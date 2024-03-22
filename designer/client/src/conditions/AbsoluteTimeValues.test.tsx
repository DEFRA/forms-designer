import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { AbsoluteTimeValues } from './AbsoluteTimeValues'

describe('AbsoluteTimeValues', () => {
  const { findByLabelText } = screen

  it("renders out a time that's passed to it", async () => {
    render(
      <AbsoluteTimeValues
        updateValue={jest.fn()}
        value={{ hour: 0, minute: 34 }}
      />
    )

    const $hours = await findByLabelText('HH')
    const $minutes = await findByLabelText('mm')

    expect($hours?.getAttribute('value')).toEqual('0')
    expect($minutes?.getAttribute('value')).toEqual('34')
  })

  it('calls the updateValue prop if a valid time is entered', async () => {
    const updateValue = jest.fn()
    render(<AbsoluteTimeValues updateValue={updateValue} value={{}} />)
    const $hours = await findByLabelText('HH')
    const $minutes = await findByLabelText('mm')

    await userEvent.type($hours, '14')
    await userEvent.type($minutes, '20')

    expect(updateValue).toHaveBeenCalledWith({ hour: 14, minute: 20 })
  })

  it('calls the updateValue prop if an existing valid time is edited', async () => {
    const updateValue = jest.fn()
    render(
      <AbsoluteTimeValues
        updateValue={updateValue}
        value={{ hour: 10, minute: 12 }}
      />
    )

    const $hours = await findByLabelText('HH')
    const $minutes = await findByLabelText('mm')

    // Clear existing values
    await Promise.all([$hours, $minutes].map(userEvent.clear))

    await userEvent.type($hours, '14')
    await userEvent.type($minutes, '20')

    expect(updateValue).toHaveBeenCalledWith({ hour: 14, minute: 20 })
  })

  it("doesn't call the updateValue prop if a minutes value is not entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteTimeValues updateValue={updateValue} value={{}} />)
    const $hours = await findByLabelText('HH')
    await userEvent.type($hours, '3')
    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if an hours value is not entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteTimeValues updateValue={updateValue} value={{}} />)
    const $minutes = await findByLabelText('mm')
    await userEvent.type($minutes, '20')
    expect(updateValue).not.toHaveBeenCalled()
  })
})
