import { shallow } from 'enzyme'
import React from 'react'

import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList'

describe('ComponentCreateList', () => {
  const onSelectComponent = jest.fn()

  test('it displays Content components list correctly', () => {
    const wrapper = shallow(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(1)
    const listItems = contentComponentsList
      .find('li')
      .map((c) => c.find('a').text())

    expect(listItems).toEqual([
      'Details',
      'Flash card',
      'HTML',
      'Inset text',
      'List',
      'Paragraph'
    ])
  })

  test('it selects Content components on click', () => {
    const wrapper = shallow(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(1)
    const listItems = contentComponentsList.find('li')

    listItems.forEach((item) => {
      expect(item.find('a').prop('onClick')).toBeInstanceOf(Function)
    })

    listItems.forEach((item) =>
      item.find('a').simulate('click', { preventDefault: jest.fn() })
    )

    expect(onSelectComponent.mock.calls.length).toEqual(listItems.length)
    expect(onSelectComponent.mock.calls[0][0]).toEqual({
      name: 'Details',
      type: 'Details',
      title: 'Details',
      subType: 'content',
      content: '',
      options: {},
      schema: {}
    })
  })

  test('it displays Input fields list correctly', () => {
    const wrapper = shallow(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(2)
    const listItems = contentComponentsList
      .find('li')
      .map((c) => c.find('a').text())

    expect(listItems).toEqual([
      'Autocomplete',
      'Date',
      'Date parts',
      'Date time',
      'Date time parts',
      'Email address',
      'File upload',
      'Month year parts',
      'Multiline text',
      'Number',
      'Telephone number',
      'Text',
      'Time',
      'UK address',
      'Website'
    ])
  })

  test('it selects Input components on click', () => {
    const wrapper = shallow(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(2)
    const listItems = contentComponentsList.find('li')

    listItems.forEach((item) => {
      expect(item.find('a').prop('onClick')).toBeInstanceOf(Function)
    })

    listItems.forEach((item) =>
      item.find('a').simulate('click', { preventDefault: jest.fn() })
    )

    expect(onSelectComponent.mock.calls.length).toEqual(listItems.length)
    expect(onSelectComponent.mock.calls[0][0]).toEqual({
      name: 'AutocompleteField',
      type: 'AutocompleteField',
      title: 'Autocomplete field',
      subType: 'listField',
      options: {},
      schema: {},
      list: ''
    })
  })

  test('it displays Selection fields list correctly', () => {
    const wrapper = shallow(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(3)
    const listItems = contentComponentsList
      .find('li')
      .map((c) => c.find('a').text())

    expect(listItems).toEqual(['Checkboxes', 'Radios', 'Select', 'YesNo'])
  })

  test('it selects Selection fields on click', () => {
    const wrapper = shallow(
      <ComponentCreateList onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(3)
    const listItems = contentComponentsList.find('li')

    listItems.forEach((item) => {
      expect(item.find('a').prop('onClick')).toBeInstanceOf(Function)
    })

    listItems.forEach((item) =>
      item.find('a').simulate('click', { preventDefault: jest.fn() })
    )

    expect(onSelectComponent.mock.calls.length).toEqual(listItems.length)
    expect(onSelectComponent.mock.calls[0][0]).toEqual({
      name: 'CheckboxesField',
      type: 'CheckboxesField',
      title: 'Checkboxes field',
      subType: 'listField',
      options: {},
      schema: {},
      list: ''
    })
  })
})
