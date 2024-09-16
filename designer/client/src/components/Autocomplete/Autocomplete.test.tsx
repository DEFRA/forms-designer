import { ComponentType } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import React from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/Autocomplete.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('Autocomplete attribute', () => {
  let state: RenderWithContextProps['state']

  beforeEach(() => {
    state = {
      selectedComponent: {
        name: 'TestAutocompleteAttribute',
        title: 'Test autocomplete attribute',
        type: ComponentType.TextField,
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

  test('should display display correct title', () => {
    const text = 'Autocomplete'
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  test('should display display correct helptext', () => {
    const text =
      'Add the autocomplete attribute to this field. For example, ‘on’ or ‘given-name’'
    expect(screen.getByText(text)).toBeInTheDocument()
  })
})
