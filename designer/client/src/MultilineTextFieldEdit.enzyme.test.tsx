import { ComponentType } from '@defra/forms-model'
import { mount, type ReactWrapper } from 'enzyme'
import React from 'react'

import { MultilineTextFieldEdit } from '~/src/MultilineTextFieldEdit.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('MutlilineTextFieldEdit renders correctly when', () => {
  let state: RenderWithContextProps['state']
  let wrapper: ReactWrapper

  beforeEach(() => {
    state = {
      selectedComponent: {
        name: 'MultilineTextFieldEditClass',
        title: 'Multiline text field edit class',
        type: ComponentType.MultilineTextField,
        options: {},
        schema: {}
      }
    }

    wrapper = mount(
      <RenderWithContext state={state}>
        <MultilineTextFieldEdit />
      </RenderWithContext>
    )
  })

  test('schema rows changes', () => {
    const field = () => wrapper.find('#field-options-rows')
    const newRows = 42
    field().simulate('change', { target: { value: newRows } })
    expect(field().props().value).toBe(newRows)
  })
})
