import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render, type RenderResult } from '@testing-library/react'
import React from 'react'

import { ListContentEdit } from '~/src/components/FieldEditors/ListContentEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('List content edit', () => {
  const supported = [ComponentType.List]

  const data = {
    pages: [],
    lists: [
      {
        name: 'myList',
        title: 'My list',
        type: 'string',
        items: [
          { text: 'text a', description: 'desc a', value: 'value a' },
          { text: 'text b', description: 'desc b', value: 'value b' }
        ]
      }
    ],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  afterEach(cleanup)

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent data={data} defaults={selectedComponent}>
            <ListContentEdit />
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
          <RenderComponent data={data} defaults={selectedComponent}>
            <ListContentEdit />
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
        <RenderComponent data={data} defaults={selectedComponent}>
          <ListContentEdit />
        </RenderComponent>
      )
    })

    it('should render additional settings', () => {
      const $summary = screen.getByText('Additional settings', {
        selector: 'details > summary .govuk-details__summary-text'
      })

      expect($summary).toBeInTheDocument()
    })

    it("should render 'List format' radios", () => {
      const $legend = screen.getByText('List format', {
        selector: 'fieldset > legend'
      })

      const $radio1 = screen.getByRole('radio', {
        name: 'Bulleted',
        checked: true
      })

      const $radio2 = screen.getByRole('radio', {
        name: 'Numbered',
        checked: false
      })

      expect($legend).toBeInTheDocument()
      expect($radio1).toBeInTheDocument()
      expect($radio2).toBeInTheDocument()

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { type: 'bulleted' } }}
        >
          <ListContentEdit />
        </RenderComponent>
      )

      expect($radio1).toBeChecked()

      result.rerender(
        <RenderComponent
          defaults={selectedComponent}
          override={{ options: { type: 'numbered' } }}
        >
          <ListContentEdit />
        </RenderComponent>
      )

      expect($radio2).toBeChecked()
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
          override={{
            options: { classes: 'example' }
          }}
        >
          <ListContentEdit />
        </RenderComponent>
      )

      expect($input).toHaveValue('example')
    })
  })
})
