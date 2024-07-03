import { ComponentType, type ComponentDef } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { CssClasses } from '~/src/components/CssClasses/CssClasses.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('CssClasses', () => {
  afterEach(cleanup)

  describe('CssClassField', () => {
    let state

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'TestCssClass',
          title: 'Test CSS class',
          type: ComponentType.TextField,
          options: {},
          schema: {}
        } satisfies ComponentDef
      }

      render(
        <RenderWithContext state={state}>
          <CssClasses />
        </RenderWithContext>
      )
    })

    test('should display display correct title', () => {
      const text = 'Classes'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display display correct helptext', () => {
      const text =
        'Apply CSS classes to this field. For example, govuk-input govuk-!-width-full'
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
