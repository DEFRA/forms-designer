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
  conditions: [],
  outputs: []
}

const dataValue = { data, save: jest.fn() }

describe('ListEdit', () => {
  const { getByText, queryByText } = screen

  test('strings are rendered correctly', async () => {
    const listValue = {
      state: { selectedList: data.lists[0] },
      dispatch: jest.fn()
    }
    const listsValue = {
      state: { listEditContext: ListContext },
      dispatch: jest.fn()
    }

    const { rerender } = customRenderForLists(<ListEdit />, {
      dataValue,
      listsValue,
      listValue
    })

    expect(getByText('List items')).toBeInTheDocument()
    expect(getByText('Enter a unique name for your list')).toBeInTheDocument()
    expect(
      getByText('Use the drag handles to reorder your list')
    ).toBeInTheDocument()
    expect(getByText('Add list item')).toBeInTheDocument()
    expect(
      queryByText('This list does not have any list items')
    ).not.toBeInTheDocument()

    const emptyList = {
      state: { selectedList: data.lists[1], isNew: true },
      dispatch: jest.fn()
    }

    await rerender.call(
      {
        dataValue,
        listsValue,
        listValue: emptyList
      },
      <ListEdit />
    )
    expect(
      getByText('This list does not have any list items')
    ).toBeInTheDocument()
  })
})
