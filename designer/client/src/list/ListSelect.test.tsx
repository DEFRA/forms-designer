import { type FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

import { ListSelect } from '~/src/list/ListSelect.jsx'
import { RenderListEditorWithContext } from '~/test/helpers/renderers-lists.jsx'

const data = {
  pages: [],
  lists: [
    {
      name: 'myList',
      title: 'My list',
      type: 'number',
      items: [{ text: 'An item', description: 'A hint', value: 12 }]
    },
    {
      name: 'myOtherList',
      title: 'My other list',
      type: 'string',
      items: [{ text: 'An item', description: 'A hint', value: 12 }]
    }
  ],
  sections: [],
  conditions: []
} satisfies FormDefinition

describe('ListSelect', () => {
  test('Lists all available lists and add list', () => {
    render(
      <RenderListEditorWithContext data={data}>
        <ListSelect />
      </RenderListEditorWithContext>
    )

    const $link1 = screen.getByRole('link', { name: data.lists[0].title })
    const $link2 = screen.getByRole('link', { name: data.lists[1].title })
    const $button = screen.getByRole('button', { name: 'Add a new list' })

    expect($link1).toBeInTheDocument()
    expect($link2).toBeInTheDocument()
    expect($button).toBeInTheDocument()
  })

  test('strings are rendered correctly', () => {
    render(
      <RenderListEditorWithContext data={data}>
        <ListSelect />
      </RenderListEditorWithContext>
    )

    const listHint1 = screen.getByText(
      'Use lists to provide information in bullet points or set answers to multiple choice questions. After you create a list you can assign it to components to use on your form.'
    )

    const listHint2 = screen.getByText(
      'Lists you have created appear on this screen. From here you can manage the lists available for your form.'
    )

    const listLink = screen.getByText('Add a new list')

    expect(listHint1).toBeInTheDocument()
    expect(listHint2).toBeInTheDocument()
    expect(listLink).toBeInTheDocument()
  })
})
