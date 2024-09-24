import {
  ComponentType,
  ConditionType,
  ControllerPath,
  ControllerType,
  OperatorName,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { ListItemEdit } from '~/src/list/ListItemEdit.jsx'
import { RenderListEditorWithContext } from '~/test/helpers/renderers-lists.jsx'

const data = {
  pages: [
    {
      title: 'start',
      path: ControllerPath.Start,
      controller: ControllerType.Start,
      components: [
        {
          name: 'text',
          title: 'Start',
          content: '<p class="govuk-body">Some content</p>',
          type: ComponentType.Html,
          options: {}
        }
      ],
      next: [
        {
          path: '/first-page'
        }
      ]
    },
    {
      title: 'First page',
      path: '/first-page',
      next: [],
      components: [
        {
          name: 'IDDQl4',
          title: 'abc',
          list: 'myList',
          type: ComponentType.SelectField,
          options: {
            required: true
          }
        }
      ]
    }
  ],
  sections: [],
  startPage: '',
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
  conditions: [
    {
      displayName: 'my condition',
      name: 'MYWwRN',
      value: {
        name: 'name',
        conditions: [
          {
            field: {
              name: 'text',
              type: ComponentType.TextField,
              display: 'text'
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'hello',
              display: 'hello'
            }
          }
        ]
      }
    }
  ]
} satisfies FormDefinition

describe('ListItemEdit', () => {
  test('strings are rendered correctly', () => {
    render(
      <RenderListEditorWithContext
        data={data}
        initialName="myList"
        initialItemText="text a"
      >
        <ListItemEdit />
      </RenderListEditorWithContext>
    )

    const $itemLabel = screen.getByText('Item text')
    const $itemHint = screen.getByText('Enter the text you want to show')

    const $itemValueHint = screen.getByText(
      'This determines the data format of the list item and does not show on the form. Unless you are using integrations and want to modify the payload, it should match the list item text.'
    )

    const $itemConditionsHint = screen.getByText(
      'Select a condition that determines whether to show this list item. You can create and edit conditions on the Conditions screen.'
    )

    expect($itemLabel).toBeInTheDocument()
    expect($itemHint).toBeInTheDocument()
    expect($itemValueHint).toBeInTheDocument()
    expect($itemConditionsHint).toBeInTheDocument()
  })

  test('Condition selection works correctly', async () => {
    render(
      <RenderListEditorWithContext
        data={data}
        initialName="myList"
        initialItemText="text a"
      >
        <ListItemEdit />
      </RenderListEditorWithContext>
    )

    const $select = screen.getByRole<HTMLSelectElement>('combobox', {
      name: 'Conditions (optional)',
      description:
        'Select a condition that determines whether to show this list item. You can create and edit conditions on the Conditions screen.'
    })

    expect($select).toHaveValue('')
    expect($select.options[$select.selectedIndex].textContent).toBe(
      'Select a condition'
    )

    await userEvent.selectOptions($select, 'MYWwRN')

    expect($select).toHaveValue('MYWwRN')
    expect($select.options[$select.selectedIndex].textContent).toBe(
      'my condition'
    )
  })
})
