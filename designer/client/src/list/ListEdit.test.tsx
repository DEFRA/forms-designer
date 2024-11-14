import { ComponentType, type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { ListEdit } from '~/src/list/ListEdit.jsx'
import { RenderListEditorWithContext } from '~/test/helpers/renderers-lists.jsx'

const data = {
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
} satisfies FormDefinition

describe('ListEdit', () => {
  test('strings are rendered correctly', () => {
    const initialName = data.lists[0].name

    render(
      <RenderListEditorWithContext data={data} initialName={initialName}>
        <ListEdit />
      </RenderListEditorWithContext>
    )

    const $listCaption = screen.getByText('List items')
    const $listHint = screen.getByText('Enter a unique name for your list')
    const $listLink = screen.getByText('Add a new list item')
    const $listDelete = screen.getByText('Delete')

    expect($listCaption).toBeInTheDocument()
    expect($listHint).toBeInTheDocument()
    expect($listLink).toBeInTheDocument()
    expect($listDelete).toBeInTheDocument()
  })

  test('message is displayed if the list is referenced', () => {
    const initialName = data.lists[0].name
    const dataWithReferencedList = {
      ...data,
      pages: [
        {
          title: 'Page one',
          path: '/page-one',
          next: [],
          components: [
            {
              name: 'aYwMGM',
              title: 'Choose animals',
              type: ComponentType.CheckboxesField,
              hint: '',
              list: 'myList',
              options: {}
            }
          ]
        }
      ]
    } satisfies FormDefinition

    render(
      <RenderListEditorWithContext
        data={dataWithReferencedList}
        initialName={initialName}
      >
        <ListEdit />
      </RenderListEditorWithContext>
    )

    const $listCaption = screen.getByText('List items')
    const $listHint = screen.getByText('Enter a unique name for your list')
    const $listLink = screen.getByText('Add a new list item')
    const $listDeleteMessage = screen.getByText(
      'This list cannot be deleted as it is referenced in: "Choose animals"'
    )

    expect($listCaption).toBeInTheDocument()
    expect($listHint).toBeInTheDocument()
    expect($listLink).toBeInTheDocument()
    expect($listDeleteMessage).toBeInTheDocument()
  })
})
