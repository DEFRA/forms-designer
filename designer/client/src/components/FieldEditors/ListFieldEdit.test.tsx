import {
  ComponentType,
  ComponentTypes,
  getComponentDefaults,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { ListFieldEdit } from '~/src/components/FieldEditors/ListFieldEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('List field edit', () => {
  const supported = [
    ComponentType.AutocompleteField,
    ComponentType.List,
    ComponentType.RadiosField,
    ComponentType.SelectField,
    ComponentType.CheckboxesField
  ]

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

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent data={data} defaults={selectedComponent}>
            <ListFieldEdit />
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
          <RenderComponent data={data} defaults={selectedComponent}>
            <ListFieldEdit />
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
        <RenderComponent data={data} defaults={selectedComponent}>
          <ListFieldEdit />
        </RenderComponent>
      )
    })

    it("should render 'Select list' menu", () => {
      const $select = screen.getByRole<HTMLSelectElement>('combobox', {
        name: 'Select list',
        description:
          'Select an existing list to show in this field or add a new list'
      })

      expect($select).toBeInTheDocument()

      expect($select).toHaveValue('')
      expect($select.options[$select.selectedIndex].textContent).toBe(
        'Select a list'
      )

      result.rerender(
        <RenderComponent
          data={data}
          defaults={selectedComponent}
          override={{ list: 'myList' }}
        >
          <ListFieldEdit />
        </RenderComponent>
      )

      expect($select).toHaveValue('myList')
      expect($select.options[$select.selectedIndex].textContent).toBe('My list')
    })

    it("should render 'Add a new list' link", () => {
      const $link = screen.getByRole('link', {
        name: 'Add a new list'
      })

      expect($link).toBeInTheDocument()
    })

    it("should not render 'Edit list' link", () => {
      const $link = screen.queryByRole('link', {
        name: 'Edit list'
      })

      expect($link).not.toBeInTheDocument()
    })

    it("should render 'Edit list' link (when selected)", async () => {
      const $select = screen.getByRole<HTMLSelectElement>('combobox', {
        name: 'Select list'
      })

      await userEvent.selectOptions($select, 'myList')

      expect($select).toHaveValue('myList')
      expect($select.options[$select.selectedIndex].textContent).toBe('My list')

      const $link = screen.getByRole('link', {
        name: 'Edit list'
      })

      expect($link).toBeInTheDocument()
    })
  })
})
