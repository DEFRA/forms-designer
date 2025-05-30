import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'

import { SelectFieldEdit } from '~/src/components/FieldEditors/SelectFieldEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('Select field edit', () => {
  const supported = [ComponentType.SelectField]

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <SelectFieldEdit />
          </RenderComponent>
        )

        const $details = container.querySelector('details')
        expect($details).toBeInTheDocument()
      }
    )

    it.each(ComponentTypes.filter(({ type }) => !supported.includes(type)))(
      "should not render unsupported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <SelectFieldEdit />
          </RenderComponent>
        )

        const $details = container.querySelector('details')
        expect($details).not.toBeInTheDocument()
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
          <SelectFieldEdit />
        </RenderComponent>
      )
    })

    it('should render additional settings', () => {
      const $summary = screen.getByText('Additional settings', {
        selector: 'details > summary .govuk-details__summary-text'
      })

      expect($summary).toBeInTheDocument()
    })

    it("should render 'Autocomplete' input", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Autocomplete',
        description:
          'Add the autocomplete attribute to this field. For example, ‘on’ or ‘given-name’'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue('')

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { autocomplete: 'bday' } }}
        >
          <SelectFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('bday')
    })
  })
})
