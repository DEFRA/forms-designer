import {
  ComponentType,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { FieldEdit } from '~/src/FieldEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Field Edit', () => {
  let selectedComponent: ComponentDef
  let data: FormDefinition

  beforeEach(() => {
    selectedComponent = {
      name: 'IDDQl4',
      title: 'Text field',
      type: ComponentType.TextField,
      hint: '',
      options: {},
      schema: {}
    }

    data = {
      pages: [
        {
          title: 'First page',
          path: '/first-page',
          next: [],
          components: [selectedComponent]
        }
      ],
      lists: [],
      sections: [],
      conditions: []
    }
  })

  it('should render options for non-list components', () => {
    render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <FieldEdit />
      </RenderWithContext>
    )

    const $inputs = screen.queryAllByRole('textbox')
    const $checkboxes = screen.queryAllByRole('checkbox')
    const $selects = screen.queryAllByRole('combobox')

    expect($inputs).toHaveLength(2)
    expect($checkboxes).toHaveLength(1)
    expect($selects).toHaveLength(0)
  })

  it('should render options for list component', () => {
    selectedComponent.title = 'List'
    selectedComponent.type = ComponentType.List

    render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <FieldEdit />
      </RenderWithContext>
    )

    const $inputs = screen.queryAllByRole('textbox')
    const $checkboxes = screen.queryAllByRole('checkbox')
    const $selects = screen.queryAllByRole('combobox')

    expect($inputs).toHaveLength(2)
    expect($checkboxes).toHaveLength(1)
    expect($selects).toHaveLength(0)
  })

  it('should render options for components with lists', () => {
    selectedComponent.title = 'Autocomplete'
    selectedComponent.type = ComponentType.AutocompleteField

    render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <FieldEdit />
      </RenderWithContext>
    )

    const $inputs = screen.queryAllByRole('textbox')
    const $checkboxes = screen.queryAllByRole('checkbox')
    const $selects = screen.queryAllByRole('combobox')

    expect($inputs).toHaveLength(2)
    expect($checkboxes).toHaveLength(1)
    expect($selects).toHaveLength(0)
  })

  it('should render options for content components', () => {
    selectedComponent.title = 'Details'
    selectedComponent.type = ComponentType.Details

    render(
      <RenderWithContext data={data} state={{ selectedComponent }}>
        <FieldEdit />
      </RenderWithContext>
    )

    const $inputs = screen.queryAllByRole('textbox')
    const $checkboxes = screen.queryAllByRole('checkbox')
    const $selects = screen.queryAllByRole('combobox')

    expect($inputs).toHaveLength(1)
    expect($checkboxes).toHaveLength(0)
    expect($selects).toHaveLength(0)
  })
})
