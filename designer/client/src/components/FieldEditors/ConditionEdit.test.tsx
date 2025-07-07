import {
  ComponentType,
  ComponentTypes,
  ConditionType,
  OperatorName,
  getComponentDefaults,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'

import { ConditionEdit } from '~/src/components/FieldEditors/ConditionEdit.jsx'
import { RenderComponent } from '~/test/helpers/renderers.jsx'

describe('Condition edit', () => {
  const supported = [
    ComponentType.AutocompleteField,
    ComponentType.RadiosField,
    ComponentType.CheckboxesField,
    ComponentType.DatePartsField,
    ComponentType.EmailAddressField,
    ComponentType.MultilineTextField,
    ComponentType.TelephoneNumberField,
    ComponentType.NumberField,
    ComponentType.SelectField,
    ComponentType.TextField,
    ComponentType.YesNoField
  ]

  const data = {
    pages: [],
    lists: [],
    sections: [],
    conditions: [
      {
        name: 'someCondition',
        displayName: 'My condition',
        value: {
          name: 'My condition',
          conditions: [
            {
              field: {
                name: 'field1',
                display: 'Something',
                type: ComponentType.YesNoField
              },
              operator: OperatorName.Is,
              value: {
                type: ConditionType.Value,
                value: 'true',
                display: 'Yes'
              }
            }
          ]
        }
      }
    ]
  } satisfies FormDefinition

  describe('Supported components', () => {
    it.each(ComponentTypes.filter(({ type }) => supported.includes(type)))(
      "should render supported component '%s'",
      (selectedComponent) => {
        const { container } = render(
          <RenderComponent data={data} defaults={selectedComponent}>
            <ConditionEdit />
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
          <RenderComponent data={data} defaults={selectedComponent}>
            <ConditionEdit />
          </RenderComponent>
        )

        const $group = container.querySelector('.govuk-form-group')
        expect($group).not.toBeInTheDocument()
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
          <ConditionEdit />
        </RenderComponent>
      )
    })

    it("should render 'Condition (optional)' menu", () => {
      const $select = screen.getByRole<HTMLSelectElement>('combobox', {
        name: 'Condition (optional)',
        description:
          'Select a condition that determines whether to show the contents of this component. You can create and edit conditions from the Conditions screen.'
      })

      expect($select).toBeInTheDocument()

      expect($select).toHaveValue('')
      expect($select.options[$select.selectedIndex].textContent).toBe(
        'Select a condition'
      )

      result.rerender(
        <RenderComponent
          data={data}
          defaults={selectedComponent}
          override={{ options: { condition: 'someCondition' } }}
        >
          <ConditionEdit />
        </RenderComponent>
      )

      expect($select).toHaveValue('someCondition')
      expect($select.options[$select.selectedIndex].textContent).toBe(
        'My condition'
      )
    })
  })
})
