import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'

describe('ErrorMessage component', () => {
  it('renders children text', () => {
    render(<ErrorMessage className="123">Error 123</ErrorMessage>)
    expect(screen.getByText('Error 123')).toBeDefined()
  })

  it('passed down className', () => {
    const { container } = render(
      <ErrorMessage className="123">Error 123</ErrorMessage>
    )
    expect(container.firstChild).toHaveClass('123')
  })

  it('renders hidden accessibility error span', () => {
    render(<ErrorMessage className="123">Error 123</ErrorMessage>)
    expect(screen.getByText('Error:')).toHaveClass('govuk-visually-hidden')
  })
})
