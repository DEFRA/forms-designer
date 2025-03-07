import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { ContentEdit } from '~/src/components/FieldEditors/ContentEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('ContentEdit', () => {
  const supported = [
    ComponentType.Details,
    ComponentType.Html,
    ComponentType.Markdown,
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
        expect($group).toBeInTheDocument()
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
        expect($group).not.toBeInTheDocument()
      }
    )
  })

  describe.each(supported)('Settings: %s', (type) => {
    let selectedComponent: ComponentDef

    beforeEach(() => {
      selectedComponent = getComponentDefaults({ type })

      render(
        <RenderComponent defaults={selectedComponent}>
          <ContentEdit />
        </RenderComponent>
      )
    })

    it("should render 'Content' textarea", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Content',
        description:
          selectedComponent.type === ComponentType.Details
            ? 'Enter the text you want to show when users expand the title. You can apply basic HTML, such as text formatting and hyperlinks.'
            : 'Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks.'
      })

      expect($input).toBeInTheDocument()
    })
  })
})
