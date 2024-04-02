import { FormDefinition } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { customRenderForLists } from '~/test/helpers/renderers-lists'

import React from 'react'
import { ListSelect } from '~/src/list/ListSelect'

const data: FormDefinition = {
  lists: [
    {
      name: 'myList',
      title: 'My list',
      type: 'number',
      items: [{ text: 'An item', description: 'A hint', value: 12 }]
    },
    {
      name: 'myOtherList',
      title: '',
      type: 'string',
      items: [{ text: 'An item', description: 'A hint', value: 12 }]
    }
  ]
}

const dataValue = { data, save: jest.fn() }

describe('ListSelect', () => {
  const { getByTestId, getByText, queryAllByTestId } = screen

  test('Lists all available lists and add list', () => {
    customRenderForLists(<ListSelect />, { dataValue })
    const $links = queryAllByTestId('edit-list')
    expect($links).toHaveLength(2)
    expect(getByTestId('add-list')).toBeInTheDocument()
  })

  test('strings are rendered correctly', async () => {
    customRenderForLists(<ListSelect />, { dataValue })

    expect(
      getByText(
        'Use lists to provide information in bullet points or set answers to multiple choice questions. After you create a list you can assign it to components to use on your form.'
      )
    ).toBeInTheDocument()
    expect(
      getByText(
        'Lists you have created appear on this screen. From here you can manage the lists available for your form.'
      )
    ).toBeInTheDocument()
    expect(getByText('Add a new list')).toBeInTheDocument()
  })
})
