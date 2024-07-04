import { ComponentSubType, ComponentType } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('AutocompleteField', () => {
  let state: RenderWithContextProps['state']

  beforeEach(() => {
    state = {
      selectedComponent: {
        name: 'TestCssClass',
        title: 'Test CSS class',
        list: 'Test list',
        type: ComponentType.AutocompleteField,
        subType: ComponentSubType.ListField,
        options: {},
        schema: {}
      }
    }

    render(
      <RenderWithContext state={state}>
        <Autocomplete />
      </RenderWithContext>
    )
  })

  afterEach(cleanup)

  test('should display display correct title', () => {
    const text = 'Autocomplete'
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  test('should display display correct helptext', () => {
    const text =
      "Add the autocomplete attribute to this field. For example, 'on' or 'given-name'."
    expect(screen.getByText(text)).toBeInTheDocument()
  })
})
