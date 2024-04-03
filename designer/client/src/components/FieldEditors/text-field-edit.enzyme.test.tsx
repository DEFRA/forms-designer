import { mount } from 'enzyme'
import React from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/text-field-edit.jsx'
import { MultilineTextFieldEdit } from '~/src/multiline-text-field-edit.js'
import * as Component from '~/src/reducers/component/componentReducer.jsx'

describe('TextField renders correctly when', () => {
  const wrapper = mount(
    <Component.ComponentContextProvider>
      <TextFieldEdit />
    </Component.ComponentContextProvider>
  )

  test('schema max length changes', () => {
    const field = () => wrapper.find('#field-schema-length').first()
    const length = 1337
    field().simulate('change', { target: { value: length } })
    expect(field().props().value).toBe(length)
  })

  test('schema min length changes', () => {
    const field = () => wrapper.find('#field-schema-min').first()
    const length = 42
    field().simulate('change', { target: { value: length } })
    expect(field().props().value).toBe(length)
  })

  test('schema max length changes', () => {
    const field = () => wrapper.find('#field-schema-max').first()
    const length = 42
    field().simulate('change', { target: { value: length } })
    expect(field().props().value).toBe(length)
  })

  test('schema regex changes', () => {
    const field = () => wrapper.find('#field-schema-regex')
    const regex = '/ab+c/'
    field().simulate('change', { target: { value: regex } })
    expect(field().props().value).toBe(regex)
  })
})

describe('MutlilineTextFieldEdit renders correctly when', () => {
  const wrapper = mount(
    <Component.ComponentContextProvider>
      <MultilineTextFieldEdit />
    </Component.ComponentContextProvider>
  )
  test('schema rows changes', () => {
    const field = () => wrapper.find('#field-options-rows')
    const newRows = 42
    field().simulate('change', { target: { value: newRows } })
    expect(field().props().value).toBe(newRows)
  })
})
