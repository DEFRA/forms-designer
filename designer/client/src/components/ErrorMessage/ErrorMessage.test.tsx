import { screen } from '@testing-library/dom'
import { render, cleanup } from '@testing-library/react'
import React from 'react'

import { ErrorMessage } from '~/src/components/ErrorMessage/index.js'

describe('ErrorMessage component', () => {
  afterEach(cleanup)

  const { getByText } = screen

  it('renders children text', () => {
    render(<ErrorMessage className="123">Error 123</ErrorMessage>)
    expect(getByText('Error 123')).toBeDefined()
  })

  it('passed down className', () => {
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
