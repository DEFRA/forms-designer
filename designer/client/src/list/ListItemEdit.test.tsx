import {
  ComponentSubType,
  ComponentType,
  ConditionType,
  type FormDefinition
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { act, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'

import { ListItemEdit } from '~/src/list/ListItemEdit.jsx'
import { RenderListEditorWithContext } from '~/test/helpers/renderers-lists.jsx'

const data: FormDefinition = {
  pages: [
    {
      title: 'start',
      path: '/start',
      components: [
        {
          name: 'text',
          title: 'text',
          type: ComponentType.TextField,
          schema: {},
          options: {
            required: true
          }
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
      components: [
        {
          name: 'IDDQl4',
          title: 'abc',
          list: 'myList',
          type: ComponentType.SelectField,
          subType: ComponentSubType.ListField,
          schema: {},
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
            operator: 'is',
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
}

describe('ListItemEdit', () => {
  const { getByText, getByTestId, getAllByTestId } = screen

  test('strings are rendered correctly', () => {
    render(
      <RenderListEditorWithContext data={data}>
        <ListItemEdit />
      </RenderListEditorWithContext>
    )

    expect(getByText('Item text')).toBeInTheDocument()
    expect(getByText('Enter the text you want to show')).toBeInTheDocument()
    expect(
      getByText(
        'This determines the data format of the list item and does not show on the form. Unless you are using integrations and want to modify the payload, it should match the list item text.'
      )
    ).toBeInTheDocument()
    expect(
      getByText(
        'Select a condition that determines whether to show this list item. You can create and edit conditions on the Conditions screen.'
      )
    ).toBeInTheDocument()
  })

  test('Condition selection works correctly', async () => {
    render(
      <RenderListEditorWithContext data={data}>
        <ListItemEdit />
      </RenderListEditorWithContext>
    )

    const $select = getByTestId('list-condition-select')
    const $options: HTMLOptionElement[] = getAllByTestId(
      'list-condition-option'
    )

    expect($options[0].selected).toBeTruthy()
    expect($options[1].selected).toBeFalsy()

    await act(() => userEvent.selectOptions($select, 'MYWwRN'))

    expect($options[0].selected).toBeFalsy()
    expect($options[1].selected).toBeTruthy()
    expect($options[1].textContent).toBe('my condition')
  })
})
