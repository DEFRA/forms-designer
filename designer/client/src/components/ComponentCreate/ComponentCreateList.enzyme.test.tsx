import { ComponentType, ComponentSubType } from '@defra/forms-model'
import { shallow } from 'enzyme'
import React from 'react'

import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'

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

    expect(listItems).toEqual(['Details', 'Guidance', 'Inset text', 'List'])
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

    expect(onSelectComponent.mock.calls).toHaveLength(listItems.length)
    expect(onSelectComponent.mock.calls[0]).toEqual(
      expect.arrayContaining([
        {
          name: 'Details',
          title: 'Details',
          type: ComponentType.Details,
          subType: ComponentSubType.Content,
          content: '',
          options: {},
          schema: {}
        }
      ])
    )
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
      'Email address',
      'Month & year',
      'Textarea',
      'Number',
      'Telephone number',
      'Text input',
      'Time',
      'UK address'
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

    expect(onSelectComponent.mock.calls).toHaveLength(listItems.length)
    expect(onSelectComponent.mock.calls[0]).toEqual(
      expect.arrayContaining([
        {
          name: 'AutocompleteField',
          title: 'Autocomplete field',
          list: '',
          type: ComponentType.AutocompleteField,
          subType: ComponentSubType.ListField,
          options: {},
          schema: {}
        }
      ])
    )
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

    expect(onSelectComponent.mock.calls).toHaveLength(listItems.length)
    expect(onSelectComponent.mock.calls[0]).toEqual(
      expect.arrayContaining([
        {
          name: 'CheckboxesField',
          title: 'Checkboxes field',
          list: '',
          type: ComponentType.CheckboxesField,
          subType: ComponentSubType.ListField,
          options: {},
          schema: {}
        }
      ])
    )
  })
})
