import { screen } from '@testing-library/dom'
import { act, render, cleanup, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { LandingChoice } from '~/src/pages/LandingPage/Choice'

describe('LandingChoice', () => {
  afterEach(cleanup)

  const { getByLabelText, getByTitle } = screen

  it('snapshot matches', () => {
    const push = jest.fn()
    const history = { push }
    const { asFragment } = render(<LandingChoice history={history} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it("should push /new to history if 'Create a new form' is selected", async () => {
    const push = jest.fn()
    const history = { push }
    render(<LandingChoice history={history} />)
    await act(() => userEvent.click(getByTitle('Next')))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/new'))
  })

  it("should push /choose-existing to history if 'Open an existing form' is selected", async () => {
    const push = jest.fn()
    const history = { push }
    render(<LandingChoice history={history} />)
    await act(() => userEvent.click(getByLabelText('Open an existing form')))
    await act(() => userEvent.click(getByTitle('Next')))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/choose-existing'))
  })
})
