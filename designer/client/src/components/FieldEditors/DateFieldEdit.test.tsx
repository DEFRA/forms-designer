import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'
import React from 'react'

import { DateFieldEdit } from '~/src/components/FieldEditors/DateFieldEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('Date field edit', () => {
  const supported = [ComponentType.DatePartsField]

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <DateFieldEdit />
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
            <DateFieldEdit />
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
          <DateFieldEdit />
        </RenderComponent>
      )
    })

    it('should render additional settings', () => {
      const $summary = screen.getByText('Additional settings', {
        selector: 'details > summary .govuk-details__summary-text'
      })

      expect($summary).toBeInTheDocument()
    })

    it("should render 'Max days in the past' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Max days in the past',
        description: 'Determines the earliest date users can enter'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { maxDaysInPast: 10 } }}
        >
          <DateFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Max days in the future' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Max days in the future',
        description: 'Determines the latest date users can enter'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { maxDaysInFuture: 10 } }}
        >
          <DateFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
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
          <DateFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('example')
    })
  })
})
