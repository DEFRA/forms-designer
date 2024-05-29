import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React, { useReducer } from 'react'

import ComponentTypeEdit from '~/src/ComponentTypeEdit.jsx'
import { DataContext } from '~/src/context/index.js'
import {
  ComponentContext,
  componentReducer,
  initComponentState
} from '~/src/reducers/component/componentReducer.jsx'

describe('ComponentTypeEdit', () => {
  const { getByText } = screen

  let mockData: FormDefinition

  const RenderWithContext = ({ children, stateProps = {} }) => {
    const [state, dispatch] = useReducer(
      componentReducer,
      initComponentState({
        ...stateProps
      })
    )

    return (
      <DataContext.Provider value={{ data: mockData, save: jest.fn() }}>
        <ComponentContext.Provider value={{ state, dispatch }}>
          {children}
        </ComponentContext.Provider>
      </DataContext.Provider>
    )
  }

  beforeEach(() => {
    mockData = {
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
      conditions: [],
      outputs: []
    }
  })

  afterEach(cleanup)

  describe('Checkbox', () => {
    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'CheckboxesField',
          name: 'TestCheckbox',
          options: {}
        }
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('make checkbox field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
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
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(getByText(text)).toBeInTheDocument()
    })
  })

  describe('Radios', () => {
    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'RadiosField',
          name: 'TestRadios',
          options: {}
        }
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('make checkbox field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
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
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(getByText(text)).toBeInTheDocument()
    })
  })

  describe('Select', () => {
    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'SelectField',
          name: 'TestSelect',
          options: {}
        }
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('make checkbox field optional hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
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
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Select an existing list to show in this field or add a new list'
      expect(getByText(text)).toBeInTheDocument()
    })
  })

  describe('YesNo', () => {
    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'YesNoField',
          name: 'TestYesNo',
          options: {}
        }
      }
    })

    test('title input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the name to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('help text input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text = 'Enter the description to show for this field'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('hide title checkbox hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'Tick this box if you do not want the title to show on the page'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('component name input hint text is rendered correctly', () => {
      render(
        <RenderWithContext stateProps={stateProps}>
          <ComponentTypeEdit page={mockData.pages[0]} />
        </RenderWithContext>
      )

      const text =
        'This is generated automatically and does not show on the page. Only change it if you are using an integration that requires you to, for example GOV.UK Notify. It must not contain spaces.'
      expect(getByText(text)).toBeInTheDocument()
    })
  })
})
