import { afterEach, beforeEach, describe, expect, test } from '@jest/globals'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { Autocomplete } from '~/src/components/Autocomplete/index.js'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

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
