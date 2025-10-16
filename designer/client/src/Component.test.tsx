import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { render } from '@testing-library/react'

import { Component } from '~/src/Component.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

const data = {
  pages: [
    {
      title: 'Declaration page',
      path: '/declaration',
      next: [],
      components: [
        {
          name: 'declaration',
          title: 'Declaration',
          type: ComponentType.DeclarationField,
          content: 'I declare that the information is correct',
          options: {}
        }
      ]
    }
  ],
  lists: [],
  sections: [],
  conditions: []
} satisfies FormDefinition

describe('Component', () => {
  describe('DeclarationField', () => {
    it('should render declaration field component', () => {
      const page = data.pages[0]
      const component = page.components[0]

      const { container } = render(
        <RenderWithContext data={data}>
          <Component page={page} selectedComponent={component} index={0} />
        </RenderWithContext>
      )

      const field = container.querySelector('.app-field-input')
      const prefix = container.querySelector('.app-field-prefix--declaration')

      expect(field).toBeInTheDocument()
      expect(prefix).toBeInTheDocument()
    })
  })
})
