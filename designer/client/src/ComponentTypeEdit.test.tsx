import {
  ComponentSubType,
  ComponentType,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('ComponentTypeEdit', () => {
  let data: FormDefinition

  beforeEach(() => {
    data = {
      pages: [
        {
          title: 'First page',
          path: '/first-page',
          components: [],
          controller: './pages/summary.js',
          section: 'home'
        }
      ],
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
    }
  })

  afterEach(cleanup)

  describe('Checkbox', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TestCheckboxes',
          title: 'Test checkboxes',
          list: 'myList',
          type: ComponentType.CheckboxesField,
          subType: ComponentSubType.ListField,
          options: {},
          schema: {}
        } satisfies ComponentDef
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is not rendered', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('make checkbox field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const labelText = 'Make Checkboxes field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(screen.getByText(labelText)).toBeInTheDocument()
      expect(screen.getByText(hintText)).toBeInTheDocument()
    })

    test('select list hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })

  describe('Radios', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TestRadios',
          title: 'Test radios',
          list: 'myList',
          type: ComponentType.RadiosField,
          subType: ComponentSubType.ListField,
          options: {},
          schema: {}
        } satisfies ComponentDef
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is not rendered', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('make radios field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const labelText = 'Make Radios field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(screen.getByText(labelText)).toBeInTheDocument()
      expect(screen.getByText(hintText)).toBeInTheDocument()
    })

    test('select list hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })

  describe('Select', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TestSelect',
          title: 'Test select',
          list: 'myList',
          type: ComponentType.SelectField,
          subType: ComponentSubType.ListField,
          options: {},
          schema: {}
        } satisfies ComponentDef
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is not rendered', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('make select field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const labelText = 'Make Select field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(screen.getByText(labelText)).toBeInTheDocument()
      expect(screen.getByText(hintText)).toBeInTheDocument()
    })

    test('select list hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })

  describe('YesNo', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TestYesNo',
          title: 'Test yes/no',
          type: ComponentType.YesNoField,
          options: {},
          schema: {}
        } satisfies ComponentDef
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is not rendered', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('make yes/no field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const labelText = 'Make Yes/No field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(screen.getByText(labelText)).toBeInTheDocument()
      expect(screen.getByText(hintText)).toBeInTheDocument()
    })
  })

  describe('UK address', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TestUkAddress',
          title: 'Test UK address',
          type: ComponentType.UkAddressField,
          subType: ComponentSubType.Field,
          hint: '',
          options: {},
          schema: {}
        } satisfies ComponentDef
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('make UK address field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit />
        </RenderWithContext>
      )

      const labelText = 'Make UK address field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(screen.getByText(labelText)).toBeInTheDocument()
      expect(screen.getByText(hintText)).toBeInTheDocument()
    })
  })
})
