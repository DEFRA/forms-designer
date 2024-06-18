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
  const { getByText } = screen

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
      lists: [],
      sections: [],
      conditions: []
    }
  })

  afterEach(cleanup)

  describe('Checkbox', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        component: {
          name: 'TestCheckboxes',
          title: 'Test checkboxes',
          list: 'TestList',
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
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('make checkbox field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const labelText = 'Make Checkboxes field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(getByText(labelText)).toBeInTheDocument()
      expect(getByText(hintText)).toBeInTheDocument()
    })

    test('select list hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(getByText(text)).toBeInTheDocument()
    })
  })

  describe('Radios', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        component: {
          name: 'TestRadios',
          title: 'Test radios',
          list: 'TestList',
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
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('make checkbox field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const labelText = 'Make Radios field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(getByText(labelText)).toBeInTheDocument()
      expect(getByText(hintText)).toBeInTheDocument()
    })

    test('select list hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(getByText(text)).toBeInTheDocument()
    })
  })

  describe('Select', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        component: {
          name: 'TestSelect',
          title: 'Test select',
          list: 'TestList',
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
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('make checkbox field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const labelText = 'Make Select field optional'
      const hintText =
        'Tick this box if users do not need to complete this field to progress through the form'

      expect(getByText(labelText)).toBeInTheDocument()
      expect(getByText(hintText)).toBeInTheDocument()
    })

    test('select list hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(getByText(text)).toBeInTheDocument()
    })
  })

  describe('YesNo', () => {
    let state: ComponentState

    beforeEach(() => {
      state = {
        component: {
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
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext data={data} state={state}>
          <ComponentTypeEdit page={data.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })
  })
})
