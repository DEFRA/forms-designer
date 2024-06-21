import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import React from 'react'

import { ListEdit } from '~/src/list/ListEdit.jsx'
import { RenderListEditorWithContext } from '~/test/helpers/renderers-lists.jsx'

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

describe('ListEdit', () => {
  const { getByText } = screen

  test('strings are rendered correctly', () => {
    const selectedListName = data.lists[0].name

    render(
      <RenderListEditorWithContext
        data={data}
        selectedListName={selectedListName}
      >
        <ListEdit />
      </RenderListEditorWithContext>
    )

    expect(getByText('List items')).toBeInTheDocument()
    expect(getByText('Enter a unique name for your list')).toBeInTheDocument()
    expect(getByText('Add list item')).toBeInTheDocument()
  })
})
