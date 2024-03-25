import { Data } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import React from 'react'
import { customRenderForLists } from '../../../test/helpers/renderers-lists'
import { Warning } from './Warning'

const data = {
  pages: [],
  sections: [],
  startPage: '',
  lists: [
    {
      name: 'myList',
      title: 'My list',
      items: [
        { text: 'text a', description: 'desc a', value: 'value a' },
        { text: 'text b', description: 'desc b', value: 'value b' }
      ]
    }
  ]
}

const dataValue = { data, save: jest.fn() }

describe('Warning', () => {
  const { getByText } = screen

  test('strings are rendered correctly', async () => {
    customRenderForLists(<Warning />, { dataValue })

    expect(getByText('Delete list')).toBeInTheDocument()
    expect(
      getByText('You will no longer be able to edit or assign this list.')
    ).toBeInTheDocument()
    expect(getByText('Yes, delete this list')).toBeInTheDocument()
    expect(getByText('No, keep it')).toBeInTheDocument()
  })
})
