import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render, type RenderResult } from '@testing-library/react'
import React from 'react'

import { NumberFieldEdit } from '~/src/components/FieldEditors/NumberFieldEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('Number field edit', () => {
  const supported = [ComponentType.NumberField]

  afterEach(cleanup)

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <NumberFieldEdit />
          </RenderComponent>
        )

        const $details = container.querySelector('details')
        expect($details).not.toBeNull()
      }
    )

    it.each(ComponentTypes.filter(({ type }) => !supported.includes(type)))(
      "should not render unsupported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <NumberFieldEdit />
          </RenderComponent>
        )

        const $details = container.querySelector('details')
        expect($details).toBeNull()
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
          <NumberFieldEdit />
        </RenderComponent>
      )
    })

    it('should render additional settings', () => {
      const $summary = screen.getByText('Additional settings', {
        selector: 'details > summary .govuk-details__summary-text'
      })

      expect($summary).toBeInTheDocument()
    })

    it("should render 'Min' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Min',
        description: 'Specifies the lowest number users can enter'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ schema: { min: 10 } }}
        >
          <NumberFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Max' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Max',
        description: 'Specifies the highest number users can enter'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ schema: { max: 10 } }}
        >
          <NumberFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Precision' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Precision',
        description:
          'Specifies the number of decimal places users can enter. For example, to allow users to enter numbers with up to two decimal places, set this to 2'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ schema: { precision: 10 } }}
        >
          <NumberFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Prefix' input", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Prefix',
        description: 'Specifies the prefix of the field'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue('')

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { prefix: 'ABC' } }}
        >
          <NumberFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('ABC')
    })

    it("should render 'Suffix' input", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Suffix',
        description: 'Specifies the suffix of the field'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue('')

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { suffix: 'XYZ' } }}
        >
          <NumberFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('XYZ')
    })

    it("should render 'Classes' input", () => {
      const $input = screen.getByRole('textbox', {
        name: 'Classes',
        description:
          'Apply CSS classes to this field. For example, ‘govuk-input govuk-!-width-full’'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue('')

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { classes: 'example' } }}
        >
          <NumberFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('example')
    })
  })
})
