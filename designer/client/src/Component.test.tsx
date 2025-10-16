import { render } from '@testing-library/react'

import { DeclarationField } from '~/src/Component.jsx'

describe('Component', () => {
  describe('DeclarationField', () => {
    it('should render declaration field with correct classes', () => {
      const { container } = render(<DeclarationField />)

      const field = container.querySelector('.app-field-input')
      const prefix = container.querySelector('.app-field-prefix--declaration')

      expect(field).toBeInTheDocument()
      expect(prefix).toBeInTheDocument()
    })
  })
})
