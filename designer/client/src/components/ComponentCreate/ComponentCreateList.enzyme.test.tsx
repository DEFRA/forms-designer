import {
  ComponentType,
  ControllerType,
  getPageDefaults,
  type ComponentDef
} from '@defra/forms-model'
import { shallow } from 'enzyme'
import React from 'react'

import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'

describe('ComponentCreateList', () => {
  const page = getPageDefaults({
    controller: ControllerType.Page
  })

  const onSelectComponent = jest.fn()

  test('it displays Content components list correctly', () => {
    const wrapper = shallow(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(1)
    const listItems = contentComponentsList
      .find('li')
      .map((c) => c.find('button').text())

    expect(listItems).toEqual(['Details', 'Guidance', 'Inset text', 'List'])
  })

  test('it selects Content components on click', () => {
    const wrapper = shallow(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(1)
    const listItems = contentComponentsList.find('li')

    listItems.forEach((item) => {
      expect(item.find('button').prop('onClick')).toBeInstanceOf(Function)
    })

    listItems.forEach((item) =>
      item.find('button').simulate('click', { preventDefault: jest.fn() })
    )

    expect(onSelectComponent.mock.calls).toHaveLength(listItems.length)
    expect(onSelectComponent.mock.calls[0]).toEqual(
      expect.arrayContaining<ComponentDef>([
        {
          name: 'Details',
          title: 'Details',
          type: ComponentType.Details,
          content: '',
          options: {}
        }
      ])
    )
  })

  test('it displays Input fields list correctly', () => {
    const wrapper = shallow(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(2)
    const listItems = contentComponentsList
      .find('li')
      .map((c) => c.find('button').text())

    expect(listItems).toEqual([
      'Date',
      'Email address',
      'Month & year',
      'Textarea',
      'Number',
      'Telephone number',
      'Text input',
      'UK address'
    ])
  })

  test('it selects Input components on click', () => {
    const wrapper = shallow(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(2)
    const listItems = contentComponentsList.find('li')

    listItems.forEach((item) => {
      expect(item.find('button').prop('onClick')).toBeInstanceOf(Function)
    })

    listItems.forEach((item) =>
      item.find('button').simulate('click', { preventDefault: jest.fn() })
    )

    expect(onSelectComponent.mock.calls).toHaveLength(listItems.length)
    expect(onSelectComponent.mock.calls[0]).toEqual(
      expect.arrayContaining<ComponentDef>([
        {
          name: 'DatePartsField',
          title: 'Date field',
          type: ComponentType.DatePartsField,
          hint: '',
          options: {}
        }
      ])
    )
  })

  test('it displays Selection fields list correctly', () => {
    const wrapper = shallow(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(3)
    const listItems = contentComponentsList
      .find('li')
      .map((c) => c.find('button').text())

    expect(listItems).toEqual([
      'Autocomplete',
      'Checkboxes',
      'Radios',
      'Select',
      'YesNo'
    ])
  })

  test('it selects Selection fields on click', () => {
    const wrapper = shallow(
      <ComponentCreateList page={page} onSelectComponent={onSelectComponent} />
    )

    const contentComponentsList = wrapper.find('ol').at(3)
    const listItems = contentComponentsList.find('li')

    listItems.forEach((item) => {
      expect(item.find('button').prop('onClick')).toBeInstanceOf(Function)
    })

    listItems.forEach((item) =>
      item.find('button').simulate('click', { preventDefault: jest.fn() })
    )

    expect(onSelectComponent.mock.calls).toHaveLength(listItems.length)
    expect(onSelectComponent.mock.calls[0]).toEqual(
      expect.arrayContaining<ComponentDef>([
        {
          name: 'AutocompleteField',
          title: 'Autocomplete field',
          type: ComponentType.AutocompleteField,
          hint: '',
          list: '',
          options: {}
        }
      ])
    )
  })
})
