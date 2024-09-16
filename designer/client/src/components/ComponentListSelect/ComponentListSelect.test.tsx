import {
  ComponentType,
  type ComponentDef,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { ComponentListSelect } from '~/src/components/ComponentListSelect/ComponentListSelect.jsx'
import { RenderListEditorWithContext } from '~/test/helpers/renderers-lists.jsx'

describe('ComponentListSelect', () => {
  const selectedComponent = {
    name: 'IDDQl4',
    title: 'abc',
    list: 'myList',
    type: ComponentType.RadiosField,
    options: {
      required: true
    }
  } satisfies ComponentDef

  const data = {
    pages: [
      {
        title: 'First page',
        path: '/first-page',
        next: [],
        components: [selectedComponent]
      }
    ],
    lists: [
      {
        name: 'myList',
        title: 'My list',
        type: 'number',
        items: [{ text: 'An item', description: 'A hint', value: '12' }]
      },
      {
        name: 'myOtherList',
        title: '',
        type: 'string',
        items: [{ text: 'An item', description: 'A hint', value: '12' }]
      }
    ],
    sections: [],
    conditions: []
  } satisfies FormDefinition

  test('Lists all available lists', () => {
    const { container } = render(
      <RenderListEditorWithContext data={data} state={{ selectedComponent }}>
        <ComponentListSelect />
      </RenderListEditorWithContext>
    )

    const $options = container.querySelectorAll('option')

    expect($options).toHaveLength(3)

    const optionProps = [
      { value: 'myList', text: 'My list' },
      { value: 'myOtherList', text: '' }
    ]

    optionProps.forEach((optionProp, index) => {
      expect($options[index + 1]).toHaveValue(optionProp.value)
      expect($options[index + 1]).toHaveTextContent(optionProp.text)
    })
  })

  test('Selecting a different list changes the edit link', async () => {
    render(
      <RenderListEditorWithContext data={data} state={{ selectedComponent }}>
        <ComponentListSelect />
      </RenderListEditorWithContext>
    )

    const $select = screen.getByRole('combobox', {
      name: 'Select list'
    })

    await act(() => userEvent.selectOptions($select, 'myList'))

    expect(screen.getByText('Edit list')).toBeInTheDocument()
  })

  test('should render strings correctly', () => {
    render(
      <RenderListEditorWithContext data={data} state={{ selectedComponent }}>
        <ComponentListSelect />
      </RenderListEditorWithContext>
    )

    const $select = screen.getByRole('combobox', {
      name: 'Select list',
      description:
        'Select an existing list to show in this field or add a new list'
    })

    const $link = screen.getByRole('link', {
      name: 'Add a new list'
    })

    expect($select).toBeInTheDocument()
    expect($link).toBeInTheDocument()
  })

  test('should display list error when state has errors', async () => {
    const errors = {
      list: {
        href: '#field-options-list',
        children: 'Select a list'
      }
    }

    const { container } = render(
      <RenderListEditorWithContext
        data={data}
        state={{ selectedComponent, errors }}
      >
        <ComponentListSelect />
      </RenderListEditorWithContext>
    )

    const $select = screen.getByRole('combobox', { name: 'Select list' })
    await act(() => userEvent.selectOptions($select, 'Select a list'))

    expect(
      container.getElementsByClassName('govuk-form-group--error')
    ).toHaveLength(1)
  })
})
