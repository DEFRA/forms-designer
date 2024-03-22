import React from 'react'
import { LandingChoice } from './Choice'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'

describe('LandingChoice', () => {
  afterEach(cleanup)

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
    await fireEvent.click(screen.getByTitle('Next'))
    expect(push).toHaveBeenCalledWith('/new')
  })

  it("should push /choose-existing to history if 'Open an existing form' is selected", async () => {
    const push = jest.fn()
    const history = { push }
    render(<LandingChoice history={history} />)
    await fireEvent.click(screen.getByLabelText('Open an existing form'))
    await fireEvent.click(screen.getByTitle('Next'))
    expect(push).toHaveBeenCalledWith('/choose-existing')
  })
})
