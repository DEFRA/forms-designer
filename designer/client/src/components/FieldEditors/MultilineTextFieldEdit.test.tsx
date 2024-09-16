import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render, type RenderResult } from '@testing-library/react'
import React from 'react'

import { MultilineTextFieldEdit } from '~/src/components/FieldEditors/MultilineTextFieldEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('Multiline text field edit', () => {
  const supported = [ComponentType.MultilineTextField]

  afterEach(cleanup)

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent defaults={selectedComponent}>
            <MultilineTextFieldEdit />
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
            <MultilineTextFieldEdit />
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
          <MultilineTextFieldEdit />
        </RenderComponent>
      )
    })

    it('should render additional settings', () => {
      const $summary = screen.getByText('Additional settings', {
        selector: 'details > summary .govuk-details__summary-text'
      })

      expect($summary).toBeInTheDocument()
    })

    it("should render 'Max words' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Max words',
        description: 'Specifies the maximum number of words users can enter'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { maxWords: 10 } }}
        >
          <MultilineTextFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })

    it("should render 'Rows' input", () => {
      const $input = screen.getByRole('spinbutton', {
        name: 'Rows',
        description: 'Specifies the number of textarea rows (default is 5 rows)'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(null)

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { rows: 10 } }}
        >
          <MultilineTextFieldEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue(10)
    })
  })
})
