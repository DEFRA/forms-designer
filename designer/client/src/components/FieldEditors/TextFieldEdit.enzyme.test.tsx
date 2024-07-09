import { ComponentType } from '@defra/forms-model'
import { mount, type ReactWrapper } from 'enzyme'
import React from 'react'

import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('TextField renders correctly when', () => {
  let state: RenderWithContextProps['state']
  let wrapper: ReactWrapper

  beforeEach(() => {
    state = {
      selectedComponent: {
        name: 'TextFieldEditClass',
        title: 'Text field edit class',
        type: ComponentType.TextField,
        options: {},
        schema: {}
      }
    }

    wrapper = mount(
      <RenderWithContext state={state}>
        <TextFieldEdit />
      </RenderWithContext>
    )
  })

  test('schema length changes', () => {
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
