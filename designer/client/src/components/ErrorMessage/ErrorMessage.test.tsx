import React from 'react'
import { screen } from '@testing-library/dom'
import { render, cleanup } from '@testing-library/react'
import { ErrorMessage } from '.'

describe('ErrorMessage component', () => {
  afterEach(cleanup)

  const { getByText } = screen

  it('renders children text', async () => {
    render(<ErrorMessage className="123">Error 123</ErrorMessage>)
    expect(getByText('Error 123')).toBeDefined()
  })

  it('passed down className', async () => {
    const { container } = render(
      <ErrorMessage className="123">Error 123</ErrorMessage>
    )
    expect(container.firstChild).toHaveClass('123')
  })

  it('renders hidden accessibility error span', () => {
    render(<ErrorMessage className="123">Error 123</ErrorMessage>)
    expect(getByText('Error:')).toHaveClass('govuk-visually-hidden')
  })
})
