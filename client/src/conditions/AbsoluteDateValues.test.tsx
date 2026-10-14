import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { AbsoluteDateValues } from '~/src/conditions/AbsoluteDateValues.jsx'

describe('AbsoluteDateValues', () => {
  it("renders out a date that's passed to it", () => {
    render(
      <AbsoluteDateValues
        updateValue={jest.fn()}
        value={{ year: 1999, month: 12, day: 31 }}
      />
    )

    const $day = screen.getByRole('spinbutton', { name: 'Day' })
    const $month = screen.getByRole('spinbutton', { name: 'Month' })
    const $year = screen.getByRole('spinbutton', { name: 'Year' })

    expect($year).toHaveValue(1999)
    expect($month).toHaveValue(12)
    expect($day).toHaveValue(31)
  })

  it('calls the updateValue prop if a valid date is entered', async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $day = screen.getByRole('spinbutton', { name: 'Day' })
    const $month = screen.getByRole('spinbutton', { name: 'Month' })
    const $year = screen.getByRole('spinbutton', { name: 'Year' })

    await userEvent.type($year, '2020')
    await userEvent.type($month, '4')
    await userEvent.type($day, '26')

    expect(updateValue).toHaveBeenCalledWith({
      year: 2020,
      month: 4,
      day: 26
    })
  })

  it('calls the updateValue prop if an existing date is edited', async () => {
    const updateValue = jest.fn()
    render(
      <AbsoluteDateValues
        updateValue={updateValue}
        value={{ year: 1999, month: 12, day: 31 }}
      />
    )

    const $day = screen.getByRole('spinbutton', { name: 'Day' })
    const $month = screen.getByRole('spinbutton', { name: 'Month' })
    const $year = screen.getByRole('spinbutton', { name: 'Year' })

    // Clear existing values
    await Promise.all([$year, $month, $day].map(userEvent.clear))

    await userEvent.type($year, '2020')
    await userEvent.type($month, '4')
    await userEvent.type($day, '26')

    expect(updateValue).toHaveBeenCalledWith({
      year: 2020,
      month: 4,
      day: 26
    })
  })

  it("doesn't call the updateValue prop if an valid day is not entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $day = screen.getByRole('spinbutton', { name: 'Day' })
    const $month = screen.getByRole('spinbutton', { name: 'Month' })
    const $year = screen.getByRole('spinbutton', { name: 'Year' })

    await userEvent.type($year, '2020')
    await userEvent.type($month, '4')
    await userEvent.type($day, '0')

    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if no day is entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $year = screen.getByRole('spinbutton', { name: 'Year' })
    const $month = screen.getByRole('spinbutton', { name: 'Month' })

    await userEvent.type($year, '2020')
    await userEvent.type($month, '4')

    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if no month is entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $day = screen.getByRole('spinbutton', { name: 'Day' })
    const $year = screen.getByRole('spinbutton', { name: 'Year' })

    await userEvent.type($year, '2020')
    await userEvent.type($day, '7')

    expect(updateValue).not.toHaveBeenCalled()
  })

  it("doesn't call the updateValue prop if no year is entered", async () => {
    const updateValue = jest.fn()
    render(<AbsoluteDateValues updateValue={updateValue} value={{}} />)

    const $month = screen.getByRole('spinbutton', { name: 'Month' })
    const $day = screen.getByRole('spinbutton', { name: 'Day' })

    await userEvent.type($month, '4')
    await userEvent.type($day, '23')

    expect(updateValue).not.toHaveBeenCalled()
  })
})
