import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'

import { ContentEdit } from '~/src/components/FieldEditors/ContentEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('ContentEdit', () => {
  const supported = [
    ComponentType.Details,
    ComponentType.Html,
    ComponentType.InsetText
  ]

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <ContentEdit />
          </RenderComponent>
        )

        const $group = container.querySelector('.govuk-form-group')
        expect($group).not.toBeNull()
      }
    )

    it.each(ComponentTypes.filter(({ type }) => !supported.includes(type)))(
      "should not render unsupported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <ContentEdit />
          </RenderComponent>
        )

        const $group = container.querySelector('.govuk-form-group')
        expect($group).toBeNull()
      }
    )
  })

  describe.each(supported)('Settings: %s', (type) => {
    let selectedComponent: ComponentDef
    let result: RenderResult

    beforeEach(() => {
      selectedComponent = getComponentDefaults({ type })

      result = render(
        <RenderComponent defaults={selectedComponent}>
          <ContentEdit />
        </RenderComponent>
      )
    })

    it("should render 'Content' textarea", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Content',

        // Custom component `<SimpleEditor>` does not support
        // `aria-describedby` to associate hint text by ID
        description: ''
      })

      expect($input).toBeInTheDocument()
    })

    it("should render 'Content' hint text", () => {
      expect(result.container).toHaveTextContent(
        selectedComponent.type === ComponentType.Details
          ? 'Enter the text you want to show when users expand the title. You can apply basic HTML, such as text formatting and hyperlinks'
          : 'Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks'
      )
    })
  })
})
