import React from 'react'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import { CssClasses } from '~/src/components/CssClasses/index.js'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('CssClasses', () => {
  afterEach(cleanup)

  describe('CssClassField', () => {
    const { getByText } = screen

    let stateProps

    beforeEach(() => {
      stateProps = {
        component: {
          type: 'CssClassField',
          name: 'TestCssClass',
          options: {}
        }
      }

      render(
        <RenderWithContext stateProps={stateProps}>
          <CssClasses />
        </RenderWithContext>
      )
    })

    test('should display display correct title', () => {
      const text = 'Classes'
      expect(getByText(text)).toBeInTheDocument()
    })

    test('should display display correct helptext', () => {
      const text =
        'Apply CSS classes to this field. For example, govuk-input govuk-!-width-full'
      expect(getByText(text)).toBeInTheDocument()
    })
  })
})
