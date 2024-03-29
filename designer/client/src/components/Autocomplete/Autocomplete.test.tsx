import React from 'react'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import { Autocomplete } from './Autocomplete'
import { RenderWithContext } from '../../../test/helpers/renderers'

describe('AutocompleteField', () => {
  const { getByText } = screen

  let stateProps

  beforeEach(() => {
    stateProps = {
      component: {
        type: 'AutocompleteField',
        name: 'TestCssClass',
        options: {}
      }
    }

    render(
      <RenderWithContext stateProps={stateProps}>
        <Autocomplete />
      </RenderWithContext>
    )
  })

  afterEach(cleanup)

  test('should display display correct title', () => {
    const text = 'Autocomplete'
    expect(getByText(text)).toBeInTheDocument()
  })

  test('should display display correct helptext', () => {
    const text =
      "Add the autocomplete attribute to this field. For example, 'on' or 'given-name'."
    expect(getByText(text)).toBeInTheDocument()
  })
})
