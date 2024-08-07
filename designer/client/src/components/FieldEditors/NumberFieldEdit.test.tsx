import { ComponentType } from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { NumberFieldEdit } from '~/src/components/FieldEditors/NumberFieldEdit.jsx'
import {
  RenderWithContext,
  type RenderWithContextProps
} from '~/test/helpers/renderers.jsx'

describe('Number field edit', () => {
  afterEach(cleanup)

  describe('Number field edit fields', () => {
    let state: RenderWithContextProps['state']

    beforeEach(() => {
      state = {
        selectedComponent: {
          name: 'NumberFieldEditClass',
          title: 'Number field edit class',
          hint: 'Number field hint',
          type: ComponentType.NumberField,
          options: {},
          schema: {}
        }
      }

      render(
        <RenderWithContext state={state}>
          <NumberFieldEdit />
        </RenderWithContext>
      )
    })

    test('should display details link title', () => {
      const text = 'Additional settings'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display min title', () => {
      const text = 'Min'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display min help text', () => {
      const text = 'Specifies the lowest number users can enter'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display max title', () => {
      const text = 'Max'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display max help text', () => {
      const text = 'Specifies the highest number users can enter'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display precision title', () => {
      const text = 'Precision'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display precision help text', () => {
      const text =
        'Specifies the number of decimal places users can enter. For example, to allow users to enter numbers with up to two decimal places, set this to 2'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display prefix help text', () => {
      const text = 'Specifies the prefix of the field.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    test('should display suffix help text', () => {
      const text = 'Specifies the suffix of the field.'
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
