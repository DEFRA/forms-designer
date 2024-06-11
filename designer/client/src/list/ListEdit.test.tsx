import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import React from 'react'

import { ListEdit } from '~/src/list/ListEdit.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'
import { customRenderForLists } from '~/test/helpers/renderers-lists.jsx'

const data: FormDefinition = {
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
    },
    {
      name: 'myEmptyList',
      title: 'My empty list',
      type: 'string',
      items: []
    }
  ],
  sections: [],
  conditions: []
}

const dataValue = { data, save: jest.fn() }

describe('ListEdit', () => {
  const { getByText } = screen

  test('strings are rendered correctly', () => {
    const listValue = {
      state: { selectedList: data.lists[0] },
      dispatch: jest.fn()
    }
    const listsValue = {
      state: { listEditContext: ListContext },
      dispatch: jest.fn()
    }

    customRenderForLists(<ListEdit />, {
      dataValue,
      listsValue,
      listValue
    })

    expect(getByText('List items')).toBeInTheDocument()
    expect(getByText('Enter a unique name for your list')).toBeInTheDocument()
    expect(getByText('Add list item')).toBeInTheDocument()
  })
})
